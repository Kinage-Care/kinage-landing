import { useRef, type CSSProperties } from 'react';
import { EarlyAccessButton } from '../components/EarlyAccess';
import { SmartLink } from '../components/SmartLink';
import { FLIGHT_ASSETS, PROBLEMS, SLOT_AREA, type FlightAsset, type Rect } from '../content/landing';
import { SECTIONS } from '../content/links';
import { gsap, useGSAP } from '../motion/gsap';
import { useHeroArcs } from '../motion/useHeroArcs';
import { useHeroFlight } from '../motion/useHeroFlight';
import { useReveal } from '../motion/useReveal';
import { MOTION, MQ } from '../motion/tokens';
import heroRing from '../assets/figma/hero-ring.svg';
import scamShadow from '../assets/figma/problem-scam-shadow.svg';
import './HeroFlight.css';

/** Hero-card coordinates → CSS custom properties consumed with the --u unit. */
const heroBox = (r: Rect): CSSProperties =>
  ({ '--l': r.left, '--t': r.top, '--w': r.width, '--h': r.height }) as CSSProperties;

/** Slot-area coordinates → percentages of the 336 × 201 art box. */
const pct = (r: Rect): CSSProperties => ({
  left: `${(r.left / SLOT_AREA.width) * 100}%`,
  top: `${(r.top / SLOT_AREA.height) * 100}%`,
  width: `${(r.width / SLOT_AREA.width) * 100}%`,
  height: `${(r.height / SLOT_AREA.height) * 100}%`,
});

const cardAssets = (card: number) => FLIGHT_ASSETS.filter((a) => a.card === card).sort((a, b) => a.z - b.z);

function ContactShadow({ asset }: { asset: FlightAsset }) {
  const s = asset.shadow;
  return (
    <span className="problem-card__shadow" style={pct(s.box)} data-flight-shadow aria-hidden="true">
      {s.kind === 'svg' ? (
        <span
          className="problem-card__shadow-svg"
          style={{ width: `${(s.inner.width / s.box.width) * 100}%`, height: `${(s.inner.height / s.box.height) * 100}%`, rotate: `${s.rotate}deg` }}
        >
          {/* Figma exports the blurred rect with its filter bleed: inset −51.27% −50.93% −51.44% −51.3%. */}
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
 * Hero + "You're not the only one", wrapped in one flight zone so the six 3D
 * assets can travel from the hero into the three problem cards on a shared
 * coordinate system (see motion/useHeroFlight.ts).
 *
 * Static markup = the Figma composition: every asset is rendered in its hero
 * slot AND its card slot. Flight mode hides both static sets and shows the
 * single moving instance per asset, so only one copy is ever visible.
 */
export function HeroFlight() {
  const zoneRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  useHeroFlight(zoneRef);
  useHeroArcs(heroRef);
  // Section head only: the cards carry the flight's measured anchors and never move.
  useReveal(zoneRef, { targets: '.problems__head > *' });

  // First-load entrance: heading, paragraph, reassurance, CTA in order. Only the
  // copy moves (the flight owns the assets), and only when motion is allowed.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(contentRef.current!.children, {
          autoAlpha: 0,
          y: MOTION.distance.reveal,
          duration: MOTION.duration.revealSlow,
          stagger: MOTION.stagger.list,
          delay: 0.1,
          clearProps: 'transform,visibility,opacity',
        });
      });
      return () => mm.revert();
    },
    { scope: contentRef },
  );

  return (
    <div className="flight-zone" ref={zoneRef}>
      {/* ------------------------------------------------ 02 — HERO */}
      <section className="hero" id={SECTIONS.top} aria-labelledby="hero-title" ref={heroRef}>
        <div className="hero__stage">
          <div className="hero__card" aria-hidden="true" />

          {/* Two dotted rings (one asset, Figma 627:775, made seamless by
              scripts/derive-hero-arcs.mjs): round the left and right icon groups
              on desktop, across the top and bottom groups on phones. Above the
              card, beneath the icons and the copy; clipped to the hero. The outer
              span holds the fixed tilt/mirror, the data-hero-arc wrapper is the
              only thing that turns (motion/useHeroArcs.ts). */}
          <div className="hero__rings" aria-hidden="true">
            <span className="hero__ring hero__ring--a">
              <span className="hero__ring-spin" data-hero-arc>
                <img src={heroRing} alt="" />
              </span>
            </span>
            <span className="hero__ring hero__ring--b">
              <span className="hero__ring-spin" data-hero-arc>
                <img src={heroRing} alt="" />
              </span>
            </span>
          </div>

          {FLIGHT_ASSETS.map((a) => (
            <span key={a.id} className="hero__slot" data-asset={a.id} data-flight-from={a.id} style={heroBox(a.hero)}>
              <img className="flight-static" src={a.src} alt="" />
            </span>
          ))}

          <div className="hero__content" ref={contentRef}>
            <h1 className="hero__title" id="hero-title">
              See your parent's bills in one place
            </h1>
            <p className="hero__lead">
              Kinage brings bills and connected account activity into a shared view. It flags unusual activity so you, your
              family, and trusted advisors can decide what needs attention.
            </p>
            <p className="hero__lead hero__lead--strong">See what’s happening before something goes wrong.</p>
            {/* The entrance tween moves this wrapper only: the button's own transform
                (press scale, with its CSS transition) never competes with it. The
                advisors path is the outlined partner of the filled CTA, same size
                (stacked on phones, still in the hero). */}
            <div className="hero__cta-wrap">
              <EarlyAccessButton className="btn btn--primary hero__cta">Get early access</EarlyAccessButton>
              <SmartLink to="forAdvisors" className="btn btn--outline hero__advisors">
                Kinage for advisors
              </SmartLink>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ 03 — THREE PROBLEMS */}
      <section className="problems" id={SECTIONS.problems} aria-labelledby="problems-title">
        <div className="container problems__inner">
          <header className="section-head problems__head">
            <p className="eyebrow">Sound familiar</p>
            <h2 className="section-title section-title--lg" id="problems-title">
              Right now, it's hard to <span className="accent">see the whole picture</span>
            </h2>
            <p className="section-lead">
              You're probably managing your parent's finances in your head, across your email, and in three different browsers.
            </p>
          </header>

          <ul className="problems__grid" data-flight-row>
            {PROBLEMS.map((p, i) => (
              <li className="problem-card" key={p.title}>
                {/* Paint order by DOM order only (no z-index here): contact shadows first,
                    then slots back-to-front. Keeping this free of stacking contexts lets the
                    flight layer (z 2) sit above the art and below the card copy (z 3). */}
                <div className="problem-card__art" aria-hidden="true">
                  {cardAssets(i).map((a) => (
                    <ContactShadow key={`${a.id}-shadow`} asset={a} />
                  ))}
                  {cardAssets(i).map((a) => (
                    <span key={a.id} className="problem-card__slot" style={pct(a.slot)} data-flight-to={a.id}>
                      <img className="flight-static" src={a.src} alt="" style={{ opacity: a.slotOpacity }} />
                    </span>
                  ))}
                </div>
                <h3 className="problem-card__title">{p.title}</h3>
                <p className="problem-card__body">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* One moving instance per asset, in two decorative layers inside the zone's
          stacking context: back (z 2, beneath all copy) and front (z 4, above the
          z 3 copy). Neither is focusable or clickable. */}
      {(['back', 'front'] as const).map((layer) => (
        <div key={layer} className={`flight-layer flight-layer--${layer}`} aria-hidden="true">
          {FLIGHT_ASSETS.filter((a) => (a.layer ?? 'back') === layer).map((a) => (
            <img key={a.id} className="flight-asset" data-flight-asset={a.id} src={a.src} alt="" style={{ zIndex: a.z }} />
          ))}
        </div>
      ))}
    </div>
  );
}
