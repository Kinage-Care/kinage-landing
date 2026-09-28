#!/usr/bin/env node
/**
 * Short screen recordings for review (motion on, desktop smoothing active):
 *   hero-flight-1366x768.mp4   laptop viewport: hero → cards and back up
 *   phone-demo.mp4             phone demo: run, 3 s hold, reset, next run
 *   hero-cta-settle.mp4        fresh load at 1366 × 768: hero copy + CTA entrance settling
 *   testimonials-rotation.mp4  4-second autoplay
 *   hero-arcs.mp4              the dotted hero arcs turning (real speed, 20 s)
 *   hero-arcs-4x.mp4           the same clip as a 4× time-lapse (labelled)
 *
 *   npm run dev              (in another terminal)
 *   npm run verify:clips -- [--out=verification/v5/after] [--only=hero-flight-1366x768,hero-arcs]
 */
import { chromium } from 'playwright-core';
import { mkdirSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const arg = (name, def) => (process.argv.find((a) => a.startsWith(`--${name}=`)) ?? `=${def}`).split('=')[1];
const url = arg('url', 'http://localhost:5190/');
const out = arg('out', 'verification/v7/after');
const only = arg('only', '').split(',').filter(Boolean);
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });

async function clip(name, viewport, script) {
  if (only.length && !only.includes(name)) return;
  const tmp = `${out}/video-tmp-${name}`;
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  const ctx = await browser.newContext({ viewport, reducedMotion: 'no-preference', recordVideo: { dir: tmp, size: viewport } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.mouse.move(viewport.width - 20, viewport.height - 20);
  const started = Date.now();
  await script(page);
  const seconds = (Date.now() - started) / 1000;
  await ctx.close();
  const file = readdirSync(tmp).find((f) => f.endsWith('.webm'));
  const webm = `${out}/${name}.webm`;
  renameSync(`${tmp}/${file}`, webm);
  rmSync(tmp, { recursive: true, force: true });
  // Trim the page-load part: keep only the scripted part.
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-sseof', `-${seconds.toFixed(2)}`, '-i', webm, '-vf', 'scale=1280:-2,fps=30', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', '-movflags', '+faststart', `${out}/${name}.mp4`]);
  rmSync(webm, { force: true });
  console.log(`saved ${out}/${name}.mp4 (${seconds.toFixed(1)} s)`);
}

const glide = async (page, to, ms) => {
  const from = await page.evaluate(() => scrollY);
  const steps = Math.round(ms / 16);
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    await page.evaluate((y) => window.scrollTo(0, y), from + (to - from) * e);
    await page.waitForTimeout(16);
  }
};

// 1 · laptop hero and flight, down and back up
await clip('hero-flight-1366x768', { width: 1366, height: 768 }, async (page) => {
  await page.waitForTimeout(1600); // first-load entrance of the hero copy
  const end = await page.evaluate(() => {
    const r = document.querySelector('[data-flight-row]').getBoundingClientRect();
    return Math.round(scrollY + r.top + r.height / 2 - innerHeight * 0.58) + 60;
  });
  await glide(page, end, 4200);
  await page.waitForTimeout(1400);
  await glide(page, 0, 3400);
  await page.waitForTimeout(1300);
});

// 2 · phone demo loop (one full run + hold + reset + start of the next run)
await clip('phone-demo', { width: 1440, height: 900 }, async (page) => {
  await page.evaluate(() => window.scrollTo(0, document.querySelector('.what').getBoundingClientRect().top + scrollY - 80));
  await page.waitForTimeout(13500);
});

// 2b · hero CTA entrance on a fresh load (no jump after it settles)
await clip('hero-cta-settle', { width: 1366, height: 768 }, async (page) => {
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(3200);
});

// 3 · testimonials, 4-second autoplay
await clip('testimonials-rotation', { width: 1440, height: 900 }, async (page) => {
  await page.evaluate(() => window.scrollTo(0, document.querySelector('.testimonials').getBoundingClientRect().top + scrollY - 60));
  await page.waitForTimeout(13000);
});

// 4 · the dotted arcs, real speed (100 s per turn), plus a labelled 4× time-lapse
await clip('hero-arcs', { width: 1440, height: 900 }, async (page) => {
  await page.waitForTimeout(20000);
});
if (!only.length || only.includes('hero-arcs')) {
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `${out}/hero-arcs.mp4`, '-vf', `setpts=0.25*PTS,drawtext=fontfile='C\\:/Windows/Fonts/arial.ttf':text='4x time-lapse':x=24:y=h-44:fontsize=22:fontcolor=0x6a396a`, '-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', '-movflags', '+faststart', `${out}/hero-arcs-4x.mp4`]);
  console.log(`saved ${out}/hero-arcs-4x.mp4`);
}

await browser.close();
