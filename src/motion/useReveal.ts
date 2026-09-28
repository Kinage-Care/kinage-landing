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

        gsap.set(els, { autoAlpha: 0, y });
        ScrollTrigger.batch(els, {
          start,
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration,
              ease: 'kinage.out',
              stagger,
              overwrite: true,
              clearProps: 'transform,visibility,opacity',
            }),
        });
      });
      return () => mm.revert();
    },
    { scope },
  );
}
