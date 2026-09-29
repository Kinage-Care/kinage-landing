#!/usr/bin/env node
/**
 * Hero dotted ring: Figma export → the asset both hero rings use.
 *
 * Source: design-system/reference/figma-exports/hero-ring.src.svg — the
 * supplied "Ellipse 10.svg" (Figma 627:775), verbatim: one scatter-brush
 * stroke of 370 stamps (dot clusters) drawn once round an ellipse, large
 * stamps at the start shrinking steadily to the end, which finishes right
 * beside the start.
 *
 * Three repairs so it can turn forever as one continuous ring, plus one
 * weight adjustment (the stamps, their scatter pattern, rotation, colours and
 * group opacity are kept):
 *  1. Bounds. The export's viewBox (543 × 783) is the node's frame, which cuts
 *     the ring off at its right: most of it lies outside. The new viewBox is a
 *     square round the ring's centre, K × the ring radius wide.
 *  2. Shape. The stroke's path is a slightly oval ellipse (semi-axes 383.2 /
 *     363.8, tilted −60°); every stamp is moved radially onto the mean circle,
 *     keeping its scatter offset, so the ring's footprint is the same at every
 *     angle of its rotation (it never reaches further toward the copy).
 *  3. The join. Stamp size fell linearly from 0.118 to 0.044, so the thick
 *     start met the thin end in one step — a visible break that travelled
 *     round as the ring turned. Size now follows a smooth periodic profile
 *     (a cosine of the stamp's position along the stroke: thickest at the
 *     old start, thinnest opposite, same minimum, maximum and average), so
 *     there is no join at all. Each stamp keeps its centre when resized.
 *  4. Weight. On the page the ring is drawn at about 0.45 × its natural size
 *     (0.7 on phones), which made its dots — and its band — too fine to read
 *     as the soft speckled ring of the hero. Stamps and their scatter away
 *     from the circle are enlarged by THICK, so the band and the specks look
 *     like the brush at its natural size.
 *
 *   node scripts/derive-hero-arcs.mjs          write src/assets/figma/hero-ring.svg
 *   node scripts/derive-hero-arcs.mjs --check  fail if it is out of date (npm run check)
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Asset width ÷ ring radius. HeroFlight.css sizes the ring boxes with the same K. */
export const K = 2.4;
/** Brush weight: stamp size and scatter distance from the circle, × this. */
export const THICK = 1.6;

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
const src = resolve(root, 'design-system/reference/figma-exports/hero-ring.src.svg');
const dst = resolve(root, 'src/assets/figma/hero-ring.svg');
const svg = readFileSync(src, 'utf8');

const r3 = (v) => +v.toFixed(3);
const num = (s) => parseFloat(s);

// Ellipse of the stroke: the four on-curve points of the reference path are
// the ends of its axes (P0/P2 one axis, P1/P3 the other).
const ref = /<path id="[^"]*_ref" d="([^"]+)"/.exec(svg)[1];
const onCurve = [...ref.matchAll(/(?:M|C[-\d.\s]+?\s)(-?[\d.]+)\s(-?[\d.]+)(?=\s*[CZ])/g)].map((m) => [num(m[1]), num(m[2])]);
if (onCurve.length < 4) throw new Error('unexpected reference path');
const [P0, P1, P2, P3] = onCurve;
const cx = (P0[0] + P1[0] + P2[0] + P3[0]) / 4;
const cy = (P0[1] + P1[1] + P2[1] + P3[1]) / 4;
const a = Math.hypot(P0[0] - cx, P0[1] - cy);
const b = Math.hypot(P1[0] - cx, P1[1] - cy);
const phi = Math.atan2(P0[1] - cy, P0[0] - cx);
const R = Math.sqrt(a * b); // mean radius
const ellipseR = (t) => (a * b) / Math.hypot(b * Math.cos(t - phi), a * Math.sin(t - phi));

// Stamp shape bounds (absolute M / C / Z path): its centre is what a stamp keeps.
const shape = /<g id="(stroke0_[\w]+)"[^>]*>\s*<path d="([^"]+)"/.exec(svg);
const pts = [...shape[2].matchAll(/-?\d*\.?\d+(?:e-?\d+)?/g)].map((m) => num(m[0]));
const xs = pts.filter((_, i) => i % 2 === 0);
const ys = pts.filter((_, i) => i % 2 === 1);
const box = { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
const c0 = [(box.x0 + box.x1) / 2, (box.y0 + box.y1) / 2];
const corners = [[box.x0, box.y0], [box.x1, box.y0], [box.x0, box.y1], [box.x1, box.y1]];

const useRe = /<use xlink:href="#([\w]+)" transform="translate\((-?[\d.e-]+) (-?[\d.e-]+)\) scale\((-?[\d.e-]+)\) rotate\((-?[\d.e-]+)\)"\/>/g;
const stamps = [...svg.matchAll(useRe)].map((m) => ({ id: m[1], tx: num(m[2]), ty: num(m[3]), s: num(m[4]), rot: num(m[5]) }));
if (stamps.length < 100) throw new Error('unexpected stamp list');
const sMax = Math.max(...stamps.map((p) => p.s));
const sMin = Math.min(...stamps.map((p) => p.s));
const N = stamps.length;

// transform = translate · scale · rotate:  p ↦ t + s·Rot(p)
const rotate = ([x, y], deg) => {
  const t = (deg * Math.PI) / 180;
  return [x * Math.cos(t) - y * Math.sin(t), x * Math.sin(t) + y * Math.cos(t)];
};
let extent = 0;
const uses = stamps.map((p, i) => {
  const rc = rotate(c0, p.rot);
  const centre = [p.tx + p.s * rc[0], p.ty + p.s * rc[1]];
  // 2 · onto the mean circle (radial, keeps the scatter offset in proportion)
  const theta = Math.atan2(centre[1] - cy, centre[0] - cx);
  const k = R / ellipseR(theta);
  const onCircle = [cx + (centre[0] - cx) * k, cy + (centre[1] - cy) * k];
  // 4 · weight: scatter distance from the circle × THICK
  const d = Math.hypot(onCircle[0] - cx, onCircle[1] - cy);
  const moved = [cx + ((onCircle[0] - cx) / d) * (R + (d - R) * THICK), cy + ((onCircle[1] - cy) / d) * (R + (d - R) * THICK)];
  // 3 · periodic size along the stroke (× THICK), centre kept
  const s = THICK * (sMin + (sMax - sMin) * (0.5 + 0.5 * Math.cos((2 * Math.PI * i) / N)));
  const t = [moved[0] - s * rc[0], moved[1] - s * rc[1]];
  for (const q of corners) {
    const rq = rotate(q, p.rot);
    extent = Math.max(extent, Math.hypot(t[0] + s * rq[0] - cx, t[1] + s * rq[1] - cy));
  }
  return `<use xlink:href="#${p.id}" transform="translate(${r3(t[0])} ${r3(t[1])}) scale(${+s.toFixed(6)}) rotate(${p.rot})"/>`;
});

const half = (K * R) / 2;
if (extent > half) throw new Error(`stamps reach ${extent.toFixed(1)} from the centre; K = ${K} gives only ${half.toFixed(1)}`);
const size = r3(2 * half);

let out = svg
  .replace(/<svg width="[\d.]+" height="[\d.]+" viewBox="[^"]+"/, `<svg width="${size}" height="${size}" viewBox="${r3(cx - half)} ${r3(cy - half)} ${size} ${size}"`)
  .replace(/(<g opacity="[\d.]+">)[\s\S]*?(<\/g>\s*<defs>)/, (_, open, close) => `${open}\n${uses.join('\n')}\n${close}`);
if (!out.includes(uses[0])) throw new Error('stamp list not replaced');

const body = `<!-- GENERATED by scripts/derive-hero-arcs.mjs from design-system/reference/figma-exports/hero-ring.src.svg — do not edit.
     Square round the ring's centre; ring radius = ${r3(R)} = width / ${K}; dots reach ${r3(extent / R - 1)} × the radius beyond it. -->
${out}`;

if (check) {
  if (!existsSync(dst) || readFileSync(dst, 'utf8') !== body) {
    console.error('✗ hero ring asset is out of date — run `node scripts/derive-hero-arcs.mjs`.');
    process.exit(1);
  }
  console.log('✓ hero ring asset matches its Figma source');
} else {
  writeFileSync(dst, body);
  console.log(`✓ wrote ./src/assets/figma/hero-ring.svg (${N} stamps on a circle r ${r3(R)} (was ${r3(a)} × ${r3(b)}), sizes ${sMin}–${sMax} periodic × ${THICK}, ${size} square, reach ${r3(extent)} = r × ${r3(extent / R)})`);
}
