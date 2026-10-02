/**
 * Every link destination on the page, in one place.
 *
 * - `href` set  → the link goes there.
 * - `href: null` → the destination is not decided yet. The link falls back to
 *   the most relevant section on this page (`fallback`) so the local build
 *   never ships `href="#"` and nothing blocks. Fill `href` in later; nothing
 *   else needs to change. `pendingDestinations()` lists what is still open
 *   (logged once in dev).
 */
import { withBase } from '../lib/base';
import { PATHS } from '../routes';

export type LinkTarget = {
  label: string;
  href: string | null;
  fallback: `/${string}`;
  external?: boolean;
};

/**
 * Section links are absolute (`/#id`, under the base path) so they work from
 * every page: on the landing they are native in-page jumps, elsewhere the
 * router (src/router.ts) returns to the landing and scrolls to the section.
 */
const section = (id: string): `/${string}` => withBase(`/#${id}`);
const page = (path: (typeof PATHS)[keyof typeof PATHS]): `/${string}` => withBase(path);

export const SECTIONS = {
  top: 'top',
  problem: 'why-it-matters',
  howItWorks: 'how-it-works',
  pricing: 'pricing',
  compare: 'why-kinage',
  security: 'security',
  story: 'ben',
  faq: 'faq',
  getStarted: 'get-started',
  contact: 'contact',
} as const;

export const LINKS = {
  // Internal navigation — known.
  howItWorks: { label: 'How it works', href: section(SECTIONS.howItWorks), fallback: section(SECTIONS.howItWorks) },
  security: { label: 'Security', href: section(SECTIONS.security), fallback: section(SECTIONS.security) },
  faq: { label: 'FAQ', href: section(SECTIONS.faq), fallback: section(SECTIONS.faq) },
  // The explainer now lives only in the hero.
  video: { label: 'Explainer video', href: section(SECTIONS.top), fallback: section(SECTIONS.top) },
  pricing: { label: 'Pricing', href: section(SECTIONS.pricing), fallback: section(SECTIONS.pricing) },
  forAdvisors: { label: 'For advisors', href: page(PATHS.advisors), fallback: section(SECTIONS.getStarted) },
  ourStory: { label: 'Our story', href: page(PATHS.story), fallback: section(SECTIONS.story) },
  email: { label: 'hello@kinage.com', href: 'mailto:hello@kinage.com', fallback: section(SECTIONS.contact), external: true },

  // Open the shared contact dialog (components/EarlyAccess.tsx) in their own
  // modes. No endpoint is configured in this prototype: nothing is sent.
  earlyAccess: { label: 'Get early access', href: null, fallback: section(SECTIONS.getStarted), external: true },
  plans: { label: 'Ask about plans', href: null, fallback: section(SECTIONS.getStarted), external: true },
  partner: { label: 'Partner with Kinage', href: null, fallback: section(SECTIONS.getStarted), external: true },

  advisorsInfo: { label: 'Kinage for advisors', href: page(PATHS.advisors), fallback: section(SECTIONS.getStarted) },
  story: { label: 'Read Ben’s story', href: page(PATHS.story), fallback: section(SECTIONS.story) },
  // Texts exist but are not in this project yet: shown as plain labels (Footer), never as links.
  privacy: { label: 'Privacy Policy', href: null, fallback: section(SECTIONS.security), external: true },
  terms: { label: 'Terms', href: null, fallback: section(SECTIONS.security), external: true },
} satisfies Record<string, LinkTarget>;

export type LinkKey = keyof typeof LINKS;

export const resolveHref = (key: LinkKey): string => LINKS[key].href ?? LINKS[key].fallback;

export const isPending = (key: LinkKey): boolean => LINKS[key].href === null;

/** Keys that open the contact dialog rather than navigating (never "pending"). */
const DIALOG_KEYS: LinkKey[] = ['earlyAccess', 'plans', 'partner'];

export const pendingDestinations = (): string[] =>
  (Object.keys(LINKS) as LinkKey[])
    .filter((k) => isPending(k) && !DIALOG_KEYS.includes(k))
    .map((k) => `${k} (${LINKS[k].label}) → ${LINKS[k].fallback}`);
