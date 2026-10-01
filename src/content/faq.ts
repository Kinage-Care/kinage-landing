/**
 * FAQ — questions and order from Figma (node 562:4255).
 *
 * Sources:
 *  - 'brief'  Ben Terk's answers, verbatim from the Kinage Landing Page Brief
 *             v3 (April 9, 2026 — landing_brief.txt §12);
 *  - 'review' settled in the client review of 2026-09-30 (Ben): the price is
 *             $19.99 per month, and the bank connection is required, through
 *             Plaid with read-only access. Wording follows Ben's Q&A Script
 *             (Q3, Q4, Q9).
 * No answer is a placeholder any more.
 */
export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  source: 'brief' | 'review';
  status: 'final';
};

export const FAQ: FaqItem[] = [
  {
    id: 'cost',
    question: 'How much does Kinage cost?',
    answer:
      'Kinage is a monthly subscription for families. Plans start at $19.99 per month, depending on how many family members and trusted advisors you involve.',
    source: 'review',
    status: 'final',
  },
  {
    id: 'parent-app',
    question: 'Does my parent need to use the app?',
    answer:
      'No. Your parent decides who participates and what to share, but they never need to learn or interact with the technology. You handle the day-to-day. Kinage meets your parent where they are. If they want full control, they keep it. If they want visibility without responsibility, they get it. If they want to hand more over to you, they can.',
    source: 'brief',
    status: 'final',
  },
  {
    id: 'move-money',
    question: "Can Kinage access or move my parent's money?",
    answer:
      'No. Kinage is a coordination platform, not a payment platform. It uses read-only access to see bills and transactions, but it cannot make payments, transfers, or changes of any kind. You always make the final call.',
    source: 'brief',
    status: 'final',
  },
  {
    id: 'connect',
    question: 'What do I need to connect?',
    answer:
      "Your parent's email and a bank account, both with your parent's consent. Kinage scans the email for bills and statements, with no forwarding or manual entry. The bank connects through Plaid with read-only access, so Kinage can match bills to payments and flag what looks unusual. Kinage cannot move money.",
    source: 'review',
    status: 'final',
  },
  {
    id: 'data-safe',
    question: "Is my parent's data safe?",
    answer:
      "Kinage uses bank-grade encryption, multi-factor authentication, and Plaid for bank connections. We never store Social Security numbers or bank passwords. We don't sell personal data or share information with advertisers. Your parent controls all permissions and can disconnect accounts at any time.",
    source: 'brief',
    status: 'final',
  },
  {
    id: 'vs-bank',
    question: "How is this different from my bank's app?",
    answer:
      "Your bank shows you one account. Kinage brings the accounts you connect, your parent's bills, and the family members helping into one view, and adds anomaly detection and family coordination that a single bank's app doesn't offer.",
    source: 'brief',
    status: 'final',
  },
  {
    id: 'vs-spreadsheet',
    question: 'How is this different from a spreadsheet?',
    answer:
      "A spreadsheet doesn't know when a new bill arrives, doesn't scan email, doesn't detect when a $40 water bill suddenly becomes $400, and doesn't coordinate who did what. Kinage replaces the work of a spreadsheet: manual entry, constant checking, version control, and detective work.",
    source: 'brief',
    status: 'final',
  },
  {
    id: 'wrong',
    question: 'What happens if Kinage gets something wrong?',
    answer:
      "Kinage doesn't pay bills, you do. Kinage flags potential issues and provides context. You decide whether to act. Think of it like a lane-departure warning in your car: it alerts you when you drift, but you decide whether to steer. Every alert, override, and payment decision is logged.",
    source: 'brief',
    status: 'final',
  },
  {
    id: 'trial',
    question: 'Can I try Kinage before committing?',
    answer:
      "Yes. You get a full trial period so you can feel the difference before you pay. Connect accounts, invite family, and see bills flow into one dashboard. If it's not a fit, disconnect with one click.",
    source: 'brief',
    status: 'final',
  },
];
