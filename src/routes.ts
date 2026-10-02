/**
 * The site's pages, relative to its base path. Shared by the router
 * (src/router.ts), the links (src/content/links.ts) and the build
 * (vite.config.ts writes a static entry per page for GitHub Pages).
 */
export const PATHS = { home: '/', story: '/our-story', advisors: '/advisors' } as const;
