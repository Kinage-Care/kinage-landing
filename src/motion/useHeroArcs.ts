import type { RefObject } from 'react';
import { gsap, ScrollTrigger, useGSAP } from './gsap';
import { MOTION, MQ } from './tokens';

/**
 * Very slow rotation of the dotted hero rings (refinement pass 3; continuous rings since pass 10).
 *
 * Each ring turns around its own centre in the plane of the screen, one turn
 * per `motion.arcs.period` seconds, linear — so the loop has no speed pulse,
 * reversal or snap at its boundary (0° and 360° are the same frame). Only the
 * `[data-hero-arc]` wrappers move: their parents keep the fixed tilt and
 * mirroring, the ring layer clips them, and nothing here touches the hero copy, the
 * 3D assets or the flight layer.
 *
 * When the hero leaves the viewport or the tab is hidden, the rotation eases
 * to rest over `motion.arcs.ramp` and pauses; it eases back from where it
 * stopped, without a jump. Under prefers-reduced-motion the rings stay still.
 */
export function useHeroArcs(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const root = scope.current;
        if (!root) return;
        const arcs = gsap.utils.toArray<HTMLElement>('[data-hero-arc]', root);
        if (!arcs.length) return;

        const spin = gsap.to(arcs, { rotation: 360, duration: MOTION.arcs.period, ease: 'none', repeat: -1, paused: true });
        let ramp: gsap.core.Tween | null = null;
        let running = false;

        const setRunning = (on: boolean) => {
          if (on === running) return;
          running = on;
          ramp?.kill();
          if (on) {
            if (spin.paused()) spin.timeScale(0.001).play();
            ramp = gsap.to(spin, { timeScale: 1, duration: MOTION.arcs.ramp, ease: 'sine.inOut' });
          } else {
            ramp = gsap.to(spin, { timeScale: 0.001, duration: MOTION.arcs.ramp, ease: 'sine.inOut', onComplete: () => spin.pause() });
          }
        };

        let inView = false;
        const sync = () => setRunning(inView && document.visibilityState === 'visible');
        const st = ScrollTrigger.create({
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => {
            inView = self.isActive;
            sync();
          },
        });
        document.addEventListener('visibilitychange', sync);

        return () => {
          document.removeEventListener('visibilitychange', sync);
          st.kill();
          ramp?.kill();
          spin.kill();
          gsap.set(arcs, { clearProps: 'transform' });
        };
      });
      return () => mm.revert();
    },
    { scope },
  );
}
