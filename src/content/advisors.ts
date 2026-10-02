/**
 * For Advisors page content.
 *
 * Alternative-landing review (plan v2 §5): removed the capabilities the
 * advisor script describes but nobody has confirmed for launch (coordination
 * tools across households, co-branded materials, client reporting) and the
 * outcome promise "Fewer inbound calls"; the practice-fit section went with
 * them. "Your client chooses what you see" became who takes part (no
 * per-category permissions). No prices anywhere.
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
    title: { plain: 'Fewer surprises across your book,', accent: 'and a record of who did what' },
    lede: 'Kinage gives you shared visibility into a client household’s bills and payments, without holding their credentials or touching their money.',
    secondary: 'See how it works',
  },
  problem: {
    title: 'You are accountable for households you cannot see into',
    lede: 'Bills arrive in a client’s inbox you do not have. A family member pays something twice. You find out at the next review, or when something has already gone wrong.',
  },
  benefits: {
    title: 'Visibility you did not have to assemble',
    cards: [
      { title: 'Shared visibility', body: 'One picture of what is due, paid and flagged, that you and the family both see at the same time.' },
      { title: 'An audit trail', body: 'Who did what, and when, recorded as it happens rather than reconstructed afterwards.' },
      { title: 'Read-only by design', body: 'You never hold a credential, and Kinage cannot move money or act on a bill. There is no custody to manage.' },
    ] satisfies AdvisorCard[],
  },
  setup: {
    title: 'Your client connects an email and an account. That is the whole setup',
    lede: 'Read-only, with bank accounts connected through Plaid. You never hold a credential, and Kinage cannot move money. Your client decides who takes part, and can disconnect at any time.',
    points: [
      { icon: 'lock', text: 'Your client signs in with their own bank, never with Kinage.' },
      { icon: 'eye', text: 'Read-only access to the email and accounts your client connects.' },
      { icon: 'ban', text: 'Kinage cannot move money, and it cannot act on a bill.' },
      { icon: 'power', text: 'Either connection can be disconnected at any time, by the client.' },
    ] as const,
  },
  close: {
    title: 'Bring Kinage to one household first.',
    lede: 'Start with a single client family. Kinage gives you clearer visibility into bills, cash flow, and family coordination, with no new work required from you.',
  },
};
