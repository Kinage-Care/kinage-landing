/**
 * FAQ — the question set from Figma (node 562:4255) plus three topics from
 * the source map (permissions, link-only bills, advisors).
 *
 * Answers are condensed from Ben Terk's Q&A Script (consumer series, Q1–Q19;
 * advisor series, A1–A7) into short website prose, within the limits in
 * Roger's messaging taxonomy (Kinage flags suspicious signals in the data it
 * monitors, cannot see cash or phone calls, never moves money, guarantees
 * nothing). `ref` names the source questions. Settled decisions that the
 * script does not cover are marked `source: 'review'` (client review of
 * 2026-09-30: $19.99 per month; email and bank connection both required,
 * the bank through Plaid with read-only access). `source: 'taxonomy'` uses
 * the taxonomy's approved language verbatim (Power of Attorney framing).
 */
export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  source: 'qa' | 'review' | 'taxonomy';
  ref: string;
  status: 'final';
};

export const FAQ: FaqItem[] = [
  {
    id: 'cost',
    question: 'How much does Kinage cost?',
    answer:
      'Kinage is a monthly subscription for families, with plans starting at $19.99 per month. What you pay depends on how many people you involve and how much coordination you need. There is no long-term contract.',
    source: 'review',
    ref: 'Q9; price from the 2026-09-30 review',
    status: 'final',
  },
  {
    id: 'parent-app',
    question: 'Does my parent need to use the app?',
    answer:
      "No. With your parent's consent, you can connect their email and accounts and follow everything on your own phone. If your parent wants to stay involved, Kinage uses plain language and large type, and they can ask questions in their own words. They decide how much to keep and how much to hand over.",
    source: 'qa',
    ref: 'Q11, Q5',
    status: 'final',
  },
  {
    id: 'move-money',
    question: "Can Kinage access or move my parent's money?",
    answer:
      'No. Kinage has read-only access to the accounts you choose to connect. It sees transactions and balances so it can spot patterns, but it cannot make payments, transfers, or changes of any kind. You, your parent, or your advisor make every decision and take every action.',
    source: 'qa',
    ref: 'Q4, Q13',
    status: 'final',
  },
  {
    id: 'connect',
    question: 'What do I need to connect?',
    answer:
      "Your parent's email and a bank account, both with your parent's consent. Kinage scans the email for bills and statements, with no forwarding or manual entry. The bank connects through Plaid with read-only access, so Kinage can match bills to payments and flag what looks unusual. Kinage never asks for bank passwords or a Social Security number.",
    source: 'review',
    ref: 'Q3, Q4; bank required per the 2026-09-30 review',
    status: 'final',
  },
  {
    id: 'permissions',
    question: 'Who in the family can see what?',
    answer:
      'Your parent decides, or a family lead your parent has chosen. They can invite siblings and trusted advisors and choose what each person can see, including view-only access for someone who wants to stay informed. Every action is logged, so everyone can see who did what and when. That record matters, because research from Ameriprise Financial finds that when adult siblings fight about money, the disputes are usually about their parents, most often inheritance and caregiving.',
    source: 'qa',
    ref: 'Q5, Q15; Ameriprise sibling-conflict proof point (taxonomy)',
    status: 'final',
  },
  {
    id: 'poa',
    question: 'Do we need a power of attorney?',
    answer:
      "Kinage is not a power of attorney and doesn't replace legal planning. It doesn't close that legal gap, but it makes it far less relevant while your parent is still able to grant consent directly. As long as your parent can say yes, you're in, with their knowledge and on their terms, no attorney required.",
    source: 'taxonomy',
    ref: 'Taxonomy: Power of Attorney framing (approved language)',
    status: 'final',
  },
  {
    id: 'data-safe',
    question: "Is my parent's data safe?",
    answer:
      "Kinage uses bank-level encryption and requires multi-factor authentication. Account connections are tokenized and read-only, so Kinage never stores bank passwords, and it never asks for a Social Security number. Kinage doesn't sell personal data, share it with advertisers, or train general AI models on your family's data. You can disconnect accounts at any time.",
    source: 'qa',
    ref: 'Q16',
    status: 'final',
  },
  {
    id: 'link-only',
    question: 'What about bills that arrive as a link or a locked PDF?',
    answer:
      "Many companies send a “your statement is ready” email with no amount and no attachment. Kinage flags it as a probable bill, matches it to the vendor and past payments, and shows an estimated amount and due date with a confidence level. That estimate is not a confirmed invoice. For a password-protected PDF, Kinage gives you an estimate from past bills, and you open the statement yourself to confirm it.",
    source: 'qa',
    ref: 'Q14 (the future password vault is left out)',
    status: 'final',
  },
  {
    id: 'vs-bank',
    question: "How is this different from my bank's app?",
    answer:
      "Your bank shows you one account, and its alerts usually arrive after money has left. Kinage brings the accounts you connect, your parent's bills, and the family members helping into one view, and flags unusual activity so you can check before you pay.",
    source: 'qa',
    ref: 'Q2, Q7',
    status: 'final',
  },
  {
    id: 'vs-spreadsheet',
    question: 'How is this different from a spreadsheet?',
    answer:
      "A spreadsheet doesn't know when a new bill arrives, doesn't scan email, and doesn't notice when a $40 water bill suddenly becomes $400. It also can't keep siblings in sync. Kinage replaces that work, from manual entry and constant checking to keeping everyone on the same version.",
    source: 'qa',
    ref: 'Q12',
    status: 'final',
  },
  {
    id: 'wrong',
    question: 'What happens if Kinage gets something wrong?',
    answer:
      "Kinage doesn't pay bills. You do. It flags possible issues in the data it monitors and gives you context, and you decide whether to act. If a flagged bill turns out to be fine, you override the flag. Kinage can't see cash transactions or phone calls, so it is an early warning, not a guarantee. Every alert, override, and payment decision is logged.",
    source: 'qa',
    ref: 'Q13, Q3; taxonomy scope limits',
    status: 'final',
  },
  {
    id: 'advisor',
    question: 'Can our financial advisor take part?',
    answer:
      "Yes, with your parent's permission. A financial planner, CPA, daily money manager, or estate attorney can join your family's Kinage circle to see bills, payment status, and anything Kinage flags. Every action has an audit trail, and the advisor never takes custody of your parent's money.",
    source: 'qa',
    ref: 'Q6, A1, A2',
    status: 'final',
  },
  {
    id: 'trial',
    question: 'Can I try Kinage before committing?',
    answer:
      "Yes. You get a two-month trial. Connect your parent's email and accounts, invite family members or trusted advisors, and watch bills come into one shared view. If it's not a fit, you can disconnect your accounts with one click.",
    source: 'qa',
    ref: 'Q19',
    status: 'final',
  },
];
