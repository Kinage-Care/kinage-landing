/**
 * Very light desktop wheel smoothing (Lenis) and the page scroll lock.
 *
 * Lenis moves the *native* window scroll, so position: sticky (the stack), the
 * scrubbed hero flight and the nav's scroll/idle detection keep working
 * unchanged — no transformed scroll container, no scrollerProxy. It only runs
 * with a fine pointer from `motion.smooth.min-width` and never under
 * prefers-reduced-motion; touch keeps native scrolling.
 *
 * One loop drives it: Lenis's own requestAnimationFrame, so every step is
 * timed by the frame's vsync timestamp (the GSAP ticker passes Date.now() at
 * callback time, whose jitter made the steps uneven). ScrollTrigger updates
 * from Lenis's scroll event in the same frame. Each wheel step glides for a
 * fixed duration on an ease-out (motion.smooth) instead of lerp: lerp only
 * approaches the target and snaps the last half pixel, which ended every step
 * with a slow pixel-by-pixel crawl and a final twitch.
 * Lenis is the only smoothing: scroll-driven timelines scrub without a lag of
 * their own while it runs (see SMOOTH_QUERY in useHeroFlight).
 *
 * GSAP's ScrollSmoother is not used on purpose: it transforms the content,
 * which breaks native sticky positioning.
 */
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger } from './gsap';
import { MOTION } from './tokens';

let lenis: Lenis | null = null;
let locks = 0;

/** When Lenis smooths the wheel: wide windows, a fine pointer, motion allowed. */
export const SMOOTH_QUERY = `(min-width: ${MOTION.smooth.minWidth}px) and (pointer: fine) and (prefers-reduced-motion: no-preference)`;
const QUERY = SMOOTH_QUERY;

/** Starts/stops smoothing as the media conditions change. Returns a cleanup. */
export function initSmoothScroll(): () => void {
  const mql = window.matchMedia(QUERY);

  const start = () => {
    if (lenis) return;
    lenis = new Lenis({
      duration: MOTION.smooth.duration,
      easing: gsap.parseEase(MOTION.smooth.ease),
      smoothWheel: true,
      syncTouch: false,
      autoRaf: true,
      anchors: false,
    });
    lenis.on('scroll', ScrollTrigger.update);
    if (locks > 0) lenis.stop();
  };
  const stop = () => {
    if (!lenis) return;
    lenis.destroy();
    lenis = null;
  };
  const sync = () => (mql.matches ? start() : stop());

  sync();
  mql.addEventListener('change', sync);
  return () => {
    mql.removeEventListener('change', sync);
    stop();
  };
}

/** Jump (no animation) to a scroll position, keeping Lenis in step. */
export function jumpTo(y: number) {
  if (lenis) {
    // The page may have just been replaced (route change): re-read its height
    // first, or Lenis clamps to the previous page's scroll limit.
    lenis.resize();
    lenis.scrollTo(y, { immediate: true, force: true });
  } else window.scrollTo(0, y);
}

/**
 * Prevents page scrolling while a modal is open. The document keeps its
 * scroll offset (overflow is clipped on <html>, nothing is repositioned), so
 * closing returns to the exact spot and scroll-driven animations stay where
 * they were. `scrollbar-gutter: stable` (base.css) avoids a width jump.
 */
export function lockScroll(): () => void {
  locks += 1;
  if (locks === 1) {
    document.documentElement.classList.add('is-scroll-locked');
    lenis?.stop();
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks -= 1;
    if (locks === 0) {
      document.documentElement.classList.remove('is-scroll-locked');
      lenis?.start();
    }
  };
}

