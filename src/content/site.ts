/** Navigation and footer structure (labels and destinations live in links.ts). */
import type { LinkKey } from './links';

export const NAV_LINKS: LinkKey[] = ['howItWorks', 'security', 'faq', 'forAdvisors'];

export const FOOTER_COLUMNS: { title: string; links: LinkKey[] }[] = [
  { title: 'Product', links: ['howItWorks', 'video', 'pricing', 'security', 'faq'] },
  { title: 'Company', links: ['ourStory', 'forAdvisors', 'email'] },
  { title: 'Legal', links: ['privacy', 'terms'] },
];

export const TAGLINE = 'See what’s happening. Before it matters.';
