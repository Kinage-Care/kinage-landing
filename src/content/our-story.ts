/**
 * Our Story page content.
 *
 * Source: `kinage-site (1).html` → #page-story. That page is a writing
 * template, not copy ("Template, not copy … Nothing here invents his
 * history"): it defines the headings and what each chapter should say, and
 * leaves every narrative block as a prompt for Ben. Only facts that already
 * exist in approved copy are published here:
 *
 *  - Ben's own paragraph and heading from the landing's founder section
 *    (Figma 583:787);
 *  - the product constraints the template names for "What we refused to
 *    build", in the wording already approved on the landing (trust section,
 *    583:870; What Kinage Is, 583:595).
 *
 * The other chapters keep their template heading and brief with `copy: null`
 * and are not rendered until Ben writes them — drop his paragraphs into
 * `copy` and the page picks them up. Nothing below is invented history.
 */
export type StoryChapter = {
  id: string;
  title: string;
  /** The template's one-line framing for the chapter. */
  kicker: string;
  /** Paragraphs. `null` = waiting for Ben's text; the chapter stays hidden. */
  copy: string[] | null;
  /** What the template asks this chapter to cover (editorial only, never rendered). */
  brief: string;
};

export const OUR_STORY: {
  eyebrow: string;
  title: string;
  intro: string[];
  chapters: StoryChapter[];
  signature: { name: string; role: string };
  closing: string;
} = {
  eyebrow: 'Our story',
  title: 'Why I built this',
  intro: [
    'I built Kinage because my family lived this problem firsthand. When we needed to coordinate my mother’s finances, nothing available truly helped. Kinage is the product I wish we’d had.',
  ],
  chapters: [
    {
      id: 'what-happened',
      title: 'What happened',
      kicker: 'The event itself, told plainly and in order.',
      copy: null,
      brief:
        'The specific thing that happened in Ben’s family: what he found, when he found it, and what it had already cost by then. Two or three short paragraphs.',
    },
    {
      id: 'what-we-tried',
      title: 'What we tried',
      kicker: 'Why the obvious answers did not work.',
      copy: null,
      brief: 'What was actually tried (spreadsheets, a shared login, a sibling group chat, a bill pay service) and why each one failed.',
    },
    {
      id: 'what-we-refused-to-build',
      title: 'What we refused to build',
      kicker: 'The constraint that shaped everything after it.',
      copy: [
        'Kinage can only see data. It never moves, changes, or touches anything in any account, and it cannot initiate transfers, make payments, or touch funds, by design.',
        'Your parent decides who sees what, and can revoke access at any time.',
      ],
      brief: 'Ben says why read-only, no money movement and the older adult’s control were choices, not limitations.',
    },
    {
      id: 'who-this-is-for',
      title: 'Who this is for',
      kicker: 'The reader recognising themselves.',
      copy: null,
      brief: 'From Ben’s family to the reader’s: the adult child doing this alongside a job; the advisor carrying it for several families at once.',
    },
  ],
  /** Two-line caption under Ben's photo: name, then role (no comma or dash). */
  signature: { name: 'Ben Terk', role: 'Founder of Kinage' },
  closing: 'See what Kinage finds in your family’s first week',
};
