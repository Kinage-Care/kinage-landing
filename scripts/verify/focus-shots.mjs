#!/usr/bin/env node
/**
 * Focused crops for this iteration's before/after comparison (motion off so
 * everything is in its final state; nav forced visible over the hero).
 *   node scripts/verify/focus-shots.mjs --out=verification/v5/after
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const arg = (name, def) => (process.argv.find((a) => a.startsWith(`--${name}=`)) ?? `=${def}`).split('=')[1];
const url = arg('url', 'http://localhost:5190/');
const out = arg('out', 'verification/v5/after');
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
const clipOf = (sel, pad = 24) =>
  page.evaluate(
    ([s, p]) => {
      const r = document.querySelector(s).getBoundingClientRect();
      return { x: Math.max(0, r.left - p), y: Math.max(0, r.top + scrollY - p), width: Math.min(innerWidth, r.width + 2 * p), height: r.height + 2 * p };
    },
    [sel, pad],
  );
// Hero card + nav shadows at 1:1 on the white page.
await page.screenshot({ path: `${out}/shadow-hero-nav.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } });
await page.screenshot({ path: `${out}/shadow-nav-zoom.png`, clip: { x: 80, y: 10, width: 640, height: 140 } });
await page.screenshot({ path: `${out}/shadow-hero-edge-zoom.png`, clip: { x: 60, y: 640, width: 520, height: 220 } });
await page.addStyleTag({ content: '.nav{visibility:hidden!important}' });
for (const [name, sel, pad] of [
  ['testimonial-cards', '.carousel', 32],
  ['trust-card', '.trust-card', 32],
  ['pricing', '.pricing', 0],
  ['advisors-panel', '.advisors', 0],
]) {
  await page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), sel);
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${out}/${name}.png`, clip: await clipOf(sel, pad), fullPage: true });
}
const story = await ctx.newPage();
await story.goto(url.replace(/\/$/, '') + '/our-story', { waitUntil: 'networkidle' });
await story.evaluate(() => document.fonts.ready);
await story.addStyleTag({ content: '.nav{visibility:hidden!important}' });
await story.screenshot({ path: `${out}/our-story.png`, fullPage: true });
await browser.close();
console.log(`saved focus shots → ${out}`);
