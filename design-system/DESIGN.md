# Kinage — Design Library

> Warm cream and white surfaces, eggplant brand bands, soft 3D objects. Calm, trustworthy, family-first.

**Theme:** light. A cream hero card, cream and white section bands, eggplant brand bands (pricing, final CTA) and a near-black footer.
**Source of truth:** Figma file `FuFWAgjVb8Vgxs8o0UlNRc` — hero (`596:1913`) and Family Financial Oversight (`596:1985`, phone `601:2577`) from node `596:1908`, every other section from `583:518` ("Kinage – Landing Wireframe", 1440 × 8559; replaces `562:3749`). The two frames differ only in the hero. Exact visual values come from Figma; behaviour and spacing from the refinement briefs.
**Values:** `design-system/tokens.json` → generated `src/styles/tokens.css` (`npm run tokens`; `npm run check` fails on drift).
**Structure reference:** `design-system/reference/toggl-track/` — kept locally for comparison only (not in the repository); none of its colours, fonts or radii are active.

Kinage runs on a quiet surface system — white page, warm cream bands — with lavender cards for anything that explains the product. The brand colour is eggplant (`#6a396a`): the hero heading on cream, the pricing band and the closing CTA. Headings are Museo Sans 900 with one plum-coloured half (`#774478`) that carries the emphasis; the violet action colour (`#6c3bb2`) is reserved for buttons and links. Depth comes from very soft, low-alpha shadows (3–5%) and from the 3D illustrations themselves, never from gradients on UI.

---

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Eggplant | `#6a396a` | `--color-eggplant` | Hero heading on cream; pricing band, final CTA, founder plate; FAQ toggle glyph |
| Plum | `#774478` | `--color-plum` | Eyebrows, highlighted heading half, statistic figures |
| Violet | `#6c3bb2` | `--color-violet` | Filled primary buttons, outlined buttons, links |
| Orchid | `#ebd4ec` | `--color-orchid` | Highlighted word in the final CTA; open FAQ toggle |
| Ink | `#353535` | `--color-ink` | Headings, titles, nav links |
| Soft ink | `rgba(27,14,25,.78)` | `--color-ink-soft` | Body copy (plum-tinted, never neutral grey) |
| Graphite | `#2e2d2d` | `--color-graphite` | Hero reassurance line; at 82% the hero paragraph (596:2552) |
| White | `#ffffff` | `--color-white` | Page, problems, testimonials and statistics bands, cards, light buttons on eggplant |
| **Cream** | `#fbf6ef` | `--color-cream` | Warm canvas from the new hero (596:1916): hero card, What Kinage Is, advisors panel, trust, FAQ, Our Story closing band |
| Linen | `#f8f7f1` | `--color-linen` | Retired from the landing (the phone demo scopes its own app canvas, also `#f8f7f1`) |
| Lavender | `#f1ecf9` | `--color-lavender` | Problem and benefit cards, the phone's panel |
| Lilac | `#f3ecfa` | `--color-lilac` | FAQ toggle, dialog close button, trust icon chips, "Was flagged" badge |
| Heather | `#e8dff4` | `--color-heather` | Video poster multiply tint (29%) |
| Thistle | `#e8ddeb` | `--color-thistle` | Roadmap connector line |
| Line | `#e0e0e0` | `--color-line` | Hairlines (FAQ dividers, Our Story chapter rules) |
| Night | `#110910` | `--color-night` | Footer (text white 80%, titles and lockup white, copyright white 30%) |
| Copper / Rosewood / Berry / Grape | `#bd8c75` `#974d4d` `#8f3a44` `#673872` | `--color-*` | Roadmap steps 1–4; rosewood, sand, berry, grape also form the brand mark; berry marks form errors |
| Sand | `#cea998` | `--color-sand` | Brand-mark quarter |
| Shadow plum | `#5b5168` | `--color-shadow-plum` | Blurred contact shadow under 3D assets in problem cards |

Retired but kept for reference: blush (the old hero highlight on eggplant), mist and stone (the old FAQ toggle). The cool paper canvas was removed: its three sections are now white (testimonials, statistics) or cream (FAQ).

Semantic aliases (`--text-heading`, `--text-body`, `--text-accent`, `--text-action`, `--text-hero-*`, `--text-on-brand-*`, `--surface-*` incl. `--surface-hero`, `--surface-warm`, `--surface-toggle*`, `--action-*`, `--border-*` incl. `--border-field*`, `--scrim`, `--focus-ring*`, `--selection`) live in `tokens.json → semantic` and are what components use.

## Tokens — Typography

### Museo Sans · `--font-sans`
The only face on every page. Self-hosted WOFF2 converted from `example/Museo Sans` (originals untouched), weights **300 / 500 / 700 / 900** only, `font-synthesis: none` so no weight is ever faked. Golos Text, DM Sans, Onest and Poppins appear in the Figma file only inside the product mockup or as overridden defaults; they are not loaded.

| Role | Size / line-height | Weight | Tracking | Token | Used for |
|------|-------------------|--------|----------|-------|----------|
| display | 72 / **1.1** | 900 | 0 | `--type-display-*` | Hero heading (Figma 1.15, tightened slightly; still two lines) |
| heading-xl | 52 / 1.1 | 900 | 0 | `--type-heading-xl-*` | Final CTA heading, Our Story title |
| heading-lg | 40 / 1.18 | 900 | 0 | `--type-heading-lg-*` | "You're not the only one" |
| heading | 36 / 1.18 | 900 | 0 | `--type-heading-*` | Section headings, Our Story chapters |
| price | 36 / normal | 700 | 0 | `--type-price-*` | "Plans starting at $10/month" (583:967) |
| title | 20 / normal | 700 | title | `--type-title-*` | Problem and benefit titles |
| title-strong | 20 / 1.25 | 900 | title | `--type-title-strong-*` | Trust card titles |
| title-sm · title-founder | 18 / 1.25 · normal | 900 · 700 | title | | Roadmap step titles · "Why I built this" |
| body-xl | 20 / 1.6 | 500 | text | `--type-body-xl-*` | Benefit body |
| body-lg | 18 / 1.55 | **300** | text | `--type-body-lg-*` | Hero paragraph; its closing line "See what's happening…" is 500 |
| body-lg-relaxed | 18 / 1.65 | 500 | text | | Final CTA copy; trust reframe (700); Our Story intro |
| body-md | 17 / 1.6 | 500 | text | | Advisors copy |
| body / body-relaxed | 16 / 1.6 · 1.65 | 500 | text | | Section leads, paragraphs, founder story |
| body-light | 16 / normal | 300 | text | `--type-body-light-*` | Pricing banner copy |
| body-card | 16 / 1.2 | 500 | text | | Problem card body |
| body-sm · body-xs | 15 · 14 / 1.6 | 500 | text · small | | Trust card body · roadmap step body |
| caption | 12 / 1.6 | 500 | small | | Statistic labels |
| quote · quote-attribution | 16 / **1.2** · 14.1 / 1.5 | 500 · 300 | text · small | `--type-quote-*` | Active testimonial (583:956 — line-height 1.2, unitless) |
| quote-side · quote-side-attribution | 12 / 1.25 · 9 / 1.5 | 300 | text · small | `--type-quote-side-*` | Neighbour testimonial cards (583:952 render) |
| nav | 14 / normal | 700 | control | `--type-nav-*` | Nav links (583:1088) |
| eyebrow | 14 / normal, uppercase | 700 | caps | `--type-eyebrow-*` | Section eyebrows |
| overline | 12 / normal, uppercase | 900 | caps | | Footer column titles |
| footer-link · footer-meta | 14 / 1.5 · 13 / 1.6 | 500 | small | | Footer links and address · newsletter copy and copyright |
| button / button-sm | 16 · 14 / normal | 700 | control | | Buttons, links (Partner with Kinage and Final CTA primary use 900) |

**Letter spacing** (`letterSpacing` in `tokens.json` → `--tracking-*`; every role's `--type-*-tracking` aliases one of them). At `normal`, Museo Sans read as cramped in running text and small UI (pass 8), so ordinary text carries a slight positive tracking — by role, not one value:

| Tracking | Value | Example | Roles |
|----------|-------|---------|-------|
| `--tracking-none` | 0 | — | display, headings, price: large headings stay as designed |
| `--tracking-title` | 0.005em | 0.1px at 20px | card, step and panel titles (h3) |
| `--tracking-text` | 0.01em | 0.16px at 16px | paragraphs, lists, quotes, captions, form fields and placeholders |
| `--tracking-control` | 0.012em | 0.19px at 16px | nav links, buttons, text links, FAQ questions, field labels |
| `--tracking-small` | 0.015em | 0.21px at 14px | text of 14px and less: step body, stat labels, footer links / meta / copyright, testimonial names, founder byline, validation messages, the phone's small labels |
| `--tracking-caps` | 1.5px | 1.5px | uppercase eyebrows and footer overlines (unchanged) |

How it is applied: `base.css` gives text elements a zero-specificity default — `:where(p, li, …, input, textarea)` → text, `:where(a, button, summary)` → control, `:where(h3, h4…)` → title; `h1` and `h2` stay at 0 — declared on the element that carries the text, so the em resolves against its own font size. Every rule that applies a typography role also applies that role's `--type-*-tracking`, and the few raw-size small texts use `--tracking-small`. No universal selector and no `!important`; the logo, icons and baked image text are untouched, kerning stays on, nothing is scaled horizontally. The phone demo's live text uses the same tokens by role (its greeting is a title; the balance keeps Figma's −0.38px).

**Headings never end with a period.** Separating periods inside a heading ("One tool. Three reasons…") and question marks stay; body copy, quoted problem titles and testimonials keep their punctuation.

**Line breaks:** `h1–h3` use `text-wrap: balance`; paragraphs, list items, quotes and captions use `text-wrap: pretty` (no lone last word). Short phrases that must stay together get a no-break space in the copy — "One Dashboard" (benefit title) and "one dashboard." (roadmap step 4); with the tracking pass also "organized automatically." (roadmap step 1), "they're emergencies." and "no accountability." (problem cards), "one dashboard." (family benefit) and "through emails." (Sarah Miller's quote), where `pretty` alone left a lone final word at some widths. No hard-coded desktop line breaks except the Figma ones marked `.br-wide`, which drop out below 1024px.

**Heading pattern:** `<h2 class="section-title">Plain half <span class="accent">plum half</span></h2>` — always one accent run, in plum; on eggplant the accent is orchid (final CTA). The hero heading is one colour: eggplant on cream.

**Responsive type:** the hero heading scales with the hero stage (72px at 1440 × 900, down with a short viewport, floor 40px, 36px on phones); section headings drop to 28px under 768px; body copy never goes below 14px.

## Tokens — Spacing & Shapes

**Base unit:** 4px (Figma variables `Utilities/Spacing/2|3|4` = 8 / 12 / 16). Scale: 4, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 48, 64, 72, 80, 96 (`--space-*`).

| Radius | Value | Token | Use |
|--------|-------|-------|-----|
| xs | 2px | `--radius-xs` | Trust chips |
| sm | 6px | `--radius-sm` | Filled violet buttons |
| md | 8px | `--radius-md` | Light / outlined buttons, hero and dialog buttons, form fields, quote cards |
| lg | 12px | `--radius-lg` | Feature cards, advisors panel, video |
| xl | 16px | `--radius-xl` | Trust cards, nav bar, dialog, icon chips |
| 2xl | 20px | `--radius-2xl` | Roadmap steps, founder plate |
| hero | 28px | `--radius-hero` | Hero card |
| pill | 100px | `--radius-pill` | Step circles, FAQ toggles |

| Shadow | Value | Use |
|--------|-------|-----|
| `--shadow-hero` | `0 1px 2px rgba(74,60,40,.05), 0 6px 16px -4px rgba(74,60,40,.08)` | Hero card: short, neutral-warm, close to the surface (deliberately lighter than Figma's 30px glow) |
| `--shadow-card` | `0 8px 12px 0 rgba(0,0,0,.05)` — composite, parts exposed as `--shadow-card-x/-y/-blur/-spread/-color` | `.surface-card` — the Trust and Safety reference: trust, statistic and testimonial cards; carousel arrows |
| `--shadow-chip` | `0 4px 6px rgba(0,0,0,.03)` | Trust chips |
| `--shadow-nav` | `0 1px 2px rgba(40,28,40,.05), 0 6px 18px -6px rgba(40,28,40,.1)` | Floating nav: short and neutral, no purple haze (deliberately lighter than Figma) |
| `--shadow-dialog` | `0 24px 64px rgba(53,34,53,.18)` | Early-access dialog |
| `--shadow-step-1…4` | tinted `0 8px 9px` | Roadmap circles |
| `--shadow-stack-layer` | `0 -16px 40px rgba(53,34,53,.07)` | *Implementation token* — top edge of a stacking section, clipped to that edge |

**Layout:** reference width 1440, content column 1200 (`--layout-container`), narrow column 720 (FAQ, founder, Our Story). Side gutter 40px down to 768px, 16px on phones. Floating nav 1200 × 72, 37px from the top. `html` reserves the scrollbar gutter so locking scroll never shifts layout.

**Section rhythm** (`base.css`, from the `layout.section-*` tokens): every content section from "What Kinage Is" down pads **`--section-y`** top and bottom. A section that continues the previous section's background starts with **`--section-join`** instead so two same-colour bands never add up to a double gap (Benefits after Founder, How it works after Benefits). Every value is *base + `--section-extra`* — the one additional internal padding of refinement pass 3 (+30 desktop, +22 tablet, +16 phones: 30 scaled to each base), added once in `base.css` and never again in a component:

| | desktop | 768–1199 | < 768 |
|---|---|---|---|
| `--section-y` | 120 + 30 = **150** | 88 + 22 = **110** | 64 + 16 = **80** |
| `--section-join` | 72 + 30 = **102** | 56 + 22 = **78** | 40 + 16 = **56** |
| `--section-feature-y` (testimonials) | 152 + 30 = **182** | 112 + 22 = **134** | 80 + 16 = **96** |
| pricing band internal | 64 + 30 = **94** | 64 + 22 | 48/32 + 16 |

Padding lives on the section, never as margins on its children. Exceptions, each deliberate:
- **Advisors and founder** (the first two stack layers) share `section.stack-section` on desktop: Figma's 82px (583:777) + the extra + `--section-roomy` (28 / 22 / 16, pass 5), content centred, and **equal total heights** — `StackGroup equalize={2}` gives both the taller one's natural height as a minimum (≈ 693px at 1440). Larger text grows both together; nothing is cropped. Below 1200px the founder uses the rhythm + `--section-roomy` and both use their own content height.
- **Sound Familiar** ("You're not the only one") follows the rhythm (`--section-y`) like every other section since pass 5. On desktops (≥ 1200px) the hero has `min-height: calc(100svh − --section-y + 24px)`, so on a fresh load its eyebrow starts 24px **below the first screen** at any taller viewport (1920 × 1080, 1920 × 1200, 2560 × 1440 …); the extra room sits below the hero card, whose composition is unchanged; on 1440 × 900 and shorter screens the hero is already taller and nothing changes.
- The **footer** adds `--section-roomy` above its columns and below the copyright; the final CTA pads its inner so the texture fills the band.

## Surfaces by section

| Section | Background |
|---------|-----------|
| Hero card | cream (`--surface-hero`) on the white page |
| You're not the only one · testimonials · statistics | white `#FFFFFF` |
| What Kinage Is · trust · FAQ | cream (`--surface-warm`) |
| Advisors | white band, cream panel with the What You Get card radius (`--radius-lg`, 12px, all corners) |
| Founder · What you get · How it works | white |
| Pricing · final CTA | eggplant |
| Footer | night |
| Phone demo (inside What Kinage Is) | lavender panel; the app screen keeps its own palette (canvas `#f8f7f1`, eggplant header, plum bezel) — scoped in `PhoneDemo.css`, unaffected by the surface tokens |
| /advisors | white header, cream / white bands, one eggplant band (setup), cream closing band |

## Components

Every component lives in `src/components`, `src/sections` or `src/pages` with a co-located CSS file that reads tokens.

- **Buttons** (`base.css`): `.btn--primary` violet fill, 6px radius (8px on the hero and dialog, 596:2554), 13/28 padding; `.btn--outline` violet 1px stroke, 8px radius; `.btn--light` white on eggplant; `.btn--ghost-light` 1.5px white-50% stroke on eggplant; `.text-link` violet 700 with underline on hover. Press = 0.98 scale. **Inactive** (`:disabled`): 50% opacity, no hover — for any action whose destination is not decided yet.
- **Nav** (`Nav.tsx`, 583:1070): fixed floating bar, 1200 × 72, 37px from the top, 16px radius, white at **80%** + 6.85px backdrop blur, the short neutral `--shadow-nav` (only the shadow was softened — fill, blur and full-opacity text unchanged), links 14 / 700. Visible on load; **hides while the page is actively scrolling (either direction) and returns once scrolling has stopped for `motion.nav.idle` (500ms)** — with desktop smoothing, "stopped" means the glide has ended. Dismiss 220ms `ease.exit`, reveal 380ms `ease.out`, 10px lift. While hidden it is `visibility: hidden` + `pointer-events: none`. It stays visible while its menu is open or keyboard focus is inside it, and never hides under reduced motion. Section links are absolute (`/#section`) so they work from Our Story; "Our Story" goes to `/our-story` and carries `aria-current` there. Collapses to a disclosure menu below 1024px.
- **Hero** (`HeroFlight.tsx`, 596:1913): centred copy on a cream card (1201 × 637, 28 radius, the short `--shadow-hero`), eggplant 72 / 1.1 heading, 18px paragraph in 300 at graphite 82%, reassurance line 500, violet 249 × 44 CTA. Two dotted arcs (596:2557 / 596:2559) sit inside the card, clipped by it, behind everything, and turn very slowly (see Motion); each is `span (Figma box) > span (Figma tilt/mirror) > span[data-hero-arc] (rotation only) > img`. Six 3D assets around it are the flight's start anchors.
  - **Fit:** `--u = min(--ux, --uy)` — `--ux` fits the 1360px composition to the width, `--uy = (100svh − 129px) / 691.8` fits SMS-top-to-chart-bottom under the nav with 16px spare. The card keeps the full width (`1201 × --ux`); type, spacing, arcs and assets use `--u` and are anchored to the nearest card edge (left group by left, right group by right, lower assets by bottom). At 1366 × 768 and 1280 × 720 the heading, copy, CTA and all six icons fit the first screen; at 1440 × 900 and larger it is the Figma composition. Floor 0.6 (below that the hero runs past the fold); phones use the width unit only.
- **Section head** (`.section-head`): eyebrow · 12 · heading · 12 · lead, centred.
- **Brand** (`Brand.tsx`): the canonical lockup **`design-system/brand/kinage-logo.svg`** (the supplied 151 × 34 SVG, verbatim — four quarters with their own negative-space gaps + the wordmark), rendered as an image so no page style can touch its fills or geometry; its box is pulled to the 24.25px mark (margins −2.773 / −6.977) so it centres like before. `tone="inverse"` (footer) uses `src/assets/brand/kinage-logo-inverse.svg`, the same geometry with every fill white. **Favicon**: `public/favicon.svg` is the four mark paths only, viewBox = their bounds; `favicon-16/32.png` and `apple-touch-icon.png` are rendered from it. All are generated by `scripts/build-brand.mjs` (`npm run brand`) and checked by `npm run check` — one source for header, footer and favicon (the old CSS-built mark lost its 0.78px horizontal gap to pixel rounding, and the old favicon was a hand-drawn approximation).
- **Problem card**: lavender, 12px radius, 28/24 padding, 336 × 201 art box whose slots are the hero-flight destinations.
- **Benefit card**: lavender, centred 128px 3D icon, left-aligned 20px copy.
- **Surface card** (`.surface-card`, `base.css`): white, 24px padding, 16px radius, `--shadow-card`, no border. Shared by trust and statistic cards.
- **Trust card**: `.surface-card` + 56px lilac icon chip with a 28px icon; three columns as designed, 225px minimum height.
- **Stat card**: `.surface-card`, plum 36px figure over a 12px source line; content height, no internal scrolling, no counters.
- **Quote card / carousel** (`Testimonials.tsx`, 583:941): **the Trust and Safety surface** on every card — white, no border, `--radius-xl` (16px) on all four corners, `--shadow-card`. Cards are scaled, so the radius and the shadow's offset and blur are divided by the card's own scale (`--s`, a registered `@property` that animates with the slide): active and neighbour cards *render* identical corners and the identical shadow at every moment. Active card 448.76 wide, padding **40 / 28** (Figma 24, pass 5), quote 16 / 1.2 Museo 500, 16px to the name, shown at **× 1.05** (`carousel.active-scale`). Neighbour cards 294.9 wide, padding 30 / 21 (Figma 18, grown in the same proportion), quote 12 / 15 Museo 300 (Figma side layout), 12px from the enlarged card. Each role shares one base height — the tallest quote in that layout, measured from an invisible sizer that holds every quote in both layouts (`--card-min-active / --card-min-side`, a minimum, so longer copy grows) — and the content centres in it. The sizer also sets the stage height (1084.8 wide, 24px vertical padding for the scale and shadow), so the section never changes height. No pause button; arrows are 42px white circles with the card shadow. **Under 1024px** (tablet and phones): one whole card at a time (min(560px, 100%) wide, padding 32 / 24, no scale) — the tablet neighbours used to peek in and were cut at the stage edge, quote marks included.
- **FAQ** (`Faq.tsx`): cream band, 720px list, hairline dividers. Toggle: 32px lilac disc (`--surface-toggle`), no outline of its own, eggplant plus that becomes a minus when open (the vertical stroke collapses); row hover deepens the disc half a step, open = orchid. The whole row is the button and carries the focus ring. One item open at a time; grid-rows height animation.
- **Video** (`VideoPlayer.tsx`): 862 × 519, 12px radius, heather multiply tint, 72px violet play button; native controls after start. "See How It Works" links to this section.
- **Pricing banner** (`Pricing.tsx`, 583:960): eggplant band with 64px internal padding, glow and a 286px luminosity texture (never shorter than the band). Copy column: "Plans starting at $10/month" (36 / 700), 512.6px copy in 16 / 300, and **"Ask about plans"** — an active outlined light button that opens the contact dialog in its plans-inquiry mode. Internal padding 64 + `--section-extra`. The household card sits at x 776.49 of the 1200 inner, 423.5 × 282.3, centred on the band's height (in Figma it spans the 286px band; centring keeps that as the band grows) — with a margin, not a translate, because its entrance tween owns the transform; 768–1199px in container units; below 768px stacked.
- **Phone demo** (`PhoneDemo.tsx`, Figma 596:1995 panel + 601:2577 "Kinage homepage V2"; the header's purple is **one shape with the cream corner cut out of it** (`.pm__header::before`, a `clip-path` path) — there is no purple under the corner, so no antialiased edge can bleed through it at the fractional positions the feed scroll produces (pass 8; the v7 fix, a cream patch over a square purple corner, still showed a thin dark line once the feed scrolled by −37px)) — replaces the desktop dashboard on every layout (that component and its assets are archived in `design-system/reference/desktop-demo/`). Lavender panel 489 × 409 (radius 14.7); the phone — 195.8 × 423.7 screen, 11px plum bezel outside it, 25 / 14 radii, Figma's soft shadow — sits +7.4px right of centre and **projects 62.3px above the panel on purpose**. The app screen (header with balance, two alert sections with card stacks, composer) is rebuilt in the DOM at 2 × Figma and scaled by one transform; outer geometry is Figma px × `--u` (panel width ÷ `--panel-units`: 489, 330 on phones, where the phone takes more of the panel). "What Kinage Is" splits 634 | 77 | 489 (equal columns under 1200px; stacked under 1024 with room reserved for the projection). No Replay control; the demo loops (see Motion).
- **Contact dialog** (`EarlyAccess.tsx`): one native modal `<dialog>` with three modes, opened by `<button aria-haspopup="dialog">` triggers (`EarlyAccessButton mode=…`):
  - *early access* — every "Get Early Access" (nav ×2, hero, final CTA, footer, Our Story): "Get early access", first name · last name · email · optional message, "Request early access";
  - *plans inquiry* — "Ask about plans" (pricing): "Ask about our plans", "Have a question about subscriptions? Send us a message.", the same name and email fields plus a **required** "Your question", "Send question";
  - *partnership inquiry* — "Partner with Kinage" (landing advisors section, /advisors ×2): "Partner with Kinage", "Tell us how you'd like to work together.", the same fields plus an optional message (placeholder "I'd like to learn more about partnering with Kinage."), "Send inquiry".
  Switching entry points resets the mode-specific state (message, errors, result). White panel (16 radius, `--shadow-dialog`) on a blurred eggplant scrim. Labels, inline errors (berry, `aria-invalid` + `aria-describedby`), focus to the first field on open and to the first invalid field on submit, Esc / close button / backdrop close, focus returns to the opener, page scroll locked in place (`lockScroll`). Submission goes through `src/lib/early-access.ts` (`VITE_EARLY_ACCESS_ENDPOINT`) with `kind: 'early-access' | 'plans-inquiry' | 'partnership-inquiry'`; success is shown only when that endpoint answers 2xx, otherwise an honest "couldn't send" message with the contact email.
- **Footer** (`Footer.tsx`, 583:1021): night canvas, inverse lockup, white overline titles, links and address in white 80% (14 / 500), copyright in white 30%; 1px rules drawn as Figma renders them.
- **Stack group** (`StackGroup.tsx`): sticky card stack for Advisors → Founder → What you get. Each covering layer casts `--shadow-stack-layer` from its **top edge only** (`clip-path: inset(-64px 0 0 0)`), so the last layer leaves no shadow on How it works.
- **Our Story page** (`pages/OurStory.tsx`, `/our-story`): 720px reading column on white — eyebrow, "Why I *built this*", Ben's paragraph, the chapters that have approved copy, then Ben's photo (the founder composite) with a two-line caption: **Ben Terk** (20 / 700, ink) over *Founder of Kinage* (15, secondary body). Blocks are separated by whitespace and type only — no rules. A cream closing band carries the early-access button. Content in `content/our-story.ts`.
- **For Advisors page** (`pages/Advisors.tsx`, `/advisors`): the source file's `#/advisors` content, in its order, native to this site — centred header ("For trusted advisors", "Fewer surprises across your book, *and a record of who did what*", lede, Partner with Kinage + "See how it works" to the setup band), the problem (cream), what you get (three `.surface-card`s), setup (eggplant band: copy + four points with lilac icon chips), practice fit (three cards), and a cream close with Partner with Kinage. Headings lose their trailing period; the source's review banner and film placeholder are not shown. "Learn more for advisors" and the For Advisors nav/footer items lead here. Content in `content/advisors.ts`.

## Routing

`src/router.ts` — History API, no dependency. `/` is the landing, `/our-story` the story page, `/advisors` the advisors page (Vite serves `index.html` for them, so direct loads and refreshes work). Same-origin links that change page are intercepted and pushed; links within the page (including `/#section` on the landing) stay native. Every history entry stores its scroll offset: Back/Forward return to the same position, a `/#section` link from another page lands on that section. The landing unmounts when you leave it (every GSAP context reverts) and re-initialises on return, followed by one `ScrollTrigger.refresh()`.

## Motion

**Thesis:** one authored moment — the six 3D objects of the hero travel into the three problem cards as you scroll. Everything else is quiet sequence: things arrive in reading order, then stay still; the two exceptions (the product demo and the testimonials) repeat calmly. Lens weighting (Design Motion Principles): Jakub primary (subtle production polish), Emil for nav/FAQ/carousel/dialog controls (restraint, fast feedback).

| Token | Value | Use |
|-------|-------|-----|
| `motion.duration.hover` | 200ms | Hover / focus state changes |
| `motion.duration.accordion` | 340ms | FAQ height + indicator |
| `motion.duration.reveal` | 600ms | Section reveals, dialog entrance |
| `motion.duration.reveal-slow` | 700ms | Hero copy entrance, video block |
| `motion.duration.carousel` | 650ms | Testimonial slide |
| `motion.ease.out` | `cubic-bezier(.22,1,.36,1)` → GSAP `kinage.out` | Calm deceleration, no overshoot |
| `motion.ease.in-out` | `cubic-bezier(.65,0,.35,1)` → `kinage.inOut` | Position changes |
| `motion.distance.reveal` | 16px (12px mobile) | Reveal travel |
| `motion.stagger.list` / `.steps` | 100ms / 120ms | Siblings / roadmap 1→4 |
| `motion.trigger.reveal-start` | `top 85%` | One-shot reveals |
| `motion.flight.scrub` | 0.3s | Settle time after scroll stops (distance, not time, drives the flight) |
| `motion.flight.end` | `center 58%` | Flight completes when the card row centre reaches 58% of the viewport |
| `motion.flight.spread` / `.shadow-in` | 0.08 / 0.72 | Per-asset offset; contact shadows fade in from 72% |
| `motion.carousel.interval` | **4000ms** | Testimonial autoplay |
| `motion.carousel.side-scale` / `.active-scale` | 0.657 / 1.05 | Neighbour card scale (294.9 / 448.76) / active card emphasis |
| `motion.nav.idle` | 500ms | Quiet time after scrolling stops before the nav returns |
| `motion.nav.hide` / `.show` / `.distance` | 220ms / 380ms / 10px | Nav dismiss (ease.exit) / reveal (ease.out, slower) / lift |
| `motion.smooth.lerp` / `.min-width` | 0.16 / 1024 | Desktop wheel smoothing strength / from this width (fine pointer only) |
| `motion.arcs.period` / `.ramp` | 112 s / 1.2 s | One full turn of the dotted hero arcs / easing to rest and back when the hero leaves view or the tab is hidden |

| Section | Trigger | Sequence | Final | Mobile · reduced motion |
|---------|---------|----------|-------|-------------------------|
| Hero copy | first load | heading → paragraph → reassurance → CTA, 16px rise + fade, 100ms stagger (the CTA moves as a wrapper, `.hero__cta-wrap`) | static | reduced: visible at once |
| Hero arcs | hero in view | each dotted ring (derived from its Figma export by `scripts/derive-hero-arcs.mjs`: viewBox +60 so the large stamps are no longer cut at the export bounds, and the stroke's first 14 stamps fade in, so its thick start swells in next to the vanishing tail instead of starting with a blunt edge) turns around its own centre, linear, 112 s per turn (0° and 360° are the same frame — no pulse or snap); eases to rest off screen / hidden tab and back without a jump | loops | reduced: still |
| Nav | any scroll | hides while scrolling; returns `nav.idle` after it stops | visible | reduced: always visible |
| Hero → problems | scroll, scrubbed from page top to card row | six assets move (vertical first, horizontal later), scale, fade Doc/Bill to their card opacity; shadows fade in | assets in card slots (Figma) | <768: static hero + cards, card assets reveal · reduced: static Figma composition |
| Problems head · section heads · card groups (What Kinage Is, advisors, founder, What you get, trust, testimonials, statistics, FAQ, final CTA, Our Story) | top 85% | 16px rise + fade, heading first, then cards 90–100ms apart | static | reduced: all visible |
| Phone demo | section top at 65% | phone fades up once → header → first alert + card stack → question typed in the composer → sent as a bubble → reply indicator → reply + card stack, the feed scrolling up just enough to clear the composer (~6 s) → **hold 3 s** → fade to the start state → next run | loops | pauses off screen and in a hidden tab · reduced: the static Figma screen |
| Advisors / Founder / Benefits | native sticky | each layer covers the previous one | normal flow after Benefits | <768 and reduced: plain flow |
| How it works | top 85% | heading + video, then steps 1→4 with connector drawing | static | reduced: all visible |
| Testimonials | visible ≥35% | next card every 4 s; paused on hover, focus inside, off screen or hidden tab; a manual change restarts the countdown | — | phones: no scale · reduced: no autoplay |
| Pricing | top 80% | household card settles 16px onto its anchor | Figma position | reduced: static |
| FAQ | click / Enter / Space | grid-rows height + plus → minus | one open | reduced: instant |
| Early-access dialog | open | panel rises 12px + fades, scrim fades | — | reduced: instant |

**Flight layering:** `.flight-zone` (hero + problems) is one stacking context (`container-type`). Inside it: section surfaces (auto) < back flight layer (z 2: bill, doc, Gmail, chart, SMS) < copy (z 3) < **front flight layer (z 4: scam)**. Both layers are siblings of the sections, `aria-hidden` and `pointer-events: none`; the scam passes *over* the problems heading and lead in both directions. The hero card's clipping (`overflow: hidden`, for the arcs) applies to the card only — the assets are outside it.

**Scroll smoothing** (`motion/smoothScroll.ts`): Lenis with `lerp 0.16` on the *native* window scroll — only from 1024px, with a fine pointer and no reduced-motion preference; touch stays native. Driven by the GSAP ticker and feeding `ScrollTrigger.update`, so the flight, sticky stack and nav idle detection read the same frame. GSAP ScrollSmoother is deliberately not used: it transforms the content and would break native `position: sticky`. The dialog stops it while open.

The rings' Figma brush stroke is denser at one end, so as a ring turns, the visible part beside the icons slowly becomes lighter and denser; it is never empty.

**Rules:** GSAP owns scroll-linked motion, reveals, the demo timeline and the arc rotation; CSS owns the nav, hover, FAQ, carousel and dialog. Never both on one property of one element; entrance tweens never touch an element whose transform another system owns — the flight anchors and the problem cards are never revealed, and a revealed button is wrapped (`.btn` has its own press transform + transition; tweening the button itself left it lagging 16px and snapping up when the tween cleared). Animate transform and opacity (exceptions: FAQ height via grid rows, and the testimonial card metrics, which ease inside a fixed-height stage). Content is visible by default — hidden start states are set by JS only when motion is allowed. No pinning, no snapping, no scroll hijack.

## Do's and Don'ts

### Do
- Keep one plum accent run per heading; orchid on eggplant; the hero heading is eggplant on cream.
- Use violet only for actions (buttons, links, send).
- Put tinted cards (lavender) on white, white cards on white or cream with their soft shadow.
- Keep shadows at 3–5% alpha (the hero's warm edge is the softest); let the 3D art provide depth.
- Place overlapping compositions (hero assets, pricing household) inside a local `position: relative` container, with coordinates from that container.
- Size the hero from both the viewport width and height.

### Don't
- Don't add a second typeface or synthesise a weight.
- Don't set tracking with one blanket rule, or tighten ordinary text below its role: put the role's `--type-*-tracking` next to its size.
- Don't use gradients on UI (texture and glows only live on eggplant stages; the hero arcs are texture).
- Don't animate layout properties outside the two recorded exceptions, or loop anything that doesn't stop off-screen, in a hidden tab and under reduced motion.
- Don't end a heading with a period, and don't show draft or editorial labels in the interface (keep them in content data).
- Don't hard-code per-viewport paths for the hero flight — measure anchors; don't hide overflow on a flight-layer ancestor.
- Don't ship `href="#"`: unknown destinations fall back to a section via `src/content/links.ts`, or are inactive buttons.
- Don't recolour the embedded dashboard through global tokens; it keeps its scoped palette.

## Imagery

Soft, glossy-matte 3D objects in lilac/plum with tilts baked into the PNGs (bill, doc, Gmail, SMS, scam, chart; dashboard, fraud, family icons; household card), dotted brush-stroke arcs around the hero icons (slowly turning). No stock photography except Ben's portrait (landing founder section and the end of Our Story). Assets are used as delivered; transparent padding is part of each asset's box. See `asset-map.md`.

## Normalizations and deviations (recorded)

| Figma | Implementation | Why |
|-------|----------------|-----|
| Hero paragraph "aligned—so nothing" (596:2552) | "aligned so nothing" | Brief: keep the paragraph without an em dash |
| Hero heading line-height 1.15 | 1.1 | Brief: tighten slightly, keep two lines |
| Hero shadow `0 0 30.2px rgba(160,155,130,.3)`, nav shadow `0 15px 41.9px rgba(115,65,116,.1)` | short neutral two-layer shadows | Refinement pass 3: both looked too broad and muddy |
| Testimonial cards: speech-bubble radius, rose-tinted shadow | Trust card surface (16px, `--shadow-card`) | Refinement pass 3: consistent with Trust and Safety |
| "See all plans" | "Ask about plans" (contact dialog, plans mode) | Refinement pass 3 |
| Static hero arcs | turning, 112 s per turn | Refinement passes 3 and 4 (+12%) |
| "activity,and" | "activity, and" | Typo fix requested |
| "Common questions." | "Common questions" | Requested |
| "Read our story" stroke `#6929c4` | `--color-violet` `#6c3bb2` | One-step drift from the action colour |
| Benefit card `#f1ecf8` | `--color-lavender` `#f1ecf9` | One-step drift |
| Eye icon export lacks its pupil | pupil restored in the derived SVG | Export bug (Figma render shows it) |
| Desktop dashboard mockup (583:605/606) | phone (596:1995) on every layout | Refinement pass 4 |
| Side testimonial cards: layer values 6.73px, rendered 12 / 15 | rendered values (12 / 15, 9 / 13.5) | The exported layer sizes are pre-scale; the node render is what Figma shows |
| Side-card attribution in Poppins Light | Museo Sans 300 | Single-face system |
| Testimonials: row gap 17.647, padding 72, cards at scale 1 | carousel gap 15, padding 152 + 30, active card × 1.05 | Briefs: more space and a more prominent active card inside the 1200 column |
| Section padding (Figma 72–96) | 120 / 88 / 64 base + 30 / 22 / 16 extra | Refinement briefs |
| Advisors 576, founder shorter | both equal on desktop (≈ 637 with the extra padding) | Briefs: one shared height, then + 30 / 30 |
| Advisors panel square corners | `--radius-lg` (What You Get card radius) | Refinement pass 3 |
| FAQ toggle grey disc with outline, `+` rotating to `×` | lilac disc, no outline, eggplant plus → minus | Brief: subtle branded controls |
| Nav absolute over hero | fixed; hides while scrolling, returns when idle | Refinement brief |
| Trust card fixed height 225 | `min-height` 225 | Longer copy never clips |
| Section padding as drawn (72–96) | 120 / 88 / 64 rhythm, 72 / 56 / 40 joined tops | Refinement brief; joined tops avoid 240px gaps between same-colour bands |
| Headings with trailing periods | periods removed | Refinement brief |
| FAQ "Draft answer" label | not rendered; `status: 'draft'` kept in `faq.ts` | Refinement brief |
| Footer rules: 179.96° gradient on a 1px box | horizontal gradient of the rendered result | Same pixels in every browser |
| Footer copyright white 30% | kept (Figma) | Below WCAG AA (≈2.6 : 1 on night); decorative meta line, flagged rather than changed |
