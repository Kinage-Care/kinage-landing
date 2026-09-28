#!/usr/bin/env node
/**
 * Focused crops for refinement pass 5 (logo, favicon, hero arcs, phone header,
 * testimonial cards, Sound Familiar fold, founder/footer spacing).
 *   node scripts/verify/focus-v7.mjs --out=verification/v7/after
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const arg = (name, def) => (process.argv.find((a) => a.startsWith(`--${name}=`)) ?? `=${def}`).split('=')[1];
const url = arg('url', 'http://localhost:5190/');
const out = arg('out', 'verification/v7/after');
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });

const page = async (vp, dpr = 1, reduced = true) => {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: dpr, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  return { ctx, p };
};
const clipOf = (p, sel, pad = 8) =>
  p.evaluate(
    ([s, d]) => {
      const r = document.querySelector(s).getBoundingClientRect();
      return { x: Math.max(0, r.left - d), y: Math.max(0, r.top - d), width: r.width + 2 * d, height: r.height + 2 * d };
    },
    [sel, pad],
  );

// Logo in the nav and the footer at DPR 1 and 2, the favicon at 16 / 32 px.
for (const dpr of [1, 2]) {
  const { ctx, p } = await page({ width: 1440, height: 900 }, dpr);
  await p.screenshot({ path: `${out}/logo-nav-dpr${dpr}.png`, clip: await clipOf(p, '.nav__brand .brand') });
  await p.evaluate(() => document.querySelector('.footer').scrollIntoView());
  await p.addStyleTag({ content: '.nav{visibility:hidden!important}' });
  await p.screenshot({ path: `${out}/logo-footer-dpr${dpr}.png`, clip: await clipOf(p, '.footer .brand') });
  await ctx.close();
}
{
  const { ctx, p } = await page({ width: 200, height: 200 });
  for (const size of [16, 32, 64]) {
    await p.setContent(
      `<body style="margin:0;display:flex;gap:12px;padding:12px;background:#fff"><img src="${url}favicon.svg" width="${size}" height="${size}"><div style="background:#202124;padding:6px;display:flex"><img src="${url}favicon.svg" width="${size}" height="${size}"></div></body>`,
    );
    await p.waitForTimeout(300);
    await p.screenshot({ path: `${out}/favicon-${size}.png`, clip: { x: 0, y: 0, width: size * 2 + 48, height: size + 36 } });
  }
  await ctx.close();
}
// Hero arcs (static) and the first large-desktop viewport.
{
  const { ctx, p } = await page({ width: 1920, height: 1080 });
  await p.screenshot({ path: `${out}/fold-1920x1080.png` });
  await ctx.close();
}
{
  const { ctx, p } = await page({ width: 1440, height: 900 }, 2);
  await p.addStyleTag({ content: '.nav{visibility:hidden!important}' });
  await p.screenshot({ path: `${out}/hero-arcs-1440.png`, clip: { x: 100, y: 130, width: 1240, height: 680 } });
  // Phone header corner.
  await p.evaluate(() => document.querySelector('.phone').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(200);
  const s = await p.$eval('.phone__screen', (e) => { const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width }; });
  await p.screenshot({ path: `${out}/phone-header-corner.png`, clip: { x: s.x + s.w - 90, y: s.y + 60, width: 90, height: 70 } });
  // Testimonial cards.
  await p.evaluate(() => document.querySelector('.carousel').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(200);
  await p.screenshot({ path: `${out}/testimonials-1440.png`, clip: await clipOf(p, '.carousel', 30) });
  // Founder + footer.
  await p.evaluate(() => document.querySelector('.founder').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(200);
  await p.screenshot({ path: `${out}/founder-1440.png`, clip: await clipOf(p, '.founder', 0) });
  await ctx.close();
}
for (const w of [900, 390]) {
  const { ctx, p } = await page({ width: w, height: 900 }, 2);
  await p.addStyleTag({ content: '.nav{visibility:hidden!important}' });
  await p.evaluate(() => document.querySelector('.carousel').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(200);
  await p.screenshot({ path: `${out}/testimonials-${w}.png`, clip: await clipOf(p, '.carousel', 20) });
  await ctx.close();
}
await browser.close();
console.log(`saved focus shots → ${out}`);
