import type { RefObject } from 'react';
import { gsap, ScrollTrigger, useGSAP } from './gsap';
import { MOTION, MQ } from './tokens';

type RevealOptions = {
  /** Selector (scoped to the ref) for the elements to reveal, in order. */
  targets?: string;
  /** Seconds between siblings. Defaults to the list stagger token. */
  stagger?: number;
  /** Override travel distance (px). */
  distance?: number;
  duration?: number;
  /** ScrollTrigger start. */
  start?: string;
};

/**
 * One-shot reveal for a section: siblings rise `distance` px and fade in with
 * a small stagger when the section enters the viewport.
 *
 * Content is visible by default. The hidden start state is applied by GSAP
 * only when motion is allowed and JS runs, so a script failure can never leave
 * copy invisible. Under prefers-reduced-motion nothing moves.
 *
 * Only opacity and transform are animated, never visibility or display: the
 * waiting content stays in the accessibility tree and in the tab order, so
 * screen readers read the whole page and Tab reaches every control. When
 * keyboard focus lands inside a section that has not revealed yet, that
 * section is shown at once, so the focused element is never invisible.
 */
export function useReveal(scope: RefObject<HTMLElement | null>, options: RevealOptions = {}) {
  const {
    targets = '[data-reveal]',
    stagger = MOTION.stagger.list,
    distance,
    duration = MOTION.duration.reveal,
    start = MOTION.trigger.revealStart,
  } = options;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: MQ.motion, mobile: MQ.mobile }, (ctx) => {
        const { motion, mobile } = ctx.conditions as { motion: boolean; mobile: boolean };
        if (!motion || !scope.current) return;
        const els = gsap.utils.toArray<HTMLElement>(targets, scope.current);
        if (!els.length) return;
        const y = distance ?? (mobile ? MOTION.distance.revealMobile : MOTION.distance.reveal);

        const waiting = new Set(els);
        gsap.set(els, { opacity: 0, y });
        ScrollTrigger.batch(els, {
          start,
          once: true,
          onEnter: (batch) => {
            batch.forEach((el) => waiting.delete(el as HTMLElement));
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration,
              ease: 'kinage.out',
              stagger,
              overwrite: true,
              clearProps: 'transform,opacity',
            });
          },
        });

        // Keyboard focus inside a section that is still waiting: show it now.
        const root = scope.current;
        const onFocusIn = () => {
          if (!waiting.size) return;
          const now = [...waiting];
          waiting.clear();
          gsap.killTweensOf(now);
          gsap.set(now, { clearProps: 'transform,opacity' });
        };
        root.addEventListener('focusin', onFocusIn);
        return () => root.removeEventListener('focusin', onFocusIn);
      });
      return () => mm.revert();
    },
    { scope },
  );
}
