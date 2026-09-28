/**
 * For Advisors page content.
 *
 * Source: `kinage-site (1).html` → the #/advisors route (`#page-advisors`),
 * in its order. Copy is the source's, verbatim, with the site's rules
 * applied: headings lose their trailing period, and the source's primary
 * action ("Join the advisor network") uses this site's advisor CTA, "Partner
 * with Kinage", which opens the contact dialog in partnership mode. Left out
 * on purpose: the source's review banner ("Mockup for review…") and its film
 * placeholder ("Film E, the advisor film") — there is no advisor film asset.
 */
export type AdvisorCard = { title: string; body: string };

export const ADVISORS_PAGE = {
  hero: {
    eyebrow: 'For trusted advisors',
    title: { plain: 'Fewer surprises across your book,', accent: 'and a record of who did what' },
    lede: 'Kinage gives you shared visibility into a client household’s bills and payments, without holding their credentials or touching their money.',
    secondary: 'See how it works',
  },
  problem: {
    eyebrow: 'The problem',
    title: 'You are accountable for households you cannot see into',
    lede: 'Bills arrive in a client’s inbox you do not have. A family member pays something twice. You find out at the next review, or when something has already gone wrong.',
  },
  benefits: {
    eyebrow: 'What you get',
    title: 'Visibility you did not have to assemble',
    cards: [
      { title: 'Shared visibility', body: 'One picture of what is due, paid and flagged, that you and the family both see at the same time.' },
      { title: 'An audit trail', body: 'Who did what, and when, recorded as it happens rather than reconstructed afterwards.' },
      { title: 'Fewer inbound calls', body: 'The family can answer their own questions without going through you first.' },
    ] satisfies AdvisorCard[],
  },
  setup: {
    eyebrow: 'Setup',
    title: 'Your client connects an email and an account. That is the whole setup',
    lede: 'Read-only, through Google and Plaid. You never hold a credential, and Kinage cannot move money. Your client chooses what you see, and can disconnect at any time.',
    points: [
      { icon: 'lock', text: 'Your client signs in with their own bank, never with Kinage.' },
      { icon: 'eye', text: 'Read-only access. Kinage sees only what your client approves.' },
      { icon: 'ban', text: 'Kinage cannot move money, and it cannot act on a bill.' },
      { icon: 'power', text: 'Either connection can be disconnected at any time, by the client.' },
    ] as const,
  },
  practice: {
    eyebrow: 'Practice fit',
    title: 'Built to sit inside how you already work',
    cards: [
      { title: 'Coordination tools', body: 'Bill pay coordination across the households you look after, in one place.' },
      { title: 'Co-branded materials', body: 'Explain Kinage to a client in your own name, with materials you can hand over.' },
      { title: 'Client reporting', body: 'A record you can show a family, an executor, or anyone else who asks later.' },
    ] satisfies AdvisorCard[],
  },
  close: {
    title: 'Bring Kinage to one household first',
    lede: 'Start with a single client and see what it surfaces in the first month. Nothing about your existing process has to change.',
  },
};
