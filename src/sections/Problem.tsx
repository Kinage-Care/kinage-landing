import { useRef, type CSSProperties } from 'react';
import { FLIGHT_ASSETS, FLIGHT_SIZES, SLOT_AREA, type FlightAsset, type Rect } from '../content/flight';
import { PROBLEM } from '../content/home';
import { SECTIONS } from '../content/links';
import { useReveal } from '../motion/useReveal';
import scamShadow from '../assets/figma/problem-scam-shadow.svg';
import './Problem.css';

/** Slot-area coordinates → percentages of the 336 × 201 art box. */
const pct = (r: Rect): CSSProperties => ({
  left: `${(r.left / SLOT_AREA.width) * 100}%`,
  top: `${(r.top / SLOT_AREA.height) * 100}%`,
  width: `${(r.width / SLOT_AREA.width) * 100}%`,
  height: `${(r.height / SLOT_AREA.height) * 100}%`,
});

const cardAssets = (card: number) => FLIGHT_ASSETS.filter((a) => a.card === card).sort((a, b) => a.z - b.z);

/** Soft contact shadow under an object (V1): a blurred rounded rect, or the exported scam shadow. */
function ContactShadow({ asset }: { asset: FlightAsset }) {
  const s = asset.shadow;
  return (
    <span className="problem-card__shadow" style={pct(s.box)} data-flight-shadow aria-hidden="true">
      {s.kind === 'svg' ? (
        <span
          className="problem-card__shadow-svg"
          style={{ width: `${(s.inner.width / s.box.width) * 100}%`, height: `${(s.inner.height / s.box.height) * 100}%`, rotate: `${s.rotate}deg` }}
        >
          <img src={scamShadow} alt="" style={{ inset: '-51.27% -50.93% -51.44% -51.3%' }} />
        </span>
      ) : (
        <span
          className="problem-card__shadow-blur"
          style={
            {
              width: `${(s.inner.width / s.box.width) * 100}%`,
              height: `${(s.inner.height / s.box.height) * 100}%`,
              rotate: `${s.rotate}deg`,
              opacity: s.opacity,
              '--blur': s.blur,
              '--radius': s.radius,
            } as CSSProperties
          }
        />
      )}
    </span>
  );
}

/**
 * 2 — Problem → visibility, in the V1 landing's layout: three cards whose
 * art areas receive the hero's six paper-style objects as you scroll (the
 * flight, motion/useHeroFlight.ts, runs from 768px up). Copy is this page's:
 * title, body and the "With Kinage" row, on shared subgrid rows so they line
 * up across the cards; one sourced figure below.
 *
 * The cards carry the flight's measured anchors, so they never move: only the
 * heading and the figure reveal. Phones (no flight): each card's objects
 * appear in sequence as the card comes into view (useHeroFlight, mobile).
 */
export function Problem() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, { targets: '[data-reveal]' });

  return (
    <section className="section problem" id={SECTIONS.problem} aria-labelledby="problem-title" ref={ref}>
      <div className="container">
        <header className="section-head problem__head" data-reveal>
          <h2 className="section-title" id="problem-title">
            {PROBLEM.title}
          </h2>
          <p className="section-lead">{PROBLEM.lead}</p>
        </header>

        <ul className="problem__cards" data-flight-row>
          {PROBLEM.cards.map((c, i) => (
            <li className="problem-card" key={c.title}>
              {/* Paint order by DOM order only (no z-index here): contact shadows
                  first, then slots back to front, so the flight layer (z 2) passes
                  above the art and below the card copy (z 3). */}
              <div className="problem-card__art" aria-hidden="true">
                {cardAssets(i).map((a) => (
                  <ContactShadow key={`${a.id}-shadow`} asset={a} />
                ))}
                {cardAssets(i).map((a) => (
                  <span key={a.id} className="problem-card__slot" style={pct(a.slot)} data-flight-to={a.id}>
                    <img className="flight-static" src={a.src} srcSet={a.srcSet} sizes={FLIGHT_SIZES} alt="" style={{ opacity: a.slotOpacity }} />
                  </span>
                ))}
              </div>
              <h3 className="problem-card__title">{c.title}</h3>
              <p className="problem-card__body">{c.body}</p>
              <p className="problem-card__answer">
                <strong>With Kinage:</strong> {c.withKinage}
              </p>
            </li>
          ))}
        </ul>

        <figure className="problem__stat" data-reveal>
          <p className="problem__stat-value">{PROBLEM.stat.value}</p>
          <figcaption className="problem__stat-text">
            <span>{PROBLEM.stat.text}</span>
            <small>{PROBLEM.stat.source}</small>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
