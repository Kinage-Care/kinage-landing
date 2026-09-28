#!/usr/bin/env node
/**
 * The site as a static host serves it, under its base path: every page loads
 * directly and on refresh, assets resolve, navigation stays under the base,
 * the video plays, and the contact dialog reports honestly.
 *
 *   npm run preview:pages                       (in another terminal)
 *   node scripts/verify/pages.mjs [--url=http://localhost:5191/kinage-landing/]
 *   node scripts/verify/pages.mjs --url=https://<owner>.github.io/kinage-landing/
 */
import { chromium } from 'playwright-core';

const arg = (name, def) => (process.argv.find((a) => a.startsWith(`--${name}=`)) ?? `=${def}`).split('=').slice(1).join('=');
const root = arg('url', 'http://localhost:5191/kinage-landing/').replace(/\/?$/, '/');
const basePath = new URL(root).pathname; // e.g. /kinage-landing/
const rows = [];
const log = (check, ok, detail = '') => rows.push({ check, ok, detail: String(detail).slice(0, 120) });

const browser = await chromium.launch({ channel: 'chrome', headless: true });

async function open(width = 1440, height = 900) {
  const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  const errors = [];
  const failed = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  // Chrome aborts the rest of a media download once it has what it needs — expected.
  page.on('requestfailed', (r) => r.failure()?.errorText !== 'net::ERR_ABORTED' && failed.push(r.url()));
  page.on('response', (r) => r.status() >= 400 && r.request().resourceType() !== 'document' && failed.push(`${r.status()} ${r.url()}`));
  return { ctx, page, errors, failed };
}

const which = (page) =>
  page.evaluate(() => ({
    page: document.querySelector('.story') ? 'story' : document.querySelector('.adv') ? 'advisors' : document.querySelector('.hero') ? 'home' : 'none',
    h1: document.querySelector('h1')?.textContent.replace(/\s+/g, ' ').trim(),
    path: location.pathname,
  }));

// 1 · direct loads and refreshes
{
  const { ctx, page, errors, failed } = await open();
  for (const [rel, want] of [['', 'home'], ['our-story', 'story'], ['our-story/', 'story'], ['advisors', 'advisors'], ['advisors/', 'advisors']]) {
    const res = await page.goto(root + rel, { waitUntil: 'networkidle' });
    const a = await which(page);
    await page.reload({ waitUntil: 'networkidle' });
    const b = await which(page);
    log(`direct load + refresh of ${basePath}${rel}`, res.status() === 200 && a.page === want && b.page === want, `HTTP ${res.status()} → ${a.page} "${a.h1}" at ${a.path}; after refresh ${b.page}`);
  }
  const res404 = await page.goto(root + 'no-such-page', { waitUntil: 'networkidle' });
  const nf = await which(page);
  // GitHub Pages answers 404 (with 404.html); `vite preview` falls back with 200.
  log('unknown path: the app still renders (the landing)', [200, 404].includes(res404.status()) && nf.page === 'home', `HTTP ${res404.status()} → ${nf.page}`);
  // Chrome logs the intended 404 document itself as a console error; start the asset checks clean.
  errors.length = 0;
  failed.length = 0;

  // assets
  await page.goto(root, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
  const assets = await page.evaluate(async () => {
    await document.fonts.ready;
    const icons = [...document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]')].map((l) => l.href);
    const iconStatus = await Promise.all(icons.map((h) => fetch(h, { method: 'HEAD' }).then((r) => r.status)));
    const video = document.querySelector('video');
    const media = await Promise.all([video.currentSrc || video.src, video.poster].map((h) => fetch(h, { method: 'HEAD' }).then((r) => `${r.status} ${r.headers.get('content-type')}`)));
    return {
      fonts: [...new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight}`))],
      broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
      icons: icons.map((h, i) => `${iconStatus[i]} ${new URL(h).pathname}`),
      media,
      videoSrc: new URL(video.currentSrc || video.src).pathname,
      rootLinks: [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href')).filter((h) => !h.startsWith(location.pathname.replace(/[^/]*$/, ''))),
    };
  });
  log('fonts: Museo Sans 300/500/700/900 loaded', ['300', '500', '700', '900'].every((w) => assets.fonts.includes(`Museo Sans ${w}`)), assets.fonts.join(' · '));
  log('images: none broken', assets.broken.length === 0, assets.broken.join(' '));
  log('favicons resolve under the base', assets.icons.every((i) => i.startsWith('200 ' + basePath)), assets.icons.join(' · '));
  log('video + poster resolve under the base', assets.videoSrc.startsWith(basePath) && assets.media.every((m) => m.startsWith('200')), `${assets.videoSrc} · ${assets.media.join(' · ')}`);
  log('every root-relative link stays under the base', assets.rootLinks.length === 0, assets.rootLinks.join(' '));
  log('no failed requests', failed.length === 0, failed.join(' | '));
  log('no console errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// 2 · navigation between pages and to sections
{
  const { ctx, page, errors } = await open();
  await page.goto(root, { waitUntil: 'networkidle' });
  await page.click(`.nav__link[href="${basePath}our-story"]`);
  await page.waitForTimeout(700);
  const s = await which(page);
  log('nav → Our Story', s.page === 'story' && s.path === `${basePath}our-story`, `${s.path} "${s.h1}"`);
  await page.click(`.nav__link[href="${basePath}advisors"]`);
  await page.waitForTimeout(700);
  const a = await which(page);
  log('nav → For Advisors', a.page === 'advisors' && a.path === `${basePath}advisors`, `${a.path} "${a.h1}"`);
  await page.goBack();
  await page.waitForTimeout(500);
  log('Back → Our Story', (await which(page)).page === 'story');
  await page.click(`.nav__link[href="${basePath}#how-it-works"]`);
  await page.waitForTimeout(2500);
  const h = await page.evaluate(() => ({ page: document.querySelector('.hero') ? 'home' : '?', path: location.pathname, hash: location.hash, top: Math.round(document.getElementById('how-it-works').getBoundingClientRect().top) }));
  log('section link from another page returns to the landing and scrolls there', h.page === 'home' && h.path === basePath && h.hash === '#how-it-works' && Math.abs(h.top) < 140, JSON.stringify(h));
  await page.click('.nav__brand');
  await page.waitForTimeout(2500);
  log('logo → top of the landing', (await page.evaluate(() => Math.round(scrollY))) < 5);
  log('navigation: no console errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// 3 · video playback
{
  const { ctx, page } = await open();
  await page.goto(root + '#how-it-works', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const play = page.locator('.how button, .how [role="button"]').first();
  await play.scrollIntoViewIfNeeded();
  await play.click();
  await page.waitForTimeout(2500);
  const v = await page.evaluate(() => { const e = document.querySelector('video'); return { paused: e.paused, t: +e.currentTime.toFixed(2), ready: e.readyState, w: e.videoWidth, err: e.error?.code ?? null }; });
  log('video plays from the Pages URL', !v.paused && v.t > 0.5 && v.ready >= 2 && v.w > 0 && v.err === null, JSON.stringify(v));
  await ctx.close();
}

// 4 · contact dialog, all three modes: validation, then an honest result
for (const [label, width] of [['desktop', 1440], ['mobile', 390]]) {
  const { ctx, page, errors } = await open(width, width > 800 ? 900 : 844);
  await page.goto(root, { waitUntil: 'networkidle' });
  const results = [];
  for (const name of ['Get Early Access', 'Ask about plans', 'Partner with Kinage']) {
    const btn = page.getByRole('button', { name }).last();
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await page.waitForTimeout(400);
    // The form keeps what was typed across modes; start each mode empty.
    for (const f of await page.locator('.ea__form [name]').all()) await f.fill('');
    await page.click('.ea__submit');
    const errs = await page.locator('.ea__error').count();
    await page.fill('[name="firstName"]', 'Test');
    await page.fill('[name="lastName"]', 'Preview');
    await page.fill('[name="email"]', 'test@example.com');
    const msg = page.locator('[name="message"]');
    if (await msg.count()) await msg.fill('Checking the preview site.');
    await page.click('.ea__submit');
    await page.waitForTimeout(800);
    const r = await page.evaluate(() => ({ alert: document.querySelector('.ea__alert')?.textContent.trim().slice(0, 40) ?? '', done: !!document.querySelector('.ea__done') }));
    results.push(`${name}: ${errs} errors on empty submit, then ${r.done ? 'SENT' : r.alert ? `"${r.alert}…"` : '?'}`);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }
  const honest = results.every((r) => /[1-9] errors/.test(r) && /couldn’t send/.test(r));
  log(`contact dialog (${label}): validates, and without an endpoint says it could not send`, honest, results.join(' | '));
  log(`contact dialog (${label}): no console errors`, errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// 5 · mobile menu
{
  const { ctx, page } = await open(390, 844);
  await page.goto(root, { waitUntil: 'networkidle' });
  await page.click('.nav__toggle');
  await page.waitForTimeout(400);
  await page.click(`.nav__link[href="${basePath}advisors"]`);
  await page.waitForTimeout(800);
  const m = await which(page);
  const open_ = await page.evaluate(() => !!document.querySelector('.nav[data-open]'));
  log('mobile menu → For Advisors, menu closes', m.page === 'advisors' && !open_, `${m.path} menu open: ${open_}`);
  await ctx.close();
}

await browser.close();
console.table(rows);
const bad = rows.filter((r) => !r.ok).length;
console.log(bad ? `✗ ${bad} of ${rows.length} checks failed (${root})` : `✓ all ${rows.length} checks passed (${root})`);
process.exit(bad ? 1 : 0);
