/**
 * Each page's <title> and meta description. The home page's are the ones in
 * index.html (repeated here so in-app navigation can switch back to them; the
 * build fails if the two differ). The app applies the current page's on every
 * page change (App.tsx), and the build writes the other pages' into their
 * static index.html, so a direct load or a link preview shows the right ones.
 */
export type PageMeta = { title: string; description: string };

export const PAGE_META = {
  home: {
    title: 'Kinage — See your parent’s bills and payments in one place',
    description:
      'Kinage brings your parent’s bills and account activity into one shared view, flags what looks unusual, and shows who’s handling it, whether that’s you, your siblings or a trusted advisor.',
  },
  advisors: {
    title: 'Kinage for advisors',
    description:
      'Kinage gives advisors and daily money managers shared, read-only visibility into a client household’s bills and payments, with a record of who did what.',
  },
  story: {
    title: 'Why Ben Terk built Kinage',
    description: 'Ben Terk built Kinage because his family needed to coordinate his mother’s finances and nothing available truly helped.',
  },
} as const satisfies Record<'home' | 'advisors' | 'story', PageMeta>;
