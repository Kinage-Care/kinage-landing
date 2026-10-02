import { useRef } from 'react';
import { FLIGHT_ASSETS, FLIGHT_SIZES } from '../../content/flight';
import { useHeroFlight } from '../../motion/useHeroFlight';
import { Problem } from '../Problem';
import { Hero } from './Hero';

/**
 * Hero + "Right now, it's hard to see the whole picture" as one unit (V1's
 * HeroFlight): both sections sit in one flight zone, adjacent, so the six
 * paper-style objects can travel from the hero into the three problem cards
 * on one coordinate system as you scroll (motion/useHeroFlight.ts, 768px and
 * up, motion allowed). Nothing may be inserted between the two sections.
 *
 * Static markup is the composition itself: every object is rendered in its
 * hero slot and in its card slot. Flight mode hides both static sets and
 * shows the single moving instance per object, so only one copy is visible.
 */
export function HeroFlight() {
  const zoneRef = useRef<HTMLDivElement>(null);
  useHeroFlight(zoneRef);

  return (
    <div className="flight-zone" ref={zoneRef}>
      <Hero />
      <Problem />
      {/* One moving instance per object, in two decorative layers: back (z 2,
          beneath all copy) and front (z 4, above the z 3 copy). Neither is
          focusable or clickable. */}
      {(['back', 'front'] as const).map((layer) => (
        <div key={layer} className={`flight-layer flight-layer--${layer}`} aria-hidden="true">
          {FLIGHT_ASSETS.filter((a) => (a.layer ?? 'back') === layer).map((a) => (
            <img key={a.id} className="flight-asset" data-flight-asset={a.id} src={a.src} srcSet={a.srcSet} sizes={FLIGHT_SIZES} alt="" style={{ zIndex: a.z }} />
          ))}
        </div>
      ))}
    </div>
  );
}
