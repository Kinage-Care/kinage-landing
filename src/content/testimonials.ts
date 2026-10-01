/**
 * Testimonials — the three quotes in Figma (node 562:4206), in design order.
 * The middle one is active on load, as designed.
 *
 * `kind: 'design'` = copy from the approved design.
 * Any illustrative additions must use `kind: 'demo'` with fictional names; the
 * carousel labels demo items visibly so they can never pass as verified
 * customer quotes. None are needed today — three quotes are enough to rotate.
 */
export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  kind: 'design' | 'demo';
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'david',
    quote: 'It immediately flagged something that didn’t look right. I would’ve never noticed it myself.',
    name: 'David Thompson',
    role: 'Research participant',
    kind: 'design',
  },
  {
    id: 'sarah',
    quote: 'For the first time, I can actually see what’s been paid and what hasn’t, without digging through emails.',
    name: 'Sarah Miller',
    role: 'Early Access User',
    kind: 'design',
  },
  {
    id: 'karen',
    quote: 'I finally feel like we’re on the same page as a family instead of guessing what’s going on.',
    name: 'Karen Brooks',
    role: 'Daughter and Care Coordinator',
    kind: 'design',
  },
];

/** Index shown as active on first render (Figma shows Sarah in the centre). */
export const INITIAL_TESTIMONIAL = 1;
