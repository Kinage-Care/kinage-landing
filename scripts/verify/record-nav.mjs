#!/usr/bin/env node
/**
 * Screen recording of the nav: hidden while the page is scrolling (either
 * direction), back once scrolling stops. A small test-only badge in the
 * corner shows when scroll events are arriving.
 *
 *   npm run dev              (in another terminal)
 *   npm run verify:record-nav   → verification/after/nav-scroll-idle.mp4
 */
import { chromium } from 'playwright-core';
import { mkdirSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const url = (process.argv.find((a) => a.startsWith('--url=')) ?? '--url=http://localhost:5190/').slice(6);
const out = 'verification/after';
const tmp = `${out}/video-tmp`;
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: tmp, size: { width: 1440, height: 900 } } });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => {
  const badge = document.createElement('div');
  badge.style.cssText =
    'position:fixed;left:16px;bottom:16px;z-index:9999;padding:6px 12px;border-radius:999px;font:600 13px/1.2 system-ui;color:#fff;background:#1b0e19cc;pointer-events:none';
  badge.textContent = 'test overlay · idle';
  document.body.append(badge);
  let t = 0;
  addEventListener('scroll', () => {
    badge.textContent = 'test overlay · scrolling';
    badge.style.background = '#6c3bb2dd';
    clearTimeout(t);
    t = setTimeout(() => {
      badge.textContent = 'test overlay · idle';
      badge.style.background = '#1b0e19cc';
    }, 120);
  }, { passive: true });
});
await page.mouse.move(1400, 700);
await page.waitForTimeout(1400);

const burst = async (dy, ms) => {
  const steps = Math.round(ms / 40);
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, dy);
    await page.waitForTimeout(40);
  }
};
await burst(60, 1600); // scroll down: nav leaves
await page.waitForTimeout(1600); // idle: nav returns
await burst(80, 1200);
await page.waitForTimeout(1600);
await burst(-70, 1400); // scroll up: hides too (not direction-based)
await page.waitForTimeout(1800);

await ctx.close();
await browser.close();
const file = readdirSync(tmp).find((f) => f.endsWith('.webm'));
renameSync(`${tmp}/${file}`, `${out}/nav-scroll-idle.webm`);
rmSync(tmp, { recursive: true, force: true });
execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', '0.8', '-i', `${out}/nav-scroll-idle.webm`, '-vf', 'scale=1280:-2,fps=30', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', '-movflags', '+faststart', `${out}/nav-scroll-idle.mp4`]);
console.log(`saved ${out}/nav-scroll-idle.mp4`);
