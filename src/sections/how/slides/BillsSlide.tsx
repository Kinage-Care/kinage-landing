import type { CSSProperties } from 'react';
import { UpcomingTable } from '../../../components/product/UpcomingTable';
import { HOW } from '../../../content/home';
import { MOTION } from '../../../motion/tokens';
import { useSequence } from '../useSequence';

/** Row stagger and each row's move (motion tokens: stagger.steps 120 ms, duration.reveal 600 ms). */
const STAGGER = MOTION.stagger.steps * 1000;
const MOVE = MOTION.duration.reveal * 1000;
/** From the first row starting to the last row settling. */
const STAIR = (HOW.table.rows.length - 1) * STAGGER + MOVE;

/**
 * 0 empty (reset, no transition) · 1 the rows arrive one by one, top to
 * bottom · 2 after the full list has held for 4 s, they leave one by one in
 * the same order. Then a short pause (one move) and it plays again, for as
 * long as the step is active. Reduced motion: the full list, still.
 */
const TIMES = [0, 120, 120 + STAIR + MOTION.walkthrough.hold] as const;
const OPTIONS = { hold: STAIR + MOVE, reducedPhase: 1 };

/** Step 2 — Upcoming payments (Figma 544:406), rows in urgency order. */
export function BillsSlide({ active, reduced }: { active: boolean; reduced: boolean }) {
  const phase = useSequence(active, TIMES, reduced, OPTIONS);
  const t = HOW.table;
  return (
    <div className="bills" data-phase={phase} style={{ '--stagger': `${STAGGER}ms` } as CSSProperties}>
      <p className="bills__title p-ui">{t.title}</p>
      <UpcomingTable rows={t.rows} filters={t.filters} />
    </div>
  );
}
