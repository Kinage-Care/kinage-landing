# Kinage design system

Everything needed to build a new Kinage page that matches the website. Code is the source of truth: these files are generated from it or checked against it on every build.

| File | What it is |
|---|---|
| `DESIGN.md` | The rules: fonts and type scale, colours, layout and spacing, radius, shadows, components, page backgrounds, motion, accessibility, content rules, and a ready pattern for a long-form document page (Terms, Privacy Policy). Start here. |
| `tokens.json` | Every design value as DTCG tokens (`$value`, `$type`, `$description`). The single source of truth: the site's CSS and its animation settings are generated from or read from this file. |
| `tokens.css` | The tokens as CSS custom properties on `:root` (`--color-*`, `--text-*`, `--surface-*`, `--action-*`, `--font-*`, `--type-*`, `--space-*`, `--layout-*`, `--radius-*`, `--shadow-*`, `--motion-*`). Generated from `tokens.json`; identical to `src/styles/tokens.css`. |
| `base.css` | The shared classes every page uses: reset and page defaults, `.container`, `.section` and its surfaces, the section heading block, `.tag`, the buttons, `.hero-wash`, `.brand-panel`, `.person-caption`, `.text-link`, `.arrow-link`, `.surface-card`, `.icon-tile`, the reduced-motion rule. A copy of `src/styles/base.css`. |
| `brand/kinage-logo.svg` | The Kinage logo. The site uses it through `src/components/Brand.tsx`. |

## Keeping the files in step

- Change a value in `tokens.json`, then run `npm run tokens`. It writes `src/styles/tokens.css` and `design-system/tokens.css`, and copies `src/styles/base.css` to `design-system/base.css`.
- Change a shared class in `src/styles/base.css` (never in the copy), then run `npm run tokens`.
- `npm run check`, and every `npm run build`, fails when `tokens.css`, `design-system/tokens.css` or `design-system/base.css` differ from what the code produces, so the docs cannot drift from the site.
- When a value or a component changes, update the matching section of `DESIGN.md` in the same change.

## Building a new page in this repository

1. Read `DESIGN.md`, especially section 10 (content rules) and section 11 (the document page pattern).
2. Create the page component and its stylesheet in `src/pages/` (for example `Privacy.tsx` and `Privacy.css`). Use only the custom properties from `tokens.css` and the classes from `base.css`; add page-specific classes with a page prefix (`.doc__…`).
3. Register the page:
   - add its path to `PATHS` in `src/routes.ts`;
   - add it to `Page` and `pageOf` in `src/router.ts`;
   - render it in `src/App.tsx` (inside the existing `<main id="main">`);
   - add its `<title>` and meta description to `PAGE_META` in `src/content/meta.ts`.
   The build then writes a static `index.html` for the path, so a direct load or a refresh works on GitHub Pages.
4. Link to it: set the `href` of its entry in `src/content/links.ts` (for example `privacy` or `terms`) to the new page; the footer then shows it as a link instead of a plain label.
5. Check it: `npm run build:pages`, then `npm run preview:pages` and open the page at 1440px and 390px wide, with and without reduced motion.

## Using the system outside this repository

Load `tokens.css` and then `base.css`, and the two fonts: Plus Jakarta Sans (500 and 600) for headings and DM Sans (400 to 700) for everything else. `base.css` refers to the satin texture as `../assets/texture/texture-269.webp`; copy that image from `src/assets/texture/` and adjust the path if the stylesheet lives elsewhere.
