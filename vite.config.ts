import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { PAGE_META } from './src/content/meta';
import { PATHS } from './src/routes';

/**
 * Base path the site is served from. Local development and previews use `/`;
 * the GitHub Pages workflow sets BASE_PATH from the Pages site
 * (`/kinage-landing/` for github.io), so a renamed repository or
 * a custom domain needs no change here.
 */
const base = (process.env.BASE_PATH ?? '/').replace(/\/*$/, '/');

/**
 * Static hosting: one index.html per page (our-story/index.html,
 * advisors/index.html) so a direct load or refresh of /our-story is served
 * the app, each with its own <title> and meta description (content/meta.ts),
 * plus 404.html for any other path (the app shows the landing).
 */
const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const TITLE = /<title>[^<]*<\/title>/;
const DESCRIPTION = /(<meta\s+name="description"\s+content=")[^"]*("\s*\/?>)/;
function pageEntries(): Plugin {
  let outDir = 'dist';
  return {
    name: 'kinage-page-entries',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const index = resolve(outDir, 'index.html');
      const html = readFileSync(index, 'utf8');
      // The home page's head must be the one in content/meta.ts (in-app navigation uses that copy).
      const home = PAGE_META.home;
      if (!html.includes(`<title>${escapeHtml(home.title)}</title>`) || !html.includes(`content="${escapeHtml(home.description)}"`)) {
        throw new Error('index.html <title> / meta description differ from PAGE_META.home (src/content/meta.ts)');
      }
      for (const [page, path] of Object.entries(PATHS)) {
        if (path === '/') continue;
        const meta = PAGE_META[page as keyof typeof PAGE_META];
        if (!TITLE.test(html) || !DESCRIPTION.test(html)) throw new Error('index.html: <title> or meta description not found');
        const out = html.replace(TITLE, `<title>${escapeHtml(meta.title)}</title>`).replace(DESCRIPTION, `$1${escapeHtml(meta.description)}$2`);
        mkdirSync(resolve(outDir, path.slice(1)), { recursive: true });
        writeFileSync(resolve(outDir, path.slice(1), 'index.html'), out);
      }
      copyFileSync(index, resolve(outDir, '404.html'));
    },
  };
}

// Fixed ports (dev 5200, preview 5201); strictPort fails loudly instead of
// drifting to another port.
export default defineConfig({
  base,
  plugins: [react(), pageEntries()],
  server: { port: 5200, strictPort: true },
  preview: { port: 5201, strictPort: true },
  build: { outDir: 'dist', assetsInlineLimit: 0, sourcemap: false },
});
