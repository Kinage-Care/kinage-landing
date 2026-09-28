#!/usr/bin/env node
/**
 * Kinage tokens → CSS custom properties.
 *
 * design-system/tokens.json is the single source of truth. This script writes
 * src/styles/tokens.css from it. Run with --check to fail (exit 1) when the
 * committed CSS has drifted from the JSON — `npm run check` does this, and
 * `npm run build` runs `check` first, so CSS and JSON cannot disagree in a build.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(root, 'design-system/tokens.json');
const OUT = resolve(root, 'src/styles/tokens.css');
const check = process.argv.includes('--check');

const tokens = JSON.parse(readFileSync(SRC, 'utf8'));

/** Group → CSS variable prefix. Groups not listed here are TS-only. */
const PREFIX = {
  color: 'color',
  semantic: '',
  font: 'font',
  fontWeight: 'weight',
  letterSpacing: 'tracking',
  spacing: 'space',
  layout: 'layout',
  radius: 'radius',
  shadow: 'shadow',
};

const varName = (prefix, key) => `--${prefix ? `${prefix}-` : ''}${key}`;

/** "{color.ink}" → "var(--color-ink)" */
const resolveAlias = (value) =>
  typeof value === 'string'
    ? value.replace(/\{([a-zA-Z]+)\.([a-zA-Z0-9-]+)\}/g, (_, group, key) => {
        if (!(group in PREFIX)) throw new Error(`Alias to non-CSS group: ${group}.${key}`);
        if (!tokens[group]?.[key]) throw new Error(`Unresolved alias {${group}.${key}}`);
        return `var(${varName(PREFIX[group], key)})`;
      })
    : value;

const lines = [];
const section = (title) => lines.push('', `  /* ${title} */`);

/**
 * DTCG composite shadow `{ offsetX, offsetY, blur, spread, color }` → the
 * shorthand plus one variable per part (--shadow-card-y …), so a component
 * can rebuild the *same* shadow with adjusted geometry (e.g. compensating a
 * scale transform) without copying its values.
 */
const SHADOW_PARTS = { offsetX: 'x', offsetY: 'y', blur: 'blur', spread: 'spread', color: 'color' };
const isCompositeShadow = (v) => v && typeof v === 'object' && 'offsetY' in v;

for (const [group, prefix] of Object.entries(PREFIX)) {
  section(group);
  for (const [key, token] of Object.entries(tokens[group])) {
    const name = varName(prefix, key);
    if (isCompositeShadow(token.$value)) {
      const v = token.$value;
      const parts = Object.keys(SHADOW_PARTS).map((p) => resolveAlias(v[p] ?? '0'));
      lines.push(`  ${name}: ${parts.join(' ')};`);
      for (const [p, suffix] of Object.entries(SHADOW_PARTS)) lines.push(`  ${name}-${suffix}: ${resolveAlias(v[p] ?? '0')};`);
      continue;
    }
    lines.push(`  ${name}: ${resolveAlias(token.$value)};`);
  }
}

section('typography — size / line-height / weight / tracking');
for (const [key, token] of Object.entries(tokens.typography)) {
  const v = token.$value;
  lines.push(`  --type-${key}-size: ${v.fontSize};`);
  lines.push(`  --type-${key}-line: ${v.lineHeight};`);
  lines.push(`  --type-${key}-weight: ${v.fontWeight};`);
  lines.push(`  --type-${key}-tracking: ${resolveAlias(v.letterSpacing)};`);
}

section('motion — CSS-consumable subset (GSAP reads the same JSON in src/motion/tokens.ts)');
for (const sub of ['duration', 'ease', 'distance', 'stagger']) {
  for (const [key, token] of Object.entries(tokens.motion[sub])) {
    lines.push(`  --motion-${sub}-${key}: ${token.$value};`);
  }
}
for (const key of ['hide', 'show', 'distance']) {
  lines.push(`  --motion-nav-${key}: ${tokens.motion.nav[key].$value};`);
}

const breakpoints = Object.entries(tokens.breakpoint)
  .map(([k, t]) => `${k} ${t.$value}`)
  .join(' · ');

const css = `/*
 * GENERATED FILE — do not edit by hand.
 * Source: design-system/tokens.json  →  npm run tokens
 * Breakpoints (use literally in media queries): ${breakpoints}
 */
:root {${lines.join('\n')}
}
`;

if (check) {
  const current = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
  if (current !== css) {
    console.error('✗ src/styles/tokens.css is out of date with design-system/tokens.json — run `npm run tokens`.');
    process.exit(1);
  }
  console.log('✓ tokens.css matches tokens.json');
} else {
  writeFileSync(OUT, css);
  console.log(`✓ wrote ${OUT.replace(root, '.')} (${lines.filter((l) => l.includes('--')).length} custom properties)`);
}
