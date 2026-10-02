# Kinage website

The Kinage landing page, Our Story and For Advisors. Live at https://kinage-care.github.io/kinage-landing/ (GitHub Pages, deployed by `.github/workflows/pages.yml` on every push to `main`).

React 19, TypeScript and Vite; GSAP with ScrollTrigger for motion; Lenis for wheel smoothing on desktop. Design values come from `design-system/tokens.json`.

## Run

```bash
npm ci
npm run dev        # http://localhost:5200/
```

Other commands:

```bash
npm run check      # tokens, design-system copies and TypeScript
npm run build      # check, then build to dist/
npm run preview    # serve dist/ at http://localhost:5201/
npm run tokens     # regenerate CSS tokens and the design-system copies after editing tokens.json or base.css
```

Build or preview exactly as GitHub Pages serves it, under `/kinage-landing/`:

```bash
npm run build:pages
npm run preview:pages   # http://localhost:5201/kinage-landing/
```

## Pages

| Path | Page |
|---|---|
| `/` | The landing: hero and why it matters, a call-to-action banner, how it works, pricing, why Kinage, security and control, Ben, FAQ, the closing call-to-action banner |
| `/advisors` | For advisors |
| `/our-story` | Ben's story |

The build writes `advisors/index.html`, `our-story/index.html` (each with its own title and description from `src/content/meta.ts`) and `404.html`, so direct loads and refreshes of every page work on GitHub Pages.

## Deployment

`.github/workflows/pages.yml` runs on every push to `main` and from the Actions tab. It installs with `npm ci`, runs `npm run build` (which runs `npm run check` first) with `BASE_PATH` taken from the Pages site, and publishes `dist/`. Repository settings: Pages source "GitHub Actions".

## Forms

Every "Get early access", "Ask about plans" and "Partner with Kinage" control opens the shared contact dialog (`src/components/EarlyAccess.tsx`). Requests go to the endpoint in `VITE_EARLY_ACCESS_ENDPOINT` (`src/lib/early-access.ts`); for the Pages build it comes from the repository variable `EARLY_ACCESS_ENDPOINT`. Without an endpoint nothing is sent, and the dialog says so.

## Structure

```
design-system/       design system docs: DESIGN.md, tokens.json (source of truth), tokens.css, base.css, logo
src/content/         all copy (home.ts, faq.ts, advisors.ts, our-story.ts, links.ts, meta.ts, site.ts)
src/sections/        landing sections
src/pages/           For Advisors and Our Story
src/components/      dialog, video player, icons, product illustrations
src/motion/          GSAP setup, reveals, hero flight and rings, wheel smoothing
src/styles/          tokens.css (generated), base.css (shared classes), fonts.css
public/media/        the explainer video, its poster and captions
scripts/             token generator, GitHub Pages build and preview
```

New pages (for example Terms or Privacy Policy): see `design-system/README.md`.
