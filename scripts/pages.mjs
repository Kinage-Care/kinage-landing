#!/usr/bin/env node
/**
 * Build or preview the site exactly as GitHub Pages serves it — under the
 * repository's base path — on any OS (no shell-specific env syntax).
 *
 *   node scripts/pages.mjs build     → dist/ for /kinage-landing/
 *   node scripts/pages.mjs preview   → http://localhost:5191/kinage-landing/
 *
 * BASE_PATH overrides the default (the Pages workflow sets it from the Pages
 * site itself, so a renamed repository or a custom domain needs no change).
 */
import { build, preview } from 'vite';

process.env.BASE_PATH ??= '/kinage-landing/';
const command = process.argv[2];

if (command === 'build') {
  await build();
} else if (command === 'preview') {
  const server = await preview();
  server.printUrls();
} else {
  console.error('usage: node scripts/pages.mjs build|preview');
  process.exit(1);
}
