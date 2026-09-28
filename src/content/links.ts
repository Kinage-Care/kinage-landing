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
  problems: 'sound-familiar',
  forFamilies: 'for-families',
  advisors: 'for-advisors',
  story: 'our-story',
  benefits: 'what-you-get',
  howItWorks: 'how-it-works',
  trust: 'trust-and-safety',
  testimonials: 'what-families-are-saying',
  pricing: 'pricing',
  stats: 'youre-not-alone',
  faq: 'faq',
  getStarted: 'get-started',
  contact: 'contact',
} as const;

export const LINKS = {
  // Internal navigation — known.
  howItWorks: { label: 'How It Works', href: section(SECTIONS.howItWorks), fallback: section(SECTIONS.howItWorks) },
  forFamilies: { label: 'For Families', href: section(SECTIONS.forFamilies), fallback: section(SECTIONS.forFamilies) },
  pricing: { label: 'Pricing', href: section(SECTIONS.pricing), fallback: section(SECTIONS.pricing) },
  forAdvisors: { label: 'For Advisors', href: page(PATHS.advisors), fallback: section(SECTIONS.advisors) },
  ourStory: { label: 'Our Story', href: page(PATHS.story), fallback: section(SECTIONS.story) },
  contact: { label: 'Contact', href: section(SECTIONS.contact), fallback: section(SECTIONS.contact) },
  email: { label: 'hello@kinage.com', href: 'mailto:hello@kinage.com', fallback: section(SECTIONS.contact), external: true },
  phone: { label: '+1 (212) 555-0147', href: 'tel:+12125550147', fallback: section(SECTIONS.contact), external: true },

  // Open the shared contact dialog (components/EarlyAccess.tsx) in their own
  // modes; the submission endpoint is configured in src/lib/early-access.ts.
  earlyAccess: { label: 'Get Early Access', href: null, fallback: section(SECTIONS.getStarted), external: true },
  partner: { label: 'Partner with Kinage', href: null, fallback: section(SECTIONS.advisors), external: true },

  // Destinations to complete later — configurable, never blocking.
  advisorsInfo: { label: 'Learn more for advisors', href: page(PATHS.advisors), fallback: section(SECTIONS.advisors) },
  story: { label: 'Read our story', href: page(PATHS.story), fallback: section(SECTIONS.story) },
  privacy: { label: 'Privacy Policy', href: null, fallback: section(SECTIONS.trust), external: true },
  terms: { label: 'Terms of Service', href: null, fallback: section(SECTIONS.trust), external: true },
  security: { label: 'Security', href: null, fallback: section(SECTIONS.trust), external: true },
} satisfies Record<string, LinkTarget>;

export type LinkKey = keyof typeof LINKS;

export const resolveHref = (key: LinkKey): string => LINKS[key].href ?? LINKS[key].fallback;

export const isPending = (key: LinkKey): boolean => LINKS[key].href === null;

/** Keys that open the contact dialog rather than navigating (never "pending"). */
const DIALOG_KEYS: LinkKey[] = ['earlyAccess', 'partner'];

export const pendingDestinations = (): string[] =>
  (Object.keys(LINKS) as LinkKey[])
    .filter((k) => isPending(k) && !DIALOG_KEYS.includes(k))
    .map((k) => `${k} (${LINKS[k].label}) → ${LINKS[k].fallback}`);
