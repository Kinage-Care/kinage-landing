/**
 * Landing copy, one object per section, in page order.
 *
 * Status: a proposal written from the Kinage Messaging Taxonomy v4 (May
 * 2026), the Ben Terk Q&A script and the team call of 30 Sep 2026. The
 * agreed copy draft was not available. Messaging rules applied: lead with
 * visibility (see / clear / view / in one place), then action; show who is
 * involved; Kinage flags, people decide. No guarantees and no customer
 * quotes. Sentences use ordinary punctuation, no dashes as separators.
 */

export const HERO = {
  title: 'See your parent’s bills and payments in one place',
  lead: 'Kinage brings bills and account activity into one shared view, flags what looks unusual, and shows who’s handling it, whether that’s you, your siblings or a trusted advisor.',
  /** The video block under the actions (Figma 706:2809): a label and a heading beside the phone preview; opens the explainer in a dialog. */
  video: { label: 'Video overview', title: 'A 1-minute look at Kinage' },
};

export const PROBLEM = {
  title: 'Right now, it’s hard to see the whole picture',
  lead: 'You’re probably already managing your parent’s finances in your head, across your email and in three different browsers. One missed bill or one convincing scam can become a problem that’s hard to undo.',
  cards: [
    {
      image: 'bill',
      title: 'Bills slip through',
      body: 'Bills arrive by email, on paper and on autopay. One gets missed, and a late fee or a shut-off notice follows.',
      withKinage: 'Every bill and payment in one list the family can see.',
    },
    {
      image: 'scam',
      title: 'Scams look like real bills',
      body: 'A “refund” email, a vendor nobody recognises, an amount ten times the usual. By the time someone notices, the money may be gone.',
      withKinage: 'Kinage flags new vendors, unusual amounts and possible scams as they show up.',
    },
    {
      image: 'family',
      title: '“I thought it was handled”',
      body: 'When siblings each handle a piece, nobody can see who paid what, and things fall through the gaps.',
      withKinage: 'Everyone sees who’s on point, with a record of what happened.',
    },
  ],
  stat: {
    value: '$4.9 billion',
    text: 'in losses to online fraud and scams reported by Americans over 60 in 2024, up more than 40% on 2023.',
    source: 'FBI IC3 Elder Fraud Report 2024. Reported cases only.',
  },
};

/* ------------------------------------------------------------ How it works */

export type UpcomingIcon = 'house' | 'television' | 'storefront' | 'shield-check';
export type UpcomingBadge =
  | 'overdue'
  | 'flagged'
  | 'unusual'
  | 'due-soon'
  | 'confirmed'
  | 'autopay'
  | 'subscription';
export type UpcomingRow = {
  id: string;
  vendor: string;
  date: string;
  meta?: string;
  icon: UpcomingIcon;
  badges: UpcomingBadge[];
  amount: string;
  /** Figma "State edge" colour of the row. */
  edge?: 'overdue' | 'soon';
};

/**
 * One household, one bill story, used by all four step visuals. Martha is
 * the parent (Person supported), Ben her son (Coordinator, the signed-in
 * user), Sarah her daughter (Supporter). The AT&T Home Internet bill is the
 * one Kinage flags: 18 Apr, $77.26, "Higher than usual and overdue"
 * (Figma 544:337). Roles use the product's own vocabulary
 * (kinage-web-app, household members card).
 */
export const HOW = {
  title: 'One shared view, from the bill to the decision',
  lead: 'Kinage watches for bills and payments, flags what looks off, and keeps you, your siblings and your parent’s advisor working from the same list.',
  steps: [
    {
      short: 'Connect',
      // "and bank" stays together (no-break space); the line breaks before "and" where the column is narrow.
      title: 'Connect your parent’s email and bank',
      ms: 8200,
      body: 'With your parent’s consent. Bank accounts connect read-only through Plaid, so Kinage can see activity but can’t move money.',
      caption:
        'Kinage onboarding on a phone: the Email card is clicked and connects, then the Financial account card is clicked and connects. A banner confirms both: you’re all set, and Kinage is scanning Martha’s email for bills.',
    },
    {
      short: 'See bills',
      title: 'See every bill in one list',
      // One full cycle: rows in (to 1.2 s), the list holds 4 s, rows out (to 6.3 s); moves on in the pause before the replay (6.9 s).
      ms: 6500,
      body: 'Kinage finds bills and statements in the email and matches them to account activity, so what’s due and what’s paid sit side by side.',
      caption:
        'Upcoming payments in Martha’s household, sorted by urgency. AT&T Home Internet, $77.26, due 18 Apr, is overdue. Netflix is due soon. Con Edison, MetLife Dental and Amazon Prime follow.',
    },
    {
      short: 'Flag',
      title: 'Kinage flags what looks off',
      ms: 7000,
      body: 'Duplicates, unusual amounts, new vendors that don’t fit the history and possible scams are flagged in the data Kinage monitors.',
      caption:
        'Kinage writes: I found Martha’s AT&T bill. It’s overdue and higher than usual. The AT&T Home Internet row, $77.26, is highlighted with its Overdue and Was Flagged badges.',
    },
    {
      short: 'Decide',
      title: 'Decide together, with a record',
      ms: 7000,
      body: 'You make the call. Everyone involved sees who’s handling what, and every decision is logged.',
      caption:
        'Martha’s household: Ben, Sarah and Martha are connected to the same household, which has one bill marked Overdue and Was Flagged.',
    },
  ],
  /**
   * Step 1 — the onboarding connection cards (kinage-web-app OnboardingGate,
   * main: ConnectionStatusCard). A simulated sequence: each card is clicked
   * and connects in turn, then one banner confirms both.
   */
  connect: {
    title: 'Connect accounts',
    note: 'Both connections are required before Home opens.',
    status: [
      { id: 'email', label: 'Email', description: 'Finds your bills and reminders' },
      { id: 'bank', label: 'Financial account', description: 'Matches bills to real payments' },
    ],
    done: { title: 'You’re all set', body: 'Kinage is scanning Martha’s email for bills.', items: ['Email connected', 'Financial account connected'] },
  },
  /** Steps 2–3 — Figma 544:406 "Upcoming", rows in urgency order. */
  table: {
    title: 'Upcoming payments',
    filters: ['By Urgency', 'All upcoming', 'All payments', 'All Category'],
    rows: [
      { id: 'att', vendor: 'AT&T Home Internet', date: 'Apr 18', icon: 'house', badges: ['overdue'], amount: '$77.26', edge: 'overdue' },
      { id: 'netflix', vendor: 'Netflix', date: 'Apr 26', icon: 'television', badges: ['due-soon'], amount: '$17.99', edge: 'soon' },
      { id: 'coned', vendor: 'Con Edison', date: 'Apr 28', meta: 'Cleared by Ben on Apr 2', icon: 'house', badges: ['autopay'], amount: '$199.99' },
      { id: 'metlife', vendor: 'MetLife Dental', date: 'Apr 29', meta: 'Cleared by Sarah on Apr 3', icon: 'shield-check', badges: ['confirmed', 'autopay'], amount: '$215.00' },
      { id: 'prime', vendor: 'Amazon Prime', date: 'Apr 30', icon: 'storefront', badges: ['subscription'], amount: '$14.99' },
    ] satisfies UpcomingRow[],
  },
  /** Step 3 — the Kinage message (Figma 555:2432 copy) over the same list. */
  alert: {
    message: 'I found Martha’s AT&T bill. It’s overdue and higher than usual.',
    /** Where in the message the bill is named: the row lights up once typing reaches it. */
    highlightAt: 'AT&T bill',
    /** Layout only: the bubble breaks its line before this phrase (the words are unchanged). */
    lineBreakBefore: 'and higher than usual',
  },
  /** Step 4 — the household (Figma "image 338") and the people connected to it. */
  household: {
    name: 'Martha’s household',
    members: [
      { id: 'ben', initials: 'B', name: 'Ben', role: 'Coordinator', tone: 'eggplant' },
      { id: 'sarah', initials: 'S', name: 'Sarah', role: 'Supporter', tone: 'sand' },
      { id: 'martha', initials: 'M', name: 'Martha', role: 'Person supported', tone: 'rose' },
    ],
  },
};

export const VIDEO = {
  title: 'See Kinage in about a minute',
  lead: 'How bills, flags and family coordination come together. Subtitles are on by default.',
};

export const COMPARE = {
  title: 'A clearer view than the tools families use today',
  lead: 'Spreadsheets and money apps each do part of the job. Kinage is built for the part that falls between people.',
  rows: ['New bills', 'Something looks wrong', 'The family'],
  columns: [
    {
      name: 'Spreadsheet',
      cells: ['Only what someone types in', 'Nothing flags it', 'Copies drift apart, and texts fill the gaps'],
      kinage: false,
    },
    {
      name: 'Bank bill pay or a budgeting app',
      cells: ['Built for paying your own bills', 'Alerts often arrive after money has left', 'Usually one person’s view'],
      kinage: false,
    },
    {
      name: 'Kinage',
      cells: ['Found in your parent’s email', 'Flagged before you pay', 'One shared view, with a record of who did what'],
      kinage: true,
    },
  ],
};

export const TRUST = {
  title: 'Clear about what Kinage can and can’t do',
  lead: 'Kinage is built to see, not to act. Your parent stays in control.',
  columns: [
    {
      icon: 'eye',
      title: 'What Kinage can see',
      points: [
        'Bills and statements in the email your parent connects',
        'Transactions and balances, read-only through Plaid',
        'Who is handling each bill, and what was decided',
      ],
    },
    {
      icon: 'ban',
      title: 'What Kinage can’t do',
      points: [
        'Move money or pay bills',
        'See cash transactions or phone calls',
        'Ask for bank passwords or a Social Security number',
      ],
    },
    {
      icon: 'users',
      title: 'Your parent decides',
      points: [
        'Who takes part and what’s shared',
        'Whether to use the app at all, since Kinage helps either way',
        'To disconnect accounts at any time',
      ],
    },
  ],
};

export const BEN = {
  title: 'Built by a son who’s been there',
  /** Ben's words from the Q&A script (Q1), shortened; the omission is marked with an ellipsis. */
  quote: [
    'My mother went from being ‘older’ to old. It wasn’t one moment; it was the slow realization that she couldn’t manage her administrative life anymore.',
    'Now I had a second job: making sure bills got paid, catching scams, coordinating with my sister…',
    'So I started Kinage. Not as a finance executive, but as a son who knows what it’s like to get a 3 a.m. call about a shut-off notice.',
  ],
  name: 'Ben Terk',
  role: 'Founder of Kinage',
};

export const FAQ_HEAD = {
  tag: 'FAQ',
  title: 'Questions, answered clearly',
};

export const FINAL = {
  /** The emotional hook, right after the problem section. */
  title: 'Helping manage a parent’s bills shouldn’t be a one-person job',
  /** The closing banner at the end of the page: its own headline, the same text and actions. */
  titleEnd: 'Managing a parent’s bills works better as a team',
  lead: 'Nobody has to do this alone. Bring your family and your parent’s advisor into one shared view.',
};
