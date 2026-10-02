/**
 * The base path the site is served from: `/` locally,
 * `/kinage-landing/` on GitHub Pages (Vite's `base`, set by
 * BASE_PATH at build time — see vite.config.ts). Every root-relative URL the
 * app writes itself (page and section links, media) goes through `withBase`;
 * Vite already rewrites the URLs in index.html and CSS.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, ''); // '' or '/kinage-landing'

/** `/our-story` → `/kinage-landing/our-story` (unchanged at the root). */
export const withBase = (path: `/${string}`): `/${string}` => `${BASE}${path}` as `/${string}`;

/** `/kinage-landing/our-story` → `/our-story`; paths outside the base are returned as they are. */
export const stripBase = (pathname: string): string =>
  BASE && (pathname === BASE || pathname.startsWith(`${BASE}/`)) ? pathname.slice(BASE.length) || '/' : pathname;
