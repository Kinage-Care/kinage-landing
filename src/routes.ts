/**
 * The site's pages, relative to its base path. Shared by the router
 * (src/router.ts) and the build (vite.config.ts), which writes a static entry
 * for each page so direct loads and refreshes work on a static host such as
 * GitHub Pages. No browser code here — the Vite config imports it.
 */
export const PATHS = { home: '/', story: '/our-story', advisors: '/advisors' } as const;
