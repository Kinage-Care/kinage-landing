#!/usr/bin/env node
/**
 * Full-page screenshots of the static composition (prefers-reduced-motion:
 * reduce → no reveals, no flight: exactly the Figma layout) at key widths,
 * plus layout checks: horizontal overflow, missing images, console errors.
 *
 *   npm run dev            (in another terminal)
 *   npm run verify:shots   [-- --widths=1440,1024 --url=http://localhost:5190]
 *
 * Uses the locally installed Chrome through playwright-core (no browser download).
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const arg = (name, def) => (process.argv.find((a) => a.startsWith(`--${name}=`)) ?? `=${def}`).split('=')[1];
const url = arg('url', 'http://localhost:5190/');
const widths = arg('widths', '1920,1440,1024,768,390').split(',').map(Number);
const motion = arg('motion', 'reduce');
const out = arg('out', 'verification');
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = [];
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: motion, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  // Chrome aborts the full media request once it has read the video metadata — expected, not an error.
  page.on('requestfailed', (r) => r.failure()?.errorText !== 'net::ERR_ABORTED' && errors.push(`request failed: ${r.url()}`));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  // Walk the page once so lazy images load, then return to the top.
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
  const checks = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const over = [...document.querySelectorAll('body *')]
      .filter((e) => {
        const r = e.getBoundingClientRect();
        return r.width > 0 && (r.right > vw + 1 || r.left < -1) && getComputedStyle(e).position !== 'fixed';
      })
      .filter((e) => !e.closest('.hero__card, .pricing__decor, .final-cta__decor, .phone__screen, .carousel__stage'))
      .slice(0, 6)
      .map((e) => `${e.tagName.toLowerCase()}.${String(e.className).split(' ')[0]}`);
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: vw,
      height: document.documentElement.scrollHeight,
      brokenImages: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
      fonts: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight}`),
      overflowing: over,
    };
  });
  await page.screenshot({ path: `${out}/static-${w}.png`, fullPage: true });
  report.push({ width: w, ...checks, errors });
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(report, null, 2));
