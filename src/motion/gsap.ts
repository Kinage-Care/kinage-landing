/**
 * The one place GSAP is configured. Import gsap / ScrollTrigger from here so
 * plugins and custom eases are always registered first.
 *
 * Division of labour (never two systems on one property of one element):
 *   GSAP + ScrollTrigger — hero flight, section reveals, product demo timeline.
 *   CSS transitions      — hover/focus/press, FAQ height + indicator,
 *                          testimonial track and card emphasis.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';
import { MOTION } from './tokens';

gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP);

CustomEase.create('kinage.out', MOTION.bezier.out);
CustomEase.create('kinage.inOut', MOTION.bezier.inOut);
CustomEase.create('kinage.exit', MOTION.bezier.exit);

gsap.defaults({ ease: 'kinage.out', duration: MOTION.duration.reveal });

// Native scrolling only; no smooth-scroll engine. Ignore mobile URL-bar
// resizes so scrubbed timelines do not jump while scrolling on phones.
ScrollTrigger.config({ ignoreMobileResize: true });

// Breakpoint changes (gsap.matchMedia) make ScrollTrigger reset the scroll
// position to 0 while it re-measures; in this layout it does not always put
// it back (observed crossing 768px). Remember where the reader was when the
// media change starts and restore it once the refresh has finished.
let scrollBeforeMediaChange: number | null = null;
(gsap as unknown as { addEventListener: (type: string, fn: () => void) => void }).addEventListener('matchMediaInit', () => {
  scrollBeforeMediaChange = window.scrollY;
});
ScrollTrigger.addEventListener('refresh', () => {
  if (scrollBeforeMediaChange === null) return;
  const y = scrollBeforeMediaChange;
  scrollBeforeMediaChange = null;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (Math.abs(window.scrollY - y) > 2) window.scrollTo(0, Math.min(y, max));
});

export { gsap, ScrollTrigger, useGSAP };
