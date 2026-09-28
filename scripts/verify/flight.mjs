#!/usr/bin/env node
/**
 * Hero → problem-card flight verification.
 *
 *   npm run dev            (in another terminal)
 *   npm run verify:flight  [-- --url=http://localhost:5190 --record]
 *
 * Checks, at 1440 × 900 with motion allowed:
 *  - start: each moving asset sits on its hero anchor (Figma position)
 *  - end:   each moving asset sits on its card slot (≤ 1.5px), incl. Gmail
 *  - exactly one visible instance per asset at every sampled state
 *  - fast jump to the end and back to the top settle correctly (reversible)
 *  - reload at a mid-transition scroll position renders the matching state
 *  - resize at the end state re-measures to the new slots
 * Saves frames to verification/flight-*.png and, with --record, a webm/mp4.
 */
import { chromium } from 'playwright-core';
import { mkdirSync, readdirSync, renameSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const arg = (name, def) => (process.argv.find((a) => a.startsWith(`--${name}=`)) ?? `=${def}`).split('=')[1];
const url = arg('url', 'http://localhost:5190/');
const record = process.argv.includes('--record');
const W = Number(arg('width', '1440'));
const H = Number(arg('height', '900'));
const out = 'verification';
mkdirSync(out, { recursive: true });

const IDS = ['bill', 'doc', 'gmail', 'scam', 'chart', 'sms'];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  reducedMotion: 'no-preference',
  ...(record ? { recordVideo: { dir: `${out}/video-tmp`, size: { width: 1440, height: 900 } } } : {}),
});
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

const settle = (ms = 700) => page.waitForTimeout(ms);

/** Rects of moving assets, their anchors, and visibility counts. */
const sample = () =>
  page.evaluate((ids) => {
    const r = (el) => {
      const b = el.getBoundingClientRect();
      return { x: +b.left.toFixed(1), y: +b.top.toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1) };
    };
    const shown = (el) => el && getComputedStyle(el).visibility !== 'hidden' && getComputedStyle(el).display !== 'none' && Number(getComputedStyle(el).opacity) > 0.01;
    const zone = document.querySelector('.flight-zone');
    const res = { flying: zone.classList.contains('is-flying'), scrollY: Math.round(scrollY), assets: {} };
    for (const id of ids) {
      const moving = document.querySelector(`[data-flight-asset="${id}"]`);
      const from = document.querySelector(`[data-flight-from="${id}"]`);
      const to = document.querySelector(`[data-flight-to="${id}"]`);
      const visibleCopies =
        (shown(moving) && getComputedStyle(moving.parentElement).display !== 'none' ? 1 : 0) +
        (shown(from.querySelector('img')) ? 1 : 0) +
        (shown(to.querySelector('img')) ? 1 : 0);
      res.assets[id] = { moving: r(moving), from: r(from), to: r(to), visibleCopies, opacity: +getComputedStyle(moving).opacity };
    }
    return res;
  }, IDS);

const endScroll = () =>
  page.evaluate(() => {
    const row = document.querySelector('[data-flight-row]').getBoundingClientRect();
    return Math.round(scrollY + row.top + row.height / 2 - innerHeight * 0.58);
  });

const dist = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.w - b.w), Math.abs(a.h - b.h));
const results = [];
const check = (label, s, target) => {
  const worst = Math.max(...IDS.map((id) => dist(s.assets[id].moving, s.assets[id][target])));
  const copies = IDS.map((id) => s.assets[id].visibleCopies);
  const ok = worst <= 1.5 && copies.every((c) => c === 1);
  results.push({ label, scrollY: s.scrollY, target, worstPx: +worst.toFixed(2), visibleCopies: copies.join(','), ok });
};
const scrollTo = async (y, smooth = false) => {
  if (!smooth) return page.evaluate((v) => window.scrollTo(0, v), y);
  const from = await page.evaluate(() => scrollY);
  const steps = Math.max(1, Math.round(Math.abs(y - from) / 40));
  for (let i = 1; i <= steps; i++) {
    await page.mouse.wheel(0, (y - from) / steps);
    await page.waitForTimeout(16);
  }
};

await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await settle(900);
await page.mouse.move(2, 2);

const END = await endScroll();

// 1 · start
let s = await sample();
check('start (top of page)', s, 'from');
await page.screenshot({ path: `${out}/flight-${W}-0-start.png` });

// 2 · intermediate frames (smooth wheel scrolling, like a user)
for (const [i, p] of [0.25, 0.5, 0.75].entries()) {
  await scrollTo(Math.round(END * p), true);
  await settle(600);
  s = await sample();
  results.push({
    label: `mid ${Math.round(p * 100)}%`,
    scrollY: s.scrollY,
    visibleCopies: IDS.map((id) => s.assets[id].visibleCopies).join(','),
    ok: IDS.every((id) => s.assets[id].visibleCopies === 1),
  });
  await page.screenshot({ path: `${out}/flight-${W}-${i + 1}-${Math.round(p * 100)}.png` });
}

// 3 · end
await scrollTo(END, true);
await settle(800);
s = await sample();
check('end (smooth scroll)', s, 'to');
await page.screenshot({ path: `${out}/flight-${W}-4-end.png` });

// 4 · reverse back to the top smoothly
await scrollTo(0, true);
await settle(800);
check('reversed to top', await sample(), 'from');

// 5 · fast jumps
await scrollTo(END + 600);
await settle(900);
check('fast jump past end', await sample(), 'to');
await scrollTo(0);
await settle(900);
check('fast jump back to top', await sample(), 'from');

// 6 · reload mid-transition
await scrollTo(Math.round(END * 0.5));
await settle(400);
await page.reload({ waitUntil: 'networkidle' });
await settle(1200);
s = await sample();
const midOk = IDS.every((id) => {
  const a = s.assets[id];
  const between = (v, p, q) => v >= Math.min(p, q) - 2 && v <= Math.max(p, q) + 2;
  return a.visibleCopies === 1 && between(a.moving.y, a.from.y, a.to.y);
});
results.push({ label: 'reload at 50%', scrollY: s.scrollY, ok: midOk });

// 7 · resize at the end state
await scrollTo(END + 400);
await settle(600);
await page.setViewportSize({ width: Math.round(W * 0.84), height: H - 100 });
await settle(1200);
const W2 = Math.round(W * 0.84);
if (W2 >= 768) {
  const END2 = await endScroll();
  await scrollTo(END2 + 200);
  await settle(900);
  check(`resize ${W}→${W2} at end`, await sample(), 'to');
} else {
  // Crossing below 768px: the flight is reverted and the static composition returns.
  // Card assets on mobile reveal when their card scrolls into view, so only the hero set is asserted here.
  const before = await page.evaluate(() => scrollY);
  s = await sample();
  const heroVisible = await page.evaluate(() => [...document.querySelectorAll('.hero__slot img')].every((i) => getComputedStyle(i).visibility === 'visible'));
  const layerHidden = await page.evaluate(() => getComputedStyle(document.querySelector('.flight-layer')).display === 'none');
  results.push({ label: `resize ${W}→${W2}: static mobile composition, scroll kept`, scrollY: s.scrollY, ok: !s.flying && heroVisible && layerHidden && s.scrollY > 0, detail: `scroll ${before}` });
}
await page.setViewportSize({ width: W, height: H });
await settle(900);

// 8 · recording: slow scroll down through the transition and back up
if (record) {
  await scrollTo(0);
  await settle(1000);
  await scrollTo(END + 120, true);
  await settle(1400);
  await scrollTo(0, true);
  await settle(1200);
}

await ctx.close();
await browser.close();

if (record) {
  const dir = `${out}/video-tmp`;
  const file = readdirSync(dir).find((f) => f.endsWith('.webm'));
  if (file) {
    renameSync(`${dir}/${file}`, `${out}/hero-flight.webm`);
    try {
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `${out}/hero-flight.webm`, '-vf', 'scale=1080:-2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', `${out}/hero-flight.mp4`]);
    } catch {
      /* ffmpeg optional */
    }
  }
}

console.table(results);
if (errors.length) console.log('page errors:', errors);
process.exitCode = results.every((r) => r.ok) && !errors.length ? 0 : 1;
