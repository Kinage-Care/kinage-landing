#!/usr/bin/env node
/**
 * Section crops for before/after comparisons.
 *
 *   npm run verify:sections -- --out=verification/after [--width=1440]
 *
 * Uses the static composition (reduced motion) so every section is fully
 * visible, plus one frame of the navigation over the hero.
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const arg = (name, def) => (process.argv.find((a) => a.startsWith(`--${name}=`)) ?? `=${def}`).split('=')[1];
const url = arg('url', 'http://localhost:5190/');
const out = arg('out', 'verification/sections');
const width = Number(arg('width', '1440'));
mkdirSync(out, { recursive: true });

const SECTIONS = [
  ['nav', '.nav'],
  ['hero', '.hero'],
  ['what', '#for-families'],
  ['advisors', '#for-advisors'],
  ['founder', '#our-story'],
  ['benefits', '#what-you-get'],
  ['how', '#how-it-works'],
  ['trust', '#trust-and-safety'],
  ['testimonials', '#what-families-are-saying'],
  ['pricing', '#pricing'],
  ['stats', '#youre-not-alone'],
  ['faq', '#faq'],
  ['final-cta', '#get-started'],
  ['footer', '.footer'],
];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.evaluate(async () => {
  for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 40));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(400);
await page.screenshot({ path: `${out}/${width}-nav.png`, clip: { x: 0, y: 0, width, height: 140 } });
await page.addStyleTag({ content: '.nav{visibility:hidden!important}' });
const report = [];
for (const [name, sel] of SECTIONS.slice(1)) {
  const el = await page.$(sel);
  if (!el) continue;
  const box = await el.evaluate((e) => {
    const r = e.getBoundingClientRect();
    return { y: Math.round(r.top + scrollY), h: Math.round(r.height) };
  });
  report.push({ name, ...box });
  await el.screenshot({ path: `${out}/${width}-${name}.png` });
}
console.table(report);
await browser.close();
