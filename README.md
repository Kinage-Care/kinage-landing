# Kinage landing

Responsive implementation of the Kinage landing page (Figma `FuFWAgjVb8Vgxs8o0UlNRc`: hero from node `596:1908`, all other sections from `583:518`) plus the Our Story (`/our-story`) and For Advisors (`/advisors`) pages, with the Kinage design library and motion.

**Online preview (GitHub Pages):** https://kinage-care.github.io/kinage-landing/

## Start

Node 22 (see `.nvmrc`) and npm.

```bash
git clone https://github.com/Kinage-Care/kinage-landing.git
cd kinage-landing
npm ci
npm run dev
```

Open **http://localhost:5190** (Our Story: **/our-story**, For Advisors: **/advisors**). Locally the site runs at the root; only the Pages build uses a base path.

| Command | What it does |
|---|---|
| `npm run dev` | Regenerates tokens, starts Vite on port 5190 |
| `npm run build` | `check` (token drift + TypeScript), then production build to `dist/` |
| `npm run preview` | Serves `dist/` on http://localhost:5191 |
| `npm run build:pages` | `check`, then the build exactly as GitHub Pages serves it (base `/kinage-landing/`) |
| `npm run preview:pages` | Serves that build on http://localhost:5191/kinage-landing/ |
| `node scripts/verify/pages.mjs [--url=…]` | Static-hosting checks: direct load + refresh of every page, assets and links under the base, navigation, video, contact dialog. Default URL is the local Pages preview; pass the live URL to check the published site |
| `npm run check` | Drift checks (`tokens.css` ↔ `tokens.json`, brand assets ↔ `design-system/brand/kinage-logo.svg`, hero ring ↔ its Figma source) + `tsc --noEmit` |
| `npm run brand` | Regenerate the white lockup, `favicon.svg` and the PNG favicons from the canonical logo |
| `npm run arcs` | Regenerate the seamless hero ring SVG from its Figma export |
| `npm run tokens` | Regenerate `src/styles/tokens.css` from `design-system/tokens.json` |
| `npm run verify:shots` | Full-page screenshots (1920/1440/1024/768/390) + overflow / image / console checks → `verification/` |
| `npm run verify:flight` | Hero → cards transition checks (start, mid, end, reverse, fast jumps, reload mid-way, resize). `-- --width=1024` for other sizes |
| `npm run verify:interactions` | Demo, stack, roadmap, video, carousel, FAQ, focus, reduced motion |
| `node scripts/verify/video.mjs [--url=…]` | Explainer player: subtitle track loads and is on by default, cues at the start / middle / end and none between cues, CC off stays off through pause / seek / resume, keyboard, full screen, phone size |
| `npm run verify:refinements` | Refinement-brief checks at 1920/1440/1024/768/390 and laptop heights (1440×900, 1366×768, 1280×720): hero fit, hero/nav shadows, surfaces, section rhythm incl. the +30 extra, equal advisors/founder heights, advisors radius, stack shadow, testimonial cards vs the Trust card, wrapping, FAQ controls, both dialog modes, Our Story route and caption, arc rotation, nav scroll/idle, scam above the copy |
| `npm run verify:sections -- --out=… --width=…` | Section-by-section crops for before/after comparisons |
| `npm run verify:record` | Screen recording of the opening transition → `verification/hero-flight.mp4` (`-- --out=verification/after` to redirect) |
| `npm run verify:record-nav` | Screen recording of the nav hiding while scrolling and returning when idle → `verification/after/nav-scroll-idle.mp4` |
| `npm run verify:clips` | Recordings: laptop (1366 × 768) hero flight, phone demo loop, hero CTA settling on a fresh load, testimonial rotation, the turning hero arcs (+ a labelled 4× time-lapse) → `verification/v6/after/` (`-- --only=phone-demo` for one) |

Verification scripts drive the locally installed Chrome through `playwright-core` (no browser download); the dev server must be running.

## Deployment (GitHub Pages)

`.github/workflows/pages.yml` builds and publishes the site on **every push to `main`**, and on demand from **Actions → Deploy to GitHub Pages → Run workflow**. Repository **Settings → Pages → Source** must be **GitHub Actions**.

- **Base path.** Vite's `base` comes from `BASE_PATH` (`vite.config.ts`, default `/`). The workflow takes it from the Pages site itself (`actions/configure-pages` → `base_path`): `/kinage-landing/` for `https://<owner>.github.io/kinage-landing/`, `/` with a custom domain. Renaming or moving the repository needs no code change. Page and section links and media go through `withBase` (`src/lib/base.ts`); Vite rewrites the URLs in `index.html` and CSS.
- **Pages on a static host.** The build writes `our-story/index.html`, `advisors/index.html` (one entry per path in `src/routes.ts`) and `404.html`, so direct loads and refreshes work; an unknown path gets the host's 404 status and shows the landing.
- **Node / packages.** Node from `.nvmrc`, `npm ci` from `package-lock.json`; `npm run build` runs `npm run check` first, so a stale generated file fails the deployment instead of shipping.
- **Contact endpoint (optional).** Set a repository variable `EARLY_ACCESS_ENDPOINT` (Settings → Secrets and variables → Actions → Variables) and re-run the workflow; it is passed to the build as `VITE_EARLY_ACCESS_ENDPOINT`. It ends up in public JavaScript, so it must be a public submission URL, never a secret.
- **Check a deployment:** `node scripts/verify/pages.mjs --url=https://kinage-care.github.io/kinage-landing/`, plus `npm run verify:interactions -- --url=…` and `npm run verify:flight -- --url=…` for the motion.

## Moving to the client's GitHub account

1. Transfer the repository (Settings → General → Danger zone → Transfer) or push it to a new repository in the client's account/organisation. History and the workflow come along.
2. In the new repository: Settings → Pages → Source: **GitHub Actions**; Settings → Actions → General: allow actions. Re-add the `EARLY_ACCESS_ENDPOINT` variable if one was set.
3. Push to `main` (or run the workflow). The base path follows the new repository name automatically; with a custom domain (Settings → Pages → Custom domain) it becomes `/`.
4. Update the preview URL at the top of this README and in `scripts/verify/pages.mjs` examples. A private repository needs a paid plan for Pages.

## Structure

```
design-system/
  DESIGN.md          Kinage library: colours, type, spacing, components, motion, rules
  tokens.json        single source of values (DTCG format)
  asset-map.md       file → section → purpose
  reference/         Figma exports (hero arc sources + unused exports), the archived desktop demo
src/
  styles/            tokens.css (generated), fonts.css, base.css (buttons, section head, links)
  content/           links.ts · landing.ts · faq.ts · testimonials.ts · demo-chat.ts
  motion/            gsap.ts (plugins, eases) · tokens.ts · smoothScroll.ts (Lenis, scroll lock) · useHeroFlight · useProductDemo · useReveal
  components/        Brand, SmartLink, EarlyAccess (contact dialog + trigger), PhoneDemo, VideoPlayer, StackGroup
  sections/          one component + CSS per Figma section, in page order (App.tsx)
  pages/             OurStory (/our-story), Advisors (/advisors)
  lib/               early-access.ts — the contact form's submission integration point · base.ts — base-path helpers
  routes.ts          the pages (/, /our-story, /advisors), shared with the build
  router.ts          History-API routing between them, under the base path
public/              fonts (WOFF2), media (video, poster, subtitles), favicon.svg + PNG favicons (generated)
scripts/             build-tokens.mjs, build-brand.mjs, derive-hero-arcs.mjs, pages.mjs, verify/*
.github/workflows/   pages.yml — build + GitHub Pages deployment
```

## Tokens and components

- Change a value in `design-system/tokens.json`, run `npm run tokens` (or just `npm run dev`). CSS uses the variables (`--color-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--type-<role>-size|line|weight|tracking`, `--tracking-*`, `--motion-*`); GSAP reads the same JSON through `src/motion/tokens.ts`.
- Shared primitives are in `src/styles/base.css`: `.btn--primary | --outline | --light | --ghost-light`, `.text-link`, `.section-head`, `.eyebrow`, `.section-title` (+ `.accent`), `.section-lead`, `.container`.
- New pages can reuse `Brand`, `SmartLink`, `StackGroup`, `VideoPlayer`, `useReveal` and the section components.

## Replacing content

| What | Where |
|---|---|
| Link destinations (partner, advisors info, legal) | `src/content/links.ts` — set `href`; `null` falls back to an on-page section. Pending ones are listed in the dev console. |
| Contact form destination (early access, plan questions, partnership) | Set `VITE_EARLY_ACCESS_ENDPOINT` (e.g. in `.env.local`) to a URL that accepts a JSON POST `{ kind: 'early-access' \| 'plans-inquiry' \| 'partnership-inquiry', firstName, lastName, email, message?, source }` and answers 2xx. Until then the dialog validates but reports that it could not send (see `src/lib/early-access.ts`). |
| Our Story copy | `src/content/our-story.ts` — chapters with `copy: null` stay hidden until Ben's text is added |
| For Advisors copy | `src/content/advisors.ts` (from the source file's `#/advisors` route) |
| Phone demo copy and timing | `src/content/demo-chat.ts` (question, alert and reply copy, `timing`) |
| FAQ answers | `src/content/faq.ts` — answers from Ben's brief are `source: 'brief'`; the price ($19.99 per month) and the required email + bank connection are `source: 'review'` (client review 2026-09-30, worded from Ben's Q&A Script). No placeholder answers remain. |
| Testimonials | `src/content/testimonials.ts` — add illustrative items with `kind: 'demo'`; they get a visible "Demo quote" label |
| Section copy and lists | `src/content/landing.ts` and the section components |
| Logo / favicon | Replace `design-system/brand/kinage-logo.svg` (the only source), then `npm run brand` |
| 3D assets | `src/assets/3d/*.webp` — keep file names; hero/card geometry is in `FLIGHT_ASSETS` (`landing.ts`) |
| Ben's photo | `src/assets/images/ben-terk.webp` (composite incl. plate; placement in `Founder.css`) |
| Video | `public/media/kinage-explainer.mp4` + `kinage-explainer-poster.jpg`; subtitles `kinage-explainer.en.vtt` (WebVTT; keep cue times in sync with the file — `node scripts/verify/video.mjs` checks three of them) |
| Hero rings | Replace `design-system/reference/figma-exports/hero-ring.src.svg`, then `npm run arcs` |

## Animation settings

All in `design-system/tokens.json → motion` (documented in `DESIGN.md → Motion`):

- **Hero flight** (`useHeroFlight.ts`): `flight.end` (when it completes), `flight.scrub` (settle time), `flight.spread` (per-asset offset), `flight.shadow-in`, `flight.min-width` (768 — below it the page uses the static composition + reveals). Anchors are measured, so moving a hero slot or a card slot in `landing.ts` moves the path.
- **Reveals** (`useReveal.ts`): `duration.reveal`, `distance.reveal`, `stagger.list`, `trigger.reveal-start`.
- **Nav**: `nav.idle` (ms without scrolling before it returns, 500), `nav.hide` / `nav.show` (dismiss 220ms, reveal 380ms), `nav.distance` (lift).
- **Roadmap**: `stagger.steps`. **Carousel**: `carousel.interval` (autoplay ms, 4000), `carousel.side-scale`, `carousel.active-scale`, `duration.carousel`.
- **Scroll smoothing**: `smooth.lerp` (0.16), `smooth.min-width` (1024). Desktop with a fine pointer only; off for touch and reduced motion.
- **Section spacing**: `layout.section-space*` (120 / 88 / 64), `layout.section-join*` (72 / 56 / 40), `layout.section-space-feature*` (testimonials) plus `layout.section-extra*` (30 / 22 / 16) → `--section-y` / `--section-join` / `--section-feature-y` in `base.css`. Advisors + founder: `layout.stack-section-padding` (82) + extra, heights equalised by `StackGroup equalize`.
- **Hero rings**: `arcs.period` (112 s per turn), `arcs.ramp` (easing to rest / back).
- **FAQ / hover**: `duration.accordion`, `duration.hover`, `ease.out`.
- **Demo**: `src/content/demo-chat.ts → timing` (incl. `hold`, the 3 s pause on the completed state before the loop resets); starts at `trigger.demo-start`.

Reduced motion: no flight, no demo playback, no autoplay, no sticky stacking, no reveals, no arc rotation, no scroll smoothing, and the nav never hides — the static Figma composition with working controls.

## Skills used

Installed at project scope in `D:\Kinage Lending\.claude\skills` (see its README): GSAP official skills, Design Motion Principles, Impeccable (instructions only; launcher binary not run).

## Known limitations

- Mobile and tablet layouts are an interpretation (no mobile frames were available in Figma).
- Link destinations marked pending in `links.ts` need real URLs; forms, analytics and backend are out of scope.
- The footer copyright line is white at 30% as in Figma (≈2.6 : 1 on the night background, below WCAG AA). Raise `--text-on-brand-faint` if it should pass.
- **Early-access requests, plan questions and partnership inquiries are not delivered anywhere yet**, locally or on GitHub Pages: no endpoint exists. The dialog validates and then says it could not send. Configure `VITE_EARLY_ACCESS_ENDPOINT` locally, or the `EARLY_ACCESS_ENDPOINT` repository variable for Pages (requests carry `kind`, so one endpoint serves all three).
- **Fonts:** Museo Sans is a commercial typeface; the WOFF2 files in `public/fonts/` are served by the site and stored in this repository. Confirm the client's web-font licence covers both before a public launch.
- **Our Story**: the supplied `kinage-site (1).html` is a writing template (prompts for Ben), not a narrative. The page publishes only approved copy (Ben's landing paragraph and the product constraints); "What happened", "What we tried" and "Who this is for" wait for Ben's text in `content/our-story.ts`.
