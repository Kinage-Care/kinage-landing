/**
 * FAQ — twelve questions for families. Every answer states only what the
 * sources confirm; `source` records where (never rendered). Advisor questions
 * stay on /advisors. Three answers are the client's exact text (2 Oct 2026):
 * power of attorney, the bank app, and the one-month trial. Not stated on
 * purpose (see README → "Confirmations"): encryption and audit details,
 * paper-mail capture, per-category permissions, advisor reporting.
 *
 * Sources: Ben Terk Q&A script (consumer Q2–Q19), Kinage Messaging Taxonomy
 * v4 (May 2026), team call 30 Sep 2026 (bank connection is required).
 */
export type FaqItem = {
  id: string;
  question: string;
  answer: string[];
  /** Editorial only. */
  source: string;
};

export const FAQ: FaqItem[] = [
  {
    id: 'how-it-works',
    question: 'How does Kinage work, and what do I connect?',
    answer: [
      'With your parent’s consent, you connect two things: their email and their bank accounts. Kinage finds bills and statements in the email and matches them to account activity, so what’s due and what’s been paid sit in one shared list.',
      'Bank accounts connect read-only through Plaid. Kinage never asks for bank passwords or a Social Security number.',
    ],
    source: 'Q3, Q4; call 30 Sep (bank required, read-only Plaid)',
  },
  {
    id: 'money',
    question: 'Does Kinage pay bills or move money?',
    answer: [
      'No. Kinage can see activity, but it can’t move money, pay a bill or change anything in an account. It flags what needs attention and gives context. You, your parent or your advisor make the decision and pay the way you already do.',
    ],
    source: 'Q13, Q16, Q17; taxonomy',
  },
  {
    id: 'parent',
    question: 'Does my parent have to use the app?',
    answer: [
      'No. Kinage helps even if your parent never logs in. You can set it up and get the updates. If they want to stay involved, they can see what’s going on and ask questions in plain language. Your parent is never removed from the process unless they decide that’s what they want.',
    ],
    source: 'Q5, Q11',
  },
  {
    id: 'who',
    question: 'Who can see information and help?',
    answer: [
      'Your parent decides who takes part, for example you, a sibling and a trusted advisor such as a daily money manager. Everyone involved sees who is handling each bill, and every decision is recorded, so nobody has to wonder whether someone else took care of it.',
    ],
    source: 'Q4, Q5, Q13, Q15; taxonomy (who participates, audit trail)',
  },
  {
    id: 'poa',
    question: 'Does Kinage require a power of attorney?',
    answer: [
      'No. Kinage does not require a power of attorney. With your parent’s informed, voluntary consent, they can invite you to help on terms they choose, while they remain able to make their own decisions.',
      'Kinage is not a power of attorney and does not replace estate, legal, or financial planning. A POA or other legal authority may be needed if your parent can no longer provide consent or if a bank, provider, or transaction requires it. This is general information, not legal advice; consult a qualified attorney about your family’s situation.',
    ],
    source: 'Client brief, 2 Oct 2026 (exact text)',
  },
  {
    id: 'different',
    question: 'How is this different from a spreadsheet or a budgeting app?',
    answer: [
      'A spreadsheet only knows what someone types in, and copies drift apart between siblings. Bank bill pay and budgeting apps are usually built for managing your own money, and their alerts often arrive after money has already left the account.',
      'Kinage watches for new bills, flags what looks off before you pay, and keeps the whole family working from one shared view with a record of who did what.',
    ],
    source: 'Q2, Q7, Q12 (stated without absolutes)',
  },
  {
    id: 'bank-app',
    question: 'How is this different from my bank’s app?',
    answer: [
      'Your bank app shows activity in that bank’s accounts, usually after money has moved. Kinage brings the accounts and bills you choose to connect into one place, so you can review what a bill is, whether it looks legitimate, and whether it has already been paid, before you act.',
      'It is built primarily for families and their advisors helping a parent stay on top of bills, but it is also useful for any busy household managing bills across multiple accounts.',
    ],
    source: 'Client brief, 2 Oct 2026 (exact text)',
  },
  {
    id: 'false-flag',
    question: 'What if Kinage flags something that’s fine?',
    answer: [
      'Then you mark it as fine and move on. A flag is a prompt to take a look, not a decision. Kinage adds context and you stay in control. The flag and what you decided are both kept in the record.',
    ],
    source: 'Q13',
  },
  {
    id: 'data',
    question: 'How is my parent’s data handled?',
    answer: [
      'Kinage uses read-only connections. It can see authorized data, but it can’t move money or change accounts. It never asks for bank passwords or a Social Security number. Your parent’s accounts can be disconnected at any time.',
    ],
    source: 'Q3, Q4, Q16, Q17 — only the points confirmed in several sources',
  },
  {
    id: 'behind',
    question: 'Can we start if bills are already overdue?',
    answer: [
      'Yes. Kinage can’t undo late notices, but it can help you get back in control. You can see every outstanding bill in one place, work out which ones are most urgent, and agree who handles what. Once you’ve caught up, it helps the next round of bills stay on track.',
    ],
    source: 'Q18',
  },
  {
    id: 'cost',
    question: 'What does it cost?',
    answer: ['Kinage is a monthly subscription for families. Ask about plans and we’ll share the current options.'],
    source: 'Q9 (subscription); price not confirmed — no figures, no trial',
  },
  {
    id: 'trial',
    question: 'Can I try Kinage before committing?',
    answer: [
      'Yes. You get a one-month trial. Connect your parent’s email and accounts, invite family members or trusted advisors, and watch bills come into one shared view. If it’s not a fit, you can disconnect your accounts with one click.',
    ],
    source: 'Client brief, 2 Oct 2026 (answer: exact text; question wording from the V1 landing)',
  },
];
