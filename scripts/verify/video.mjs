#!/usr/bin/env node
/**
 * Explainer video player: subtitles on by default and in sync, the CC toggle
 * and its persistence, seeking, full screen, phone size.
 *
 *   npm run dev                     (in another terminal)
 *   node scripts/verify/video.mjs [--url=http://localhost:5190/] [--out=verification/video]
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const arg = (name, def) => (process.argv.find((a) => a.startsWith(`--${name}=`)) ?? `=${def}`).split('=').slice(1).join('=');
const url = arg('url', 'http://localhost:5190/');
const out = arg('out', 'verification/video');
mkdirSync(out, { recursive: true });
const rows = [];
const log = (check, ok, detail = '') => rows.push({ check, ok, detail: String(detail).slice(0, 120) });

const browser = await chromium.launch({ channel: 'chrome', headless: true });

const state = (page) =>
  page.evaluate(() => {
    const v = document.querySelector('.video__media');
    const t = v.textTracks[0];
    const cap = document.querySelector('.video__captions');
    const cc = document.querySelector('.video__btn--cc');
    const box = document.querySelector('.video').getBoundingClientRect();
    const capBox = cap?.getBoundingClientRect();
    const bar = document.querySelector('.video__controls')?.getBoundingClientRect();
    return {
      t: +v.currentTime.toFixed(2),
      paused: v.paused,
      mode: t?.mode,
      cues: t?.cues?.length ?? 0,
      active: t?.activeCues?.[0]?.text ?? '',
      shown: cap ? cap.textContent : '',
      capVisible: !!capBox && capBox.width > 0 && capBox.top >= box.top && capBox.bottom <= box.bottom && capBox.left >= box.left - 0.5 && capBox.right <= box.right + 0.5,
      capAboveBar: !!capBox && !!bar && getComputedStyle(document.querySelector('.video__controls')).opacity !== '0' ? capBox.bottom <= bar.top + 22 : true,
      capFont: cap ? parseFloat(getComputedStyle(cap.querySelector('span')).fontSize) : 0,
      pressed: cc?.getAttribute('aria-pressed'),
      time: document.querySelector('.video__time')?.textContent.replace(/^Time\s*/, ''),
      fs: document.fullscreenElement?.className ?? null,
      src: new URL(v.currentSrc || v.src).pathname,
    };
  });

const seek = async (page, s) => {
  await page.evaluate((s) => {
    const r = document.querySelector('.video__seek');
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    set.call(r, String(s));
    r.dispatchEvent(new Event('input', { bubbles: true }));
    r.dispatchEvent(new Event('change', { bubbles: true }));
  }, s);
  await page.waitForFunction((s) => Math.abs(document.querySelector('.video__media').currentTime - s) < 0.4, s, { timeout: 8000 });
  await page.waitForTimeout(350);
};

// ---- desktop
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.getElementById('how-it-works').scrollIntoView());
  await page.waitForTimeout(1200);

  const trk = await page.evaluate(async () => {
    const el = document.querySelector('.video__media track');
    for (let i = 0; i < 40 && el.readyState !== 2; i++) await new Promise((r) => setTimeout(r, 100));
    const res = await fetch(el.src);
    return { kind: el.kind, srclang: el.srclang, label: el.label, def: el.default, ready: el.readyState, mode: el.track.mode, path: new URL(el.src).pathname, status: res.status, type: res.headers.get('content-type'), vtt: (await res.text()).startsWith('WEBVTT') };
  });
  log('subtitle track: kind subtitles, en, "English", default; VTT loads (200, WEBVTT)', trk.kind === 'subtitles' && trk.srclang === 'en' && trk.label === 'English' && trk.def && trk.ready === 2 && trk.status === 200 && trk.vtt, JSON.stringify(trk));

  await page.click('.video__play');
  await page.waitForTimeout(1500);
  let s = await state(page);
  log('click plays with the custom bar; CC shows on; track on (hidden = drawn by the page)', !s.paused && s.pressed === 'true' && s.mode === 'hidden' && s.cues === 18 && /1:03$/.test(s.time), `"${s.time}" · CC ${s.pressed} · mode ${s.mode} · ${s.cues} cues`);
  log('video file is the new explainer under the base path', /kinage-explainer\.mp4$/.test(s.src), s.src);

  // Beginning, middle and end cues at their defined times, and a gap between cues.
  const expect = [
    [9.3, 'Don’t worry, all of this now lives\nin one place on your Kinage app.'],
    [12.75, ''],
    [36.5, 'Plaid makes the connection\nbetween your bank and Kinage.'],
    [61, 'Whenever you are ready, get started below.'],
  ];
  // Paused, so the reading is taken exactly at the cue time.
  await page.evaluate(() => document.querySelector('.video__media').pause());
  for (const [t, text] of expect) {
    await seek(page, t);
    s = await state(page);
    const ok = s.active === text && s.shown === text && (text === '' || (s.capVisible && s.capAboveBar));
    log(`subtitles at ${t}s ${text ? `show "${text.split('\n')[0]}…"` : 'show nothing (between cues)'}`, ok, `${s.t}s shown "${s.shown.replace(/\n/g, ' / ')}" font ${s.capFont}px visible ${s.capVisible}`);
    if (t === 36.5) await page.screenshot({ path: `${out}/desktop-subtitles-36s.png`, clip: await page.locator('.video').boundingBox() });
  }

  await page.evaluate(() => document.querySelector('.video__media').play());
  // Off, then play / pause / seek / resume: stays off.
  await page.click('.video__btn--cc');
  await page.waitForTimeout(200);
  s = await state(page);
  const offNow = s.mode === 'disabled' && s.pressed === 'false' && s.shown === '';
  await page.evaluate(() => document.querySelector('.video__media').pause());
  await seek(page, 21.8);
  await page.evaluate(() => document.querySelector('.video__media').play());
  await page.waitForTimeout(1400);
  await page.evaluate(() => document.querySelector('.video__media').pause());
  await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelector('.video__media').play());
  await page.waitForTimeout(900);
  s = await state(page);
  log('CC off: track disabled, nothing drawn — and it stays off through pause, seek and resume', offNow && s.mode === 'disabled' && s.pressed === 'false' && s.shown === '' && !s.paused, JSON.stringify(s));
  await page.screenshot({ path: `${out}/desktop-subtitles-off.png`, clip: await page.locator('.video').boundingBox() });

  // Keyboard "c" turns them back on, at the current cue.
  await page.focus('.video__btn--cc');
  await page.keyboard.press('c');
  await page.waitForTimeout(300);
  s = await state(page);
  log('"c" turns them back on; the current cue appears at once', s.mode === 'hidden' && s.pressed === 'true' && s.shown === s.active && s.active !== '', JSON.stringify(s));

  // Full screen: the whole player, subtitles larger.
  await seek(page, 26.8);
  const before = (await state(page)).capFont;
  await page.click('.video__btn[aria-label="Full screen"]');
  await page.waitForTimeout(800);
  s = await state(page);
  const fsOk = s.fs?.includes('video') && s.shown === s.active && s.capVisible && s.capFont >= before;
  await page.screenshot({ path: `${out}/desktop-fullscreen.png` });
  log('full screen: the whole player (bar + subtitles), subtitles still drawn and not smaller', !!fsOk, `fs=${s.fs} font ${before}→${s.capFont}px "${s.shown.split('\n')[0]}"`);
  await page.keyboard.press('f');
  await page.waitForTimeout(600);
  s = await state(page);
  log('"f" leaves full screen', s.fs === null, `fs=${s.fs}`);

  // Controls fade while playing, come back on movement.
  await page.mouse.move(700, 300);
  await page.evaluate(() => document.activeElement?.blur());
  await page.waitForTimeout(3400);
  const faded = await page.evaluate(() => document.querySelector('.video').hasAttribute('data-idle'));
  const box = await page.locator('.video').boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(300);
  const back = await page.evaluate(() => !document.querySelector('.video').hasAttribute('data-idle'));
  log('controls fade while playing and come back on pointer movement', faded && back, `faded ${faded} back ${back}`);
  log('desktop: no console errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// ---- phone
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.getElementById('how-it-works').scrollIntoView());
  await page.waitForTimeout(1200);
  await page.tap('.video__play');
  await page.waitForTimeout(1500);
  await seek(page, 21.8);
  const s = await state(page);
  const bar = await page.evaluate(() => [...document.querySelectorAll('.video__bar > *')].map((e) => { const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.right), Math.round(r.height)]; }));
  const vb = await page.locator('.video').boundingBox();
  const fits = bar.every(([l, r]) => l >= vb.x - 0.5 && r <= vb.x + vb.width + 0.5);
  const targets = await page.evaluate(() => [...document.querySelectorAll('.video__btn')].every((b) => b.getBoundingClientRect().width >= 40 && b.getBoundingClientRect().height >= 40));
  await page.screenshot({ path: `${out}/phone-subtitles.png`, clip: { x: vb.x, y: vb.y, width: vb.width, height: vb.height } });
  log('phone: subtitles on, readable (≥14px), inside the player and above the bar; bar fits, 40px targets', s.mode === 'hidden' && s.shown === s.active && s.active !== '' && s.capFont >= 14 && s.capVisible && s.capAboveBar && fits && targets, `font ${s.capFont}px "${s.shown.split('\n')[0]}" bar ${JSON.stringify(bar)}`);
  await ctx.close();
}

await browser.close();
console.table(rows);
const bad = rows.filter((r) => !r.ok).length;
console.log(bad ? `✗ ${bad} of ${rows.length} checks failed` : `✓ all ${rows.length} checks passed`);
process.exit(bad ? 1 : 0);
