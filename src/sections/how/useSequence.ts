import { useEffect, useState } from 'react';
import { MOTION } from '../../motion/tokens';

/**
 * A step visual's internal sequence: while `active`, the phase advances
 * 0 → 1 → … at the given times (ms from activation), holds the last phase
 * for the walkthrough hold (motion.walkthrough.hold, 4 s) and then plays
 * again from 0 — a loop for as long as the step stays active, hovered or
 * not. Each activation starts again from 0. Under reduced motion the end
 * state is shown at once and stays (the last phase, or `reducedPhase` when
 * the last phase is an exit). `hold` overrides the pause after the last
 * phase. Timers are cleared on every change and on unmount.
 */
export function useSequence(
  active: boolean,
  times: readonly number[],
  reduced: boolean,
  { hold = MOTION.walkthrough.hold, reducedPhase }: { hold?: number; reducedPhase?: number } = {},
): number {
  const last = times.length - 1;
  const still = reducedPhase ?? last;
  const [phase, setPhase] = useState(still);

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setPhase(still);
      return;
    }
    let timers: number[] = [];
    const play = () => {
      setPhase(0);
      timers = times.slice(1).map((t, i) => window.setTimeout(() => setPhase(i + 1), t));
      timers.push(window.setTimeout(play, times[last] + hold));
    };
    play();
    return () => timers.forEach((t) => window.clearTimeout(t));
    // `times` is a module constant per slide, so it is not a dependency.
  }, [active, reduced, last, still, hold]);

  return phase;
}
