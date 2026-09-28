#!/usr/bin/env node
/** Clean screen recording of the hero → cards transition (down, pause, back up). */
import { chromium } from 'playwright-core';
import { mkdirSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const url = (process.argv.find((a) => a.startsWith('--url=')) ?? '--url=http://localhost:5190/').slice(6);
const out = (process.argv.find((a) => a.startsWith('--out=')) ?? '--out=verification').slice(6);
const tmp = `${out}/video-tmp`;
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: tmp, size: { width: 1440, height: 900 } } });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.mouse.move(1400, 880);
await page.waitForTimeout(1200);
const end = await page.evaluate(() => {
  const r = document.querySelector('[data-flight-row]').getBoundingClientRect();
  return Math.round(scrollY + r.top + r.height / 2 - innerHeight * 0.58) + 80;
});
const glide = async (to, ms) => {
  const from = await page.evaluate(() => scrollY);
  const steps = Math.round(ms / 16);
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    await page.evaluate((y) => window.scrollTo(0, y), from + (to - from) * e);
    await page.waitForTimeout(16);
  }
};
await glide(end, 4200);
await page.waitForTimeout(1500);
await glide(0, 3200);
await page.waitForTimeout(1200);
await ctx.close();
await browser.close();
const file = readdirSync(tmp).find((f) => f.endsWith('.webm'));
renameSync(`${tmp}/${file}`, `${out}/hero-flight.webm`);
rmSync(tmp, { recursive: true, force: true });
execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', '0.9', '-i', `${out}/hero-flight.webm`, '-vf', 'scale=1280:-2,fps=30', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', '-movflags', '+faststart', `${out}/hero-flight.mp4`]);
console.log(`saved ${out}/hero-flight.mp4`);
