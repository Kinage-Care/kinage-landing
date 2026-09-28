/**
 * Phone demo scenario for "Managing a parent's finances is overwhelming"
 * (Family Financial Oversight, Figma 601:2577 "Kinage homepage V2").
 *
 * Demo content, not a live product: no AI, no backend. Edit the copy and
 * timings here — the component reads nothing else. All times in seconds.
 * One run takes about 6 s, then the completed state holds for `hold` and the
 * sequence loops (motion/useProductDemo.ts).
 *
 * The alert and reply copy is the phone screen's own Figma copy, so the
 * completed state is the Figma frame; the typed question is the approved demo
 * question from the previous (desktop) demo.
 */
export const DEMO_CHAT = {
  question: 'Is there anything I should review?',
  /** First feed section (Figma "Overdue payments"); `
` = the Figma line break. */
  firstAlert: 'We found 2 overdue bills in Martha’s email.\nLet’s take care of these right away!',
  /** Reply section (Figma "Unusual payments"); `
` = the Figma line break. */
  reply: '7 bills look higher or different than usual\nthis month.',

  /** Accessible summary of the whole scenario (the phone itself is decorative). */
  summary:
    'Kinage phone app demo. The home screen shows Martha’s estimated balance and two overdue bills, including AT&T Home Internet. A family member asks “Is there anything I should review?” and Kinage replies that 7 bills look higher or different than usual, flagging an AT&T Mobile charge that may not be from the real Verizon.',

  timing: {
    /** Frame fades up (once, when the section is first reached). */
    frameIn: 0.7,
    /** Header, then first alert's message and card stack, each offset by this. */
    stagger: 0.14,
    /** Pause before the family member starts typing. */
    beforeTyping: 0.5,
    /** Seconds per typed character. */
    perChar: 0.036,
    /** Pause with the full question in the box before sending. */
    beforeSend: 0.3,
    /** How long the reply indicator is shown. */
    thinking: 0.9,
    /** Reply text and review cards entrance. */
    replyIn: 0.55,
    /** The completed state is held this long before the loop resets (brief: 3 s). */
    hold: 3,
    /** Fade back to the start state. */
    reset: 0.45,
    /** Empty beat between the reset and the next run. */
    restartGap: 0.25,
  },
} as const;
