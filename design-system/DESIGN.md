# Kinage design system

The visual language of the Kinage website: calm, readable and warm, for adult children (40 to 60 and older) who help a parent with bills. Use it for every new page so the page looks like the rest of the site.

Every value below is a token in `tokens.json` and a CSS custom property in `tokens.css`. Shared classes (container, sections, buttons, cards, page backgrounds, banner, links) are in `base.css`. Use the tokens and these classes; do not introduce new colours, sizes, radii or shadows.

## 1. Typography

### Fonts

| Font | Use | Weights loaded |
|---|---|---|
| **Plus Jakarta Sans** (`--font-display`) | Headings only: h1 to h3, card titles, banner headlines, the footer tagline, a person's name under a photo | 500 (all headings), 600 |
| **DM Sans** (`--font-text`) | Everything else: body, leads, buttons, nav, labels, form fields, FAQ, captions, footer | 400, 500, 600, 700 |

Both are self-hosted from `@fontsource` (`src/styles/fonts.css`). The page sets DM Sans on `html`; `h1`, `h2` and `h3` switch to Plus Jakarta Sans at weight 500. Headings are never bold: weight 500 everywhere. No weight above 700 is used. Museo Sans (`--font-product`) appears only inside the product screen illustrations; never use it for page content.

### Type scale

Sizes are desktop; the phone column applies under 768px.

| Role | Element | Token | Size / line height | Weight, tracking | Phones |
|---|---|---|---|---|---|
| Hero headline | h1 (home) | `display` | 56px / 1.04, scaled with the hero card, 38px minimum | 500, -0.02em | 38px |
| Page title | h1 (inner pages) | `heading-xl` | 56px / 1.0 | 500, -0.02em | 32 to 36px |
| Large section heading | h2 `.section-title--lg` | `heading-xl` | clamp(40px, 4vw, 56px) / 1.0 | 500, -0.02em | 34px / 1.04 |
| Section heading | h2 `.section-title` | `heading` | 40px / 1.04 | 500, -0.01em | 32px / 1.06 (`heading-sm`) |
| Banner headline | h2 in the purple banner | `heading-lg` | clamp(36px, 4vw, 48px) / 1.04 | 500, -0.02em | 32px / 1.06 |
| Card title | h3 | `title` | 24px / 1.15 | 500, -0.01em | 24px |
| Small card title | h3 | `title-sm` | 20px / 1.25 | 500 (heading face) | 20px |
| Document h4 | h4 | `title-sm` | 20px / 1.2 | 600, DM Sans | 20px |
| Hero lead | p (home hero) | `body-relaxed` line height | 18px / 1.6, scaled with the hero card, 16px minimum | 400 | 16px |
| Page intro | p (inner pages) | `body-lg-relaxed` | 19px / 1.55 | 400 | 17px |
| Section lead | p `.section-lead` | `body-relaxed` | 18px / 1.6 | 400 | 17px / 1.6 |
| Body | p | `body` | 17px / 1.6 | 400 | 17px |
| Small | p, card body, captions | `body-sm` | 15px / 1.55 | 400 | 15px |
| Fine print | notes | `body-xs` | 14px / 1.5 | 400, 0.005em | 14px |
| Caption | meta labels | `caption` | 13px / 1.4 | 500, 0.005em | 13px |
| Form label | label | `button-sm` size | 15px / 1.3 | 700 | 15px |
| Button | button, link button | `button` | 16px / 1 | 600 | 16px |
| Small button | `.btn--sm` | `button-sm` | 15px / 1 | 600 | 15px |
| Nav link | nav | `nav` | 15px / 1 | 500 | 17px in the phone menu |
| Pill tag | `.tag` | `tag` | 13px / 1 | 500, 0.005em | 13px |
| Uppercase label | footer column title | `overline` | 12px / 1.3 | 600, 0.08em, uppercase | 12px |
| Footer link | footer | `footer-link` | 15px / 1.5 | 400 | 15px |
| Footer meta | copyright | `footer-meta` | 13px / 1.5 | 400 | 13px |

Headings use `text-wrap: balance`; paragraphs and list items use `text-wrap: pretty`.

## 2. Colour

### Text

| Role | Token | Hex | Use |
|---|---|---|---|
| **Body text (the only body colour)** | `--text-body` (slate) | `#615e6e` | Every paragraph, lead, caption, FAQ answer and form intro. There is no lighter text colour. |
| **Headings** | `--text-heading` (ink) | `#2a1236` | h1, h2, card titles, form labels, FAQ questions |
| Default h3, nav and footer links | `--text-strong` (plum velvet) | `#312749` | The h3 default in `base.css`, nav links, footer links |
| Links and text links | `--text-action` (amethyst) | `#5b2d8f` | Inline links, `.text-link`, `.arrow-link`, the active nav link |
| Purple emphasis in body text | `--text-accent` (eggplant) | `#6a396a` | A short bold label or a figure inside body text. Never part of a heading. |
| Text on purple | `--text-on-brand` | `#ffffff` | Headings and text on the purple banner |
| Secondary text on purple | `--text-on-brand-soft` | white at 80% | Leads on the purple banner |
| Errors | `--color-berry` | `#a32c4a` | Form error text and invalid field borders |

### Brand and actions

| Colour | Token | Hex | Use |
|---|---|---|---|
| **Kinage purple** | `--color-eggplant` / `--surface-brand` | `#6a396a` | The purple textured banner, purple bands, the skip link, the browser theme colour |
| **Mandarin (primary button)** | `--action-primary` | `#da6c2d` | Primary button fill, always with a white label |
| Mandarin hover | `--action-primary-hover` | `#e27a3e` | Primary button on hover |
| Mandarin pressed | `--action-primary-active` | `#cf6528` | Primary button when pressed |
| Mandarin label | `--action-primary-label` | `#ffffff` | Label and icons on mandarin, in every state |
| Deep mandarin | `--action-outline-label`, `--action-focus` | `#a8481a` | Outlined button label; focus ring of mandarin buttons |
| Mandarin washes | `--color-mandarin-tint`, `--color-mandarin-tint-strong` | `#fdf1e8`, `#fbe4d4` | Outlined button hover and pressed backgrounds |
| Lavender | `--color-mist-violet` | `#edecff` | Hero wash start, pill tags, the active nav link, tinted cards, the open FAQ toggle |
| Peach (decoration) | `--color-peach` | `#ffad74` | Banner glow and the How it works progress line. Never text. |

### Surfaces

| Surface | Token | Hex | Use |
|---|---|---|---|
| **White** | `--surface-page`, `--surface-card` | `#ffffff` | The page, white sections, cards, dialogs |
| **Cream** | `--surface-warm` | `#faf6f0` | Cream sections (`.section--warm`), alternating with white |
| Off-white | `--surface-paper`, `--surface-footer` | `#f6f7fa` | The footer, small fills inside cards, the FAQ toggle |
| Lavender tint | `--surface-tag` | `#edecff` | Pill tags, icon tiles, tinted cards |
| Purple | `--surface-brand` | `#6a396a` | The textured banner and purple bands |
| Hairline | `--border-hairline` | `#e6e2e3` | 1px dividers: FAQ rows, footer rules |
| Form field border | `--border-field`, `--border-field-hover` | `#8e8894`, `#6d6874` | Inputs and text areas |
| Dialog backdrop | `--scrim` | `rgba(24, 14, 30, 0.52)` | Behind dialogs, with a 3px blur |

### The purple textured banner

`.brand-panel` in `base.css`: the purple surface (`#6a396a`), radius xl, white text, with two decorative children placed first in the panel:

- `.brand-panel__glow`: a low lavender (`#cf8aff`) and peach (`#ffad74`) glow rising from the foot, blurred 40px, at 40% opacity;
- `.brand-panel__texture`: the Kinage satin texture (`src/assets/texture/texture-269.webp`), `cover`, Luminosity blend at 80%.

Content inside: a banner headline in white (no closing full stop), a lead in white at 80%, then white buttons (`.btn--light`, `.btn--ghost-light`). Padding 72px / 40px (48px / 20px on phones). The same panel carries the pricing card.

## 3. Layout and spacing

| Token | Value | Use |
|---|---|---|
| `--layout-container` | 1200px | Page max width; `.container` is this width minus the gutters |
| `--layout-container-narrow` | 760px | Reading column: section heads, text pages (about 70 characters a line at 18px) |
| `--layout-gutter` / `--layout-gutter-mobile` | 40px / 20px | Side margins (from 768px / under 768px) |
| `--layout-section-space` | 88px | Section padding top and bottom from 1200px |
| `--layout-section-space-tablet` | 72px | From 768 to 1199px |
| `--layout-section-space-mobile` | 56px | Under 768px |
| `--layout-section-join` | 48px (40px on phones) | Top padding of a section that continues the band above |
| `--layout-nav-height`, `--layout-nav-offset` | 64px, 16px | The fixed nav. Page tops clear it with `padding-top: calc(var(--layout-nav-offset) + var(--layout-nav-height) + var(--space-32))` |

`base.css` turns the section padding into one variable, `--section-y`, that switches at the breakpoints; use `padding-block: var(--section-y)` or the `.section` class.

**Spacing scale** (`--space-*`): 4, 8, 12, 14, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96, 104 px. Common pairs: heading to lead 16, lead to actions 32 to 36, card padding 24, card gap 24 to 32, banner padding 72 / 40.

**Breakpoints** (written literally in media queries): phones `max-width: 767px`, tablets `max-width: 1023px`, large tablets `max-width: 1199px`; the layout is designed at 390, 768, 1024 and 1440px. Never size sections with `vh`: rhythm comes from the section padding.

## 4. Radius

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 6px | Inputs, chips, small badges, video controls, the focus outline of text links |
| `--radius-md` | 8px | Buttons, the nav bar, alerts, small tiles, the default focus outline |
| `--radius-lg` | 12px | Content cards: `.surface-card`, problem and comparison cards, How it works step tabs, advisor cards |
| `--radius-xl` | 16px | Large containers: the hero card, banners, the Ben and Our Story cards, the How it works panel, dialogs, the video |
| `--radius-pill` | 1440px | Pill tags, nav links, the FAQ toggle and round marks only. Do not add new pill shapes. |

## 5. Shadows

All shadows are soft, wide and low, tinted with the plum neutral `42, 26, 56`, with no hard outline.

| Token | Value | Use |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(42, 26, 56, 0.04), 0 4px 12px -2px rgba(42, 26, 56, 0.08)` | The primary button, small tiles, member cards |
| `--shadow-md` | `0 2px 4px rgba(42, 26, 56, 0.03), 0 12px 32px -8px rgba(42, 26, 56, 0.12)` | `.surface-card`, the nav bar, comparison cards, How it works steps, the video |
| `--shadow-lg` | `0 4px 8px rgba(42, 26, 56, 0.03), 0 32px 64px -20px rgba(42, 26, 56, 0.18)` | Large containers: the hero card, the Ben and Our Story cards, dialogs |

## 6. Components

### Buttons (`.btn` + a variant)

- **Size.** Height at least 48px, padding 0 24px, radius md, DM Sans 16px / 600, gap 8px to an 18px icon. Small: `.btn--sm`, 40px high, padding 0 16px, 15px. Pressed: scale 0.98. Disabled: 50% opacity. Two buttons side by side share one size.
- **Primary** `.btn--primary`: mandarin fill `#da6c2d`, white label and icons in every state, `--shadow-sm`; hover `#e27a3e`, pressed `#cf6528`; focus ring `#a8481a`. One per group: "Get early access".
- **Secondary** `.btn--outline` (same as `.btn--ghost`): transparent, 1px mandarin border, label `#a8481a`; hover `#fdf1e8`, pressed `#fbe4d4`; focus ring `#a8481a`. The nav's "Get early access" uses it.
- **On purple** `.btn--light`: white fill, purple label, lavender on hover. `.btn--ghost-light`: transparent, white label, 1px white border at 70% (full white on hover). Focus ring white. On purple, never use mandarin.
- **Text links.** `.text-link`: amethyst, 1px underline at 30% that turns solid on hover, optional arrow that moves 3px. `.arrow-link`: amethyst, weight 600, no underline, a vector arrow that moves 3px on hover; turns purple on hover.

### Cards

- **White card** `.surface-card`: white, radius lg, `--shadow-md`, padding 24px.
- **Tinted card**: lavender `#edecff`, radius lg, no shadow (the problem cards; the Kinage column of the comparison).
- **Large white card**: white, radius xl, `--shadow-lg`, padding 48px to 64px (the Ben card 48px; the Our Story card 56px / 64px, 40px on tablets, 40px / 20px on phones): the hero card, the Ben card, the Our Story card.
- Card titles are h3 in Plus Jakarta Sans 500 (24px, or 20px for small cards) in `--text-heading`; card text is body or small in `--text-body`.

### Banners

The purple textured banner (`.brand-panel`, section 2). Headline: Plus Jakarta Sans 500, clamp(36px, 4vw, 48px) / 1.04, white, centred, at most 760px wide, no closing full stop. Lead: 18px / 1.6, white at 80%, at most 600px. Actions: white buttons at least 200px wide, 12px apart, 32px below the lead; on phones the banner aligns left and the buttons stack full width.

### FAQ

- Layout: heading block (with the FAQ pill tag, the only eyebrow label on the site) left at 4 parts, list right at 7 parts, 56px apart; the heading block is sticky. One column under 1024px.
- Items: a 1px hairline above the list and under every item. The question is a full-width `<button>` (at least 72px high, 64px on phones): DM Sans 18px / 1.4, 500, `--text-heading`, with a 32px round toggle (off-white, ink plus sign; lavender with an amethyst minus when open or hovered).
- Answer: 17px / 1.6, `--text-body`, at most 640px wide, plain text without bold. Opens with a 340ms height transition.

### Navigation

- Fixed at 16px from the top, up to 1200px wide; a 64px frosted bar (white at 74%, background blur 10px), radius md, `--shadow-md`. The Kinage logo (124px wide) left; pill links (36px high, DM Sans 15px / 500, plum velvet; off-white on hover; lavender with amethyst text when current) and the outlined "Get early access" right.
- Under 1024px the links collapse into a menu button (44px target).
- While the page scrolls the nav lifts away (96px, 260ms) and returns 900ms after scrolling stops (320ms). It stays visible with reduced motion, while its menu is open and while focus is inside it.

### Footer

Off-white (`--surface-footer`) with a hairline on top. Padding 56px / 32px (40px / 24px on phones). Columns: brand (2 parts: logo 124px and a 20px Plus Jakarta Sans tagline in `--text-heading`) and three link columns (uppercase 12px column titles in `--text-body`, 15px links in plum velvet that turn amethyst and underlined on hover). A copyright line (13px, `--text-body`) under a hairline. Tablets: three columns with the brand above; phones: two columns. Legal entries (Privacy Policy, Terms) are plain labels until their pages exist; then they become footer links.

### Form fields and errors

- Field: label above (15px / 1.3, 700, `--text-heading`; an "optional" note in regular weight, `--text-body`), 8px gap, then the input: at least 48px high, padding 12px 14px, 1px `--border-field` border, radius sm, white, DM Sans 16px / 1.4 in `--text-heading`. Text areas start at 96px and resize vertically.
- Hover: border `#6d6874`. Focus: no outline; amethyst border and a 3px amethyst halo at 22%.
- Error: `aria-invalid="true"` turns the border berry (`#a32c4a`, halo at 20% on focus); the message under the field is 14px / 1.4 berry text. A form-level alert is a radius md box with an 8% berry tint, 15px / 1.5 ink text, links in bold amethyst.
- Two fields can share a row on desktop; one column on phones. The submit button is a full-width primary button.

### Dialogs

A native `<dialog>` in the top layer: the page behind is inert, Esc closes, focus returns to the button that opened it, and the page does not scroll while it is open. Width up to 520px, white, radius xl, `--shadow-lg`, backdrop `--scrim` with a 3px blur. Padding 40px / 40px / 36px (32px / 20px / 24px on phones). Title: Plus Jakarta Sans 500, 28px / 1.1 (24px on phones), `--text-heading`. Close: a 40px lilac circle top right (orchid on hover) with a 44px hit area. Entrance: fade and a 12px rise over 600ms (none with reduced motion).

## 7. Page backgrounds

- **Hero wash with texture** `.hero-wash` (first child `<span class="hero-wash__texture" aria-hidden="true"></span>`): lavender `#edecff` fading to white, with the Kinage satin texture in Color Burn placed from the top of the page and fading out over its last 240px. Used by the home hero, the top of Our Story and the For Advisors header. Always use the class; do not rebuild the gradient.
- **White card on the wash** (Our Story): the wash fills the top of the page and fades into the white page; one large white card (radius xl, `--shadow-lg`, padding 56px / 64px) sits on it in the container, clear of the fixed nav.
- **Sections**: white (`.section`) and cream (`.section--warm`) bands alternate; bands are separated by their surfaces, never by rules. One purple band or banner may close a page.

## 8. Motion

- **Reveals** (`useReveal`): elements marked `data-reveal` fade in and rise 16px (12px on phones), 600ms, ease-out `cubic-bezier(0.22, 1, 0.36, 1)`, 90ms apart, once, when the section's top reaches 85% of the viewport. Only opacity and transform are animated, never visibility or display: content is visible without JavaScript, stays readable by screen readers and reachable by Tab, and a section shows at once when focus lands inside it.
- **Interaction**: hover and focus 200ms ease-out; button press 120ms; FAQ 340ms; dialog 600ms.
- **Smooth scroll**: from 1024px, with a fine pointer and motion allowed, wheel scrolling glides (Lenis): each wheel step settles in 600ms on an ease-out cubic, with no snap and no overshoot. Touch, keyboard, narrow screens and reduced motion keep native scrolling. Anchor links jump natively; `scroll-padding-top` keeps the target clear of the nav.
- **Reduced motion** (`prefers-reduced-motion: reduce`): no reveals (content is simply there), looping illustrations show their end state, transitions and animations are effectively instant, no smooth scrolling, and the nav never hides.

## 9. Accessibility

- **Focus**: `:focus-visible` draws a 2px solid outline 3px outside the element, radius md, in amethyst `#5b2d8f`; mandarin buttons use `#a8481a`; on purple the outline is white. Form fields show the amethyst border and halo instead. Never remove a focus style without a replacement.
- **Touch targets**: buttons are 48px high (40px small); everything used on touch screens is at least 44 × 44px. A small visible control gets an invisible `::after` hit area instead of a larger box (logo, footer links, arrow links, the dialog close button, video controls). On desktop the smallest controls are the 36px nav links.
- **Alt text**: an informative image describes what matters ("Ben Terk, founder of Kinage"), without "image of". Decorative images (illustrations, textures, rings, icons next to a text label) use `alt=""`, and decorative wrappers `aria-hidden="true"`. The logo image has `alt=""` because its link carries `aria-label="Kinage home"`. Product screen illustrations are decorative; the text next to them carries the meaning.
- **Structure**: `lang="en"`, a "Skip to content" link first, one h1 per page, headings in order (h2 then h3), lists as `ul` / `ol`, landmarks (`header`, `nav`, `main`, `footer`). Errors are announced in text, never by colour alone.
- **Contrast** (WCAG 2.1):

| Pair | Ratio |
|---|---|
| Headings `#2a1236` on white / cream / lavender | 17.0 / 15.8 / 14.6 |
| Body `#615e6e` on white / cream / off-white / lavender | 6.3 / 5.9 / 5.9 / 5.4 |
| Plum velvet `#312749` on white | 13.8 |
| Links `#5b2d8f` on white / lavender | 9.5 / 8.1 |
| Deep mandarin `#a8481a` on white / its hover wash / cream | 5.8 / 5.3 / 5.4 |
| White on purple `#6a396a`; white at 80% on purple | 8.7; 6.2 |
| Berry `#a32c4a` on white | 7.0 |
| White label on mandarin `#da6c2d` | 3.4 (button labels only, 16px / 600) |
| Field border `#8e8894` on white (non-text) | 3.4 |

Body text stays at 4.5:1 or more. Mandarin is a button fill only: never mandarin text on white (use deep mandarin). Ash `#9491a1` is never text.

## 10. Content rules

- No em dashes. Use a colon, a comma, parentheses or a new sentence.
- A heading is one colour: no coloured or highlighted words inside headings.
- No eyebrow labels above section headings. The FAQ's pill tag is the only one.
- Banner headlines have no closing full stop.
- Headings and buttons are in sentence case ("Get early access", "How it works").
- Typographic apostrophes and quotes (’ “ ”).
- FAQ answers are plain text, without bold.

## 11. Pattern: a long-form document page (Terms, Privacy Policy)

**Layout.** A page header on the hero wash with the title, then the document on white in one reading column of 760px (`--layout-container-narrow`), then the footer. No cards, no banner, no reveal animation on the text.

**Hierarchy.**

| Element | Style |
|---|---|
| h1 page title | `heading-xl`: 56px / 1.0, 500, -0.02em, `--text-heading` (32px / 1.06 on phones) |
| "Last updated" line | `body-sm`: 15px / 1.55, `--text-body`, 16px under the title |
| h2 section | `heading-sm`: 32px / 1.06, 500, `--text-heading`, 56px above (24px on phones) |
| h3 subsection | `title`: 24px / 1.15, 500, `--text-heading`, 40px above |
| h4 | `title-sm`: DM Sans 20px / 1.2, 600, `--text-heading`, 32px above |
| Paragraph | `body-relaxed`: 18px / 1.6, `--text-body`, 16px between blocks (17px on phones) |
| Lists | discs or numbers, indented 24px, 8px between items, same type as paragraphs |
| Links | amethyst, 1px underline at 30% that turns solid on hover, offset 4px |

**HTML** (the page content, inside the site's `<main id="main">` between the nav and the footer):

```html
<div class="doc">
  <header class="doc__head hero-wash">
    <span class="hero-wash__texture" aria-hidden="true"></span>
    <div class="doc__column">
      <h1 class="doc__title">Privacy Policy</h1>
      <p class="doc__meta">Last updated 1 October 2026</p>
    </div>
  </header>

  <article class="doc__body">
    <div class="doc__column doc__text">
      <p>Opening paragraph.</p>

      <h2>Information we collect</h2>
      <p>Paragraph text with a <a href="mailto:hello@kinage.com">link</a>.</p>
      <ul>
        <li>First item</li>
        <li>Second item</li>
      </ul>

      <h3>Subsection</h3>
      <p>Paragraph text.</p>

      <h4>Detail</h4>
      <p>Paragraph text.</p>
    </div>
  </article>
</div>
```

**CSS** (tokens only):

```css
.doc__column {
  width: min(var(--layout-container-narrow), 100% - 2 * var(--layout-gutter));
  margin-inline: auto;
}
.doc__head {
  padding-top: calc(var(--layout-nav-offset) + var(--layout-nav-height) + var(--section-join));
  padding-bottom: var(--section-y);
}
.doc__title {
  font-size: var(--type-heading-xl-size);
  line-height: var(--type-heading-xl-line);
  letter-spacing: var(--type-heading-xl-tracking);
}
.doc__meta {
  margin-top: var(--space-16);
  font-size: var(--type-body-sm-size);
  line-height: var(--type-body-sm-line);
  color: var(--text-body);
}
.doc__body {
  padding-bottom: var(--section-y);
  background: var(--surface-page);
}
.doc__text > * + * {
  margin-top: var(--space-16);
}
.doc__text > h2 {
  margin-top: var(--space-56);
  font-size: var(--type-heading-sm-size);
  line-height: var(--type-heading-sm-line);
  letter-spacing: var(--type-heading-sm-tracking);
}
.doc__text > h3 {
  margin-top: var(--space-40);
  font-size: var(--type-title-size);
  line-height: var(--type-title-line);
  letter-spacing: var(--type-title-tracking);
  color: var(--text-heading);
}
.doc__text > h4 {
  margin-top: var(--space-32);
  font-family: var(--font-text);
  font-size: var(--type-title-sm-size);
  line-height: var(--type-title-sm-line);
  font-weight: var(--type-title-sm-weight);
  color: var(--text-heading);
}
.doc__text > :first-child {
  margin-top: 0;
}
.doc__text p,
.doc__text li {
  font-size: var(--type-body-relaxed-size);
  line-height: var(--type-body-relaxed-line);
  color: var(--text-body);
}
.doc__text ul,
.doc__text ol {
  padding-left: var(--space-24);
}
.doc__text ul {
  list-style: disc;
}
.doc__text ol {
  list-style: decimal;
}
.doc__text li + li {
  margin-top: var(--space-8);
}
.doc__text a {
  color: var(--text-action);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
  text-decoration-color: color-mix(in srgb, currentColor 30%, transparent);
  transition: text-decoration-color var(--motion-duration-hover) var(--motion-ease-out);
}
.doc__text a:hover {
  text-decoration-color: currentColor;
}

@media (max-width: 767px) {
  .doc__column {
    width: calc(100% - 2 * var(--layout-gutter-mobile));
  }
  .doc__title {
    font-size: var(--type-heading-sm-size);
    line-height: var(--type-heading-sm-line);
  }
  .doc__text > h2 {
    font-size: var(--type-title-size);
    line-height: var(--type-title-line);
  }
  .doc__text p,
  .doc__text li {
    font-size: var(--type-body-size);
    line-height: var(--type-body-line);
  }
}
```

The font family, weight 500 and colour of h1 to h3 come from `base.css`; the h1 and h2 colour is `--text-heading`, so only the h3 sets it explicitly. `base.css` removes list bullets globally; the document column restores them.
