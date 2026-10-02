/**
 * Pricing — adapted from the current landing's pricing banner
 * (kinage-landing src/sections/Pricing.tsx, Figma 583:960).
 *
 * PRICE IS A LOCAL DESIGN PLACEHOLDER, not an approved offer. Ben rejected
 * the earlier $10 / $15 figures and mentioned $19.99 or $20; no final
 * structure is confirmed, so $19.99/month is used here for layout only.
 * No trial and no annual discount are stated (neither is confirmed). The
 * plan points restate Ben's Q&A (Q9: a monthly subscription that depends on
 * how many people take part, no long-term contract).
 */
export const PRICING = {
  title: 'Simple monthly pricing',
  lead: 'One subscription for your family. Pick a plan based on who wants to take part.',
  priceLabel: 'Plans starting at',
  price: '$19.99',
  period: 'per month',
  points: [
    'Family members and trusted advisors can take part',
    'Your plan depends on how many people you involve',
    'Monthly billing, with no long-term contract',
  ],
  cta: 'Ask about plans',
  /** Internal status (never rendered). */
  status: 'placeholder price, $19.99/month; awaiting a confirmed pricing structure',
};
