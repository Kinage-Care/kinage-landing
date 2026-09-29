#!/usr/bin/env node
/**
 * Behaviour checks for everything except the hero flight (see flight.mjs).
 *
 *   npm run dev              (in another terminal)
 *   npm run verify:interactions
 *
 * Saves frames to verification/ and prints a pass/fail table.
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const url = (process.argv.find((a) => a.startsWith('--url=')) ?? '--url=http://localhost:5190/').slice(6);
const out = 'verification';
mkdirSync(out, { recursive: true });
const rows = [];
const log = (check, ok, detail = '') => rows.push({ check, ok, detail: String(detail).slice(0, 90) });

const browser = await chromium.launch({ channel: 'chrome', headless: true });

async function open(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference', ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.mouse.move(2, 2);
  return { ctx, page, errors };
}
const scrollToEl = (page, sel, offset = 0) =>
  page.evaluate(
    ([s, o]) => {
      const el = document.querySelector(s);
      window.scrollTo(0, scrollY + el.getBoundingClientRect().top - o);
    },
    [sel, offset],
  );
const wait = (page, ms) => page.waitForTimeout(ms);

/* ---------------------------------------------------------------- motion on */
{
  const { ctx, page, errors } = await open();

  // --- Phone demo (Family Financial Oversight)
  await scrollToEl(page, '.what', 60);
  await wait(page, 350);
  await page.screenshot({ path: `${out}/demo-1-entering.png`, clip: { x: 740, y: 60, width: 640, height: 480 } });
  await wait(page, 2600);
  await page.screenshot({ path: `${out}/demo-2-first-alert.png`, clip: { x: 740, y: 60, width: 640, height: 480 } });
  // mid-typing
  await page.waitForFunction(() => (document.querySelector('[data-demo="typed"]')?.textContent ?? '').length > 12, null, { timeout: 8000 });
  const typedMid = await page.$eval('[data-demo="typed"]', (e) => e.textContent);
  log('demo types the question', typedMid.length > 12, typedMid);
  await page.screenshot({ path: `${out}/demo-3-typing.png`, clip: { x: 740, y: 60, width: 640, height: 480 } });
  await page.waitForFunction(() => getComputedStyle(document.querySelector('[data-demo="thinking"]')).display !== 'none' && Number(getComputedStyle(document.querySelector('[data-demo="thinking"]')).opacity) > 0.5, null, { timeout: 8000 });
  log('reply indicator appears', true);
  await page.screenshot({ path: `${out}/demo-4-thinking.png`, clip: { x: 740, y: 60, width: 640, height: 480 } });
  await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('[data-demo="s2-more"]')).opacity) > 0.99, null, { timeout: 15000 });
  const tDone = Date.now();
  const final = await page.evaluate(() => {
    const phone = document.querySelector('.phone').getBoundingClientRect();
    const pn = document.querySelector('.phone-demo').getBoundingClientRect();
    const s2 = document.querySelector('[data-demo="s2"]').getBoundingClientRect();
    const composer = document.querySelector('.pm__composer').getBoundingClientRect();
    const screen = document.querySelector('.phone__screen').getBoundingClientRect();
    return {
      reply: document.querySelector('[data-demo="s2-message"]').textContent,
      s2: getComputedStyle(document.querySelector('[data-demo="s2"]')).opacity,
      thinking: getComputedStyle(document.querySelector('[data-demo="thinking"]')).display,
      replay: !!document.querySelector('.demo__replay, .mock'),
      shift: +(phone.left + phone.width / 2 - (pn.left + pn.width / 2)).toFixed(1),
      overlap: +(pn.top - phone.top).toFixed(1),
      clear: +(composer.top - s2.bottom).toFixed(1),
      inside: s2.left >= screen.left && s2.right <= screen.right,
    };
  });
  log('reply + review cards shown, no Replay control', final.s2 === '1' && final.thinking === 'none' && !final.replay, final.reply);
  log('phone: Figma offset (+7.4) and deliberate 62.3px projection above the panel', Math.abs(final.shift - 7.4) <= 0.6 && Math.abs(final.overlap - 62.3) <= 0.6, `shift ${final.shift} overlap ${final.overlap}`);
  log('phone: reply cards stay inside the screen, clear of the composer', final.inside && final.clear > 0, `clearance ${final.clear}px`);
  await page.screenshot({ path: `${out}/demo-5-final.png`, clip: { x: 740, y: 60, width: 640, height: 480 } });
  // Hold ~3 s on the completed state, then fade and start again.
  await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('[data-demo="s2-more"]')).opacity) < 0.9, null, { timeout: 8000 });
  const hold = (Date.now() - tDone) / 1000;
  log('completed state held ~3 s before the loop resets', hold > 2.7 && hold < 3.9, `${hold.toFixed(2)} s`);
  await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('[data-demo="overview"]')).opacity) > 0.9 && Number(getComputedStyle(document.querySelector('[data-demo="s2"]')).opacity) < 0.1, null, { timeout: 4000 });
  log('demo restarts automatically after the reset', true);

  // offscreen pause
  await scrollToEl(page, '.faq', 0);
  const t0 = await page.$eval('[data-demo="typed"]', (e) => e.textContent);
  await wait(page, 2500);
  const t1 = await page.$eval('[data-demo="typed"]', (e) => e.textContent);
  log('demo pauses off screen', t0 === t1, `${t0.length}→${t1.length} chars`);

  // --- Sticky stack
  const stack = await page.evaluate(() => {
    const layers = [...document.querySelectorAll('.stack__layer')];
    return layers.map((l) => ({ pos: getComputedStyle(l).position, top: getComputedStyle(l).top, z: getComputedStyle(l).zIndex, h: Math.round(l.offsetHeight) }));
  });
  log('stack: first two sticky, last in flow', stack[0].pos === 'sticky' && stack[1].pos === 'sticky' && stack[2].pos === 'relative', JSON.stringify(stack.map((s) => `${s.pos}/${s.top}/z${s.z}`)));
  // Natural (unstuck) document offsets: stack top + heights of the layers above.
  const layerStart = (i) =>
    page.evaluate((idx) => {
      const stackEl = document.querySelector('.stack');
      const layers = [...stackEl.children];
      const top = scrollY + stackEl.getBoundingClientRect().top;
      return top + layers.slice(0, idx).reduce((sum, l) => sum + l.offsetHeight, 0);
    }, i);
  const founderStart = await layerStart(1);
  await page.evaluate((y) => window.scrollTo(0, y - 450), founderStart);
  await wait(page, 250);
  const cover = await page.evaluate(() => ({
    atFounder: document.elementFromPoint(720, 600).closest('.founder, .advisors, .benefits')?.className,
    advisorsTop: Math.round(document.querySelector('.advisors').getBoundingClientRect().top),
  }));
  await page.screenshot({ path: `${out}/stack-1-founder-rising.png` });
  log('Ben’s section rises over advisors', cover.atFounder?.includes('founder'), JSON.stringify(cover));
  const benefitsStart = await layerStart(2);
  await page.evaluate((y) => window.scrollTo(0, y - 420), benefitsStart);
  await wait(page, 250);
  const cover2 = await page.evaluate(() => document.elementFromPoint(720, 650).closest('.founder, .advisors, .benefits')?.className);
  await page.screenshot({ path: `${out}/stack-2-benefits-rising.png` });
  log('benefits rise over Ben’s section', cover2?.includes('benefits'), cover2);
  const howPos = await page.evaluate(() => getComputedStyle(document.querySelector('.how')).position);
  log('How it works stays in normal flow', howPos === 'static', howPos);

  // --- Roadmap reveal
  await scrollToEl(page, '.steps', 500);
  await wait(page, 1600);
  const steps = await page.evaluate(() => [...document.querySelectorAll('.step')].map((s) => getComputedStyle(s).opacity));
  const lines = await page.evaluate(() => [...document.querySelectorAll('.step__line')].map((l) => getComputedStyle(l).transform));
  log('roadmap steps revealed 1→4', steps.every((o) => o === '1'), `${steps.join(',')} lines ${lines.length}`);

  // --- Video
  await scrollToEl(page, '.video', 120);
  await wait(page, 900);
  await page.click('.video__play');
  await wait(page, 1200);
  const vid = await page.evaluate(() => {
    const v = document.querySelector('.video__media');
    // The player's own bar (seek, play, time, sound, CC, full screen) replaces the native controls.
    const bar = document.querySelector('.video__controls');
    return { paused: v.paused, controls: !!bar && getComputedStyle(bar).opacity !== '0' && !!bar.querySelector('.video__btn--cc'), muted: v.muted, subtitles: v.textTracks[0]?.mode, t: +v.currentTime.toFixed(2) };
  });
  log('video plays with sound on click, its control bar (incl. CC) shown, subtitles on', !vid.paused && vid.controls && !vid.muted && vid.subtitles !== 'disabled', JSON.stringify(vid));
  await page.evaluate(() => document.querySelector('.video__media').pause());

  // --- Carousel
  await scrollToEl(page, '.testimonials', 60);
  await wait(page, 800);
  const active = () => page.evaluate(() => document.querySelector('.carousel__stage > .quote-card[data-offset="0"] .quote-card__who').textContent);
  const a0 = await active();
  await page.mouse.move(2, 2);
  await wait(page, 4700);
  const a1 = await active();
  log('autoplay advances after ~4s', a0 !== a1, `${a0} → ${a1}`);
  const h0 = await page.$eval('.testimonials', (e) => e.offsetHeight);
  await page.click('.carousel__arrow--next');
  await wait(page, 800);
  const a2 = await active();
  const h1 = await page.$eval('.testimonials', (e) => e.offsetHeight);
  log('next arrow moves, section height stable', a2 !== a1 && h0 === h1, `${a2} · ${h0}px→${h1}px`);
  const pauseButtons = await page.evaluate(() =>
    [...document.querySelectorAll('.testimonials button')].filter((b) => /pause|play/i.test(b.textContent + (b.getAttribute('aria-label') ?? ''))).length,
  );
  log('no visible pause/play control', pauseButtons === 0 && !(await page.$('.carousel__toggle')), `${pauseButtons} buttons`);
  await page.focus('.carousel__arrow--prev');
  const focusedBefore = await page.evaluate(() => document.activeElement.className);
  await page.keyboard.press('ArrowLeft');
  await wait(page, 800);
  const a3 = await active();
  const focusedAfter = await page.evaluate(() => document.activeElement.className);
  log('← key navigates, focus not moved', a3 !== a2 && focusedBefore === focusedAfter, `${a3} · focus ${focusedAfter}`);
  const box = await page.$eval('.carousel__stage', (e) => {
    const r = e.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  await page.mouse.move(box.x + 120, box.y);
  await page.mouse.down();
  await page.mouse.move(box.x - 60, box.y, { steps: 6 });
  await page.mouse.up();
  await wait(page, 800);
  const a4 = await active();
  log('swipe/drag left advances', a4 !== a3, a4);
  // Manual use does not switch autoplay off: once pointer and focus leave, it keeps going.
  await page.evaluate(() => document.activeElement?.blur());
  await page.mouse.move(2, 2);
  await wait(page, 4700);
  const a5 = await active();
  log('autoplay continues after manual use', a5 !== a4, `${a4} → ${a5}`);
  await page.screenshot({ path: `${out}/carousel.png`, clip: { x: 0, y: 150, width: 1440, height: 420 } });

  // --- FAQ
  await scrollToEl(page, '.faq', 40);
  await wait(page, 300);
  const q = page.locator('.faq__button');
  await q.nth(0).click();
  await wait(page, 450);
  let st = await page.evaluate(() => [...document.querySelectorAll('.faq__button')].map((b) => b.getAttribute('aria-expanded')));
  const h = await page.evaluate(() => document.querySelectorAll('.faq__panel')[0].offsetHeight);
  log('FAQ opens with height', st[0] === 'true' && h > 20, `height ${h}`);
  await q.nth(1).focus();
  await page.keyboard.press('Enter');
  await wait(page, 450);
  st = await page.evaluate(() => [...document.querySelectorAll('.faq__button')].map((b) => b.getAttribute('aria-expanded')));
  log('Enter opens next, one open at a time', st[0] === 'false' && st[1] === 'true', st.slice(0, 3).join(','));
  await page.keyboard.press(' ');
  await wait(page, 450);
  st = await page.evaluate(() => [...document.querySelectorAll('.faq__button')].map((b) => b.getAttribute('aria-expanded')));
  log('Space toggles closed', st[1] === 'false');
  const rel = await page.evaluate(() => {
    const b = document.querySelector('.faq__button');
    const p = document.getElementById(b.getAttribute('aria-controls'));
    return p && p.getAttribute('aria-labelledby') === b.id && p.hasAttribute('inert');
  });
  log('button ↔ panel relationship + inert when closed', rel);
  const heading = await page.$eval('#faq-title', (e) => e.textContent.trim());
  log('FAQ heading has no trailing period', heading === 'Common questions', heading);
  await q.nth(0).click();
  await wait(page, 450);
  await page.screenshot({ path: `${out}/faq-open.png`, clip: { x: 300, y: 0, width: 840, height: 700 } });

  // --- Keyboard focus visibility
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const focus = await page.evaluate(() => {
    const el = document.activeElement;
    const cs = getComputedStyle(el);
    return { el: el.className || el.tagName, outline: cs.outlineStyle, w: cs.outlineWidth };
  });
  log('visible focus ring on keyboard focus', focus.outline !== 'none' && focus.w !== '0px', JSON.stringify(focus));

  log('no console errors (motion on)', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

/* ------------------------------------------------------------ reduced motion */
{
  const { ctx, page, errors } = await open({ reducedMotion: 'reduce' });
  const r = await page.evaluate(() => ({
    flying: document.querySelector('.flight-zone').classList.contains('is-flying'),
    heroStatic: [...document.querySelectorAll('.hero__slot img')].every((i) => getComputedStyle(i).visibility === 'visible'),
    cardStatic: [...document.querySelectorAll('.problem-card__slot img')].every((i) => getComputedStyle(i).visibility === 'visible'),
    demoActive: document.querySelector('.phone-demo').hasAttribute('data-demo-active'),
    sticky: getComputedStyle(document.querySelector('.stack__layer')).position,
    hidden: [...document.querySelectorAll('[data-reveal], .step, .stat, .trust-card, .benefit')].filter((e) => getComputedStyle(e).visibility === 'hidden' || getComputedStyle(e).opacity === '0').length,
  }));
  log('reduced motion: no flight, static Figma composition', !r.flying && r.heroStatic && r.cardStatic, JSON.stringify(r));
  log('reduced motion: demo static, stack in flow, nothing hidden', !r.demoActive && r.sticky === 'relative' && r.hidden === 0);
  await scrollToEl(page, '.testimonials', 60);
  const a0 = await page.evaluate(() => document.querySelector('.quote-card[data-offset="0"]').textContent);
  await wait(page, 5000);
  const a1 = await page.evaluate(() => document.querySelector('.quote-card[data-offset="0"]').textContent);
  log('reduced motion: no carousel autoplay', a0 === a1);
  log('no console errors (reduced)', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

await browser.close();
console.table(rows);
process.exitCode = rows.every((r) => r.ok) ? 0 : 1;
