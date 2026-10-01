# Kinage — Asset map

Originals stay untouched in `D:\Kinage Lending\example`. The project holds derived, web-optimised copies.

| File in project | Source | Section | Purpose |
|---|---|---|---|
| `src/assets/3d/hero-bill.webp` | Supplied `Downloads/img/Obraz ChatGPT 1 paź 2026, 12_46_06-1.png` (1254², RGBA) → 960² WebP q0.9, alpha kept, full canvas | Hero → problem card 1 | Shared flight asset (paper set, 2026-10-01; replaces the earlier tile set) |
| `src/assets/3d/hero-doc.webp` | Supplied `Downloads/img/Obraz ChatGPT 1 paź 2026, 12_46_20-3.png` (1254²) → 960² WebP | Hero → problem card 1 (60% opacity) | Shared flight asset (paper set, 2026-10-01; replaces the earlier tile set) |
| `src/assets/3d/hero-gmail.webp` | Supplied `Downloads/img/Obraz ChatGPT 1 paź 2026, 12_46_14-2.png` (1536×1024) → 960×640 WebP | Hero → problem card 1 | Shared flight asset (paper set, 2026-10-01; replaces the earlier tile set) |
| `src/assets/3d/hero-scam.webp` | Supplied `Downloads/img/Obraz ChatGPT 1 paź 2026, 12_46_24-4.png` (1254²) → 960² WebP | Hero → problem card 2 | Shared flight asset (paper set, 2026-10-01; replaces the earlier tile set) |
| `src/assets/3d/hero-chart.webp` | Supplied `Downloads/img/Obraz ChatGPT 1 paź 2026, 12_46_34-6.png` (1536×1024) → 960×640 WebP | Hero → problem card 3 | Shared flight asset (paper set, 2026-10-01; replaces the earlier tile set) |
| `src/assets/3d/hero-sms.webp` | Supplied `Downloads/img/Obraz ChatGPT 1 paź 2026, 12_46_27-5.png` (1254²) → 960² WebP | Hero → problem card 3 | Shared flight asset (paper set, 2026-10-01; replaces the earlier tile set) |
| `src/assets/3d/benefit-dashboard.webp` | `example/3d img/Dashboard.png` | What you get | Benefit 1 icon |
| `src/assets/3d/benefit-fraud.webp` | `example/3d img/Fraud.png` | What you get | Benefit 2 icon |
| `src/assets/3d/benefit-family.webp` | `example/3d img/Family coordination.png` | What you get | Benefit 3 icon |
| `src/assets/3d/household.webp` | `example/3d img/household.png` | Pricing banner | "Kinage / Your household" card |
| `src/assets/images/ben-terk.webp` | `example/Ben img/Group 67.png` | The story behind Kinage; end of Our Story | Ben + plate composite (plate spans x 48–705 of 765) |
| `public/media/kinage-explainer.mp4` | Supplied `Comp 1_5.mp4`, byte-for-byte (1920×1080 H.264, 29.97 fps, AAC 48 kHz stereo, 63.46 s; already fast-start) | Up and running in minutes | Explainer video |
| `public/media/kinage-explainer.en.vtt` | `kinage-product-video/subtitles/kinage-explainer.en.vtt`, unchanged (18 cues, timed to v2; checked against this file: its narration runs 20 ms later at every cue — AAC priming — so the timing holds) | Up and running in minutes | English subtitles, on by default |
| `public/media/kinage-explainer-poster.jpg` | frame at 24.5 s of the video (ffmpeg, 1920×1080) | Up and running in minutes | Poster ("All in one place") |
| `public/fonts/MuseoSans-{300,500,700,900}.woff2` | `example/Museo Sans/*.otf` (fontTools, lossless) | Everywhere | Only face on the page. Declared by the files' own OS/2 weights: 300 → 300 Light, 500 → **400 Regular**, 700 → 600 SemiBold, 900 → 700 Bold |
| `src/assets/figma/hero-ring.svg` | **Generated** by `scripts/derive-hero-arcs.mjs` from `design-system/reference/figma-exports/hero-ring.src.svg` (the supplied Ellipse 10.svg, Figma 627:775, verbatim) | Hero (both rings; desktop: masked by the card) | Seamless dotted ring: full square viewBox, true circle, periodic stamp size (no join), brush × 1.6 |
| `src/assets/figma/problem-scam-shadow.svg` | Figma (562:3805) | Problem card 2 | Blurred contact shadow |
| `src/assets/figma/pricing-texture.png` | Figma 583:962 (1440 × 286 export) | Pricing | Band texture (the 562 export is kept as `reference/figma-exports/pricing-texture-562.png`) |
| `src/assets/figma/pricing-glow.svg` | Figma (562:4391, unchanged in 583:961) | Pricing | Band glow |
| `src/assets/figma/cta-*.{png,svg}` | Figma (562:4409, 569:520/521) | Final CTA | Texture and two ellipses |
| `src/assets/figma/icon-*.svg` | Figma (565:559–577; lucide shapes) | Trust cards | Eye (pupil restored), id-card, key, shield-check, circle-x, users |
| `src/assets/figma/quote-large.svg` | Figma (562:4211) | Testimonials | Quote mark |
| `src/assets/figma/play.svg` | Figma (562:4377) | Video | Play button |
| `src/assets/figma/arrow-right-long.svg` | Figma (562:4397) | Pricing CTA | Arrow |
| `design-system/brand/kinage-logo.svg` | Supplied corrected logo ("Group 72.svg"), verbatim | Nav, footer (via `Brand`) | **The one brand source** — lockup: mark + wordmark |
| `src/assets/brand/kinage-logo-inverse.svg` | Generated from the canonical logo (fills → white) | Footer | Inverse lockup |
| `src/assets/figma/phone-*.svg` | Figma 601:2577 subtree ("Kinage homepage V2") | Family Financial Oversight phone | Header arc, glow and brand quarters; menu, help, alert, flag, chevron and send icons |
| `public/favicon.svg`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png` | Generated from the canonical logo's mark (`npm run brand`) | Browser tab, iOS home screen | Favicon |

Figma exports that the build does not use (founder layers — the local Ben composite is used instead —, the retired Figma wordmarks (`wordmark-nav.svg`, `wordmark-footer*.svg`), the 562 hero texture, glows and circle overlay (`562-hero-*`, replaced by the cream 596:1908 hero), the 1536px household export, small quote marks, carousel arrow bitmaps, empty traced-deco group) are kept in `design-system/reference/figma-exports/` for comparison.

Not used from `example/`: `interface from FAMILY FINANCIAL OVERSIGHT/*.svg|png` (outlined text, ungrouped — the mockup is rebuilt in DOM from Figma instead; kept as visual reference), `Landing png and svg/*` (visual comparison only).
