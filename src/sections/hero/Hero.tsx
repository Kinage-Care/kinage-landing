import { useRef, type CSSProperties } from 'react';
import { EarlyAccessButton } from '../../components/EarlyAccess';
import { SmartLink } from '../../components/SmartLink';
import { HERO } from '../../content/home';
import { FLIGHT_ASSETS, FLIGHT_SIZES, type Rect } from '../../content/flight';
import { LINKS, SECTIONS } from '../../content/links';
import { gsap, useGSAP } from '../../motion/gsap';
import { MOTION, MQ } from '../../motion/tokens';
import { useHeroArcs } from '../../motion/useHeroArcs';
import heroRing from '../../assets/figma/hero-ring.svg';
import { HeroVideo } from './HeroVideo';
import './Hero.css';

/** Hero-card coordinates → CSS custom properties consumed with the --u unit. */
const heroBox = (r: Rect): CSSProperties => ({ '--l': r.left, '--t': r.top, '--w': r.width, '--h': r.height }) as CSSProperties;

/**
 * 1 — Hero, in the V1 landing's layout (Kinage-Care/kinage-landing,
 * HeroFlight): a centred white card on the hero wash, the six paper-style
 * objects around it (the flight's start anchors, see HeroFlight.tsx) and two
 * slowly turning dotted rings masked by the card. Copy and actions are this
 * page's; under them, the video block (Figma 706:2809) opens the explainer in
 * a dialog.
 *
 * Entrance and idle motion are V1's: the copy rises in order on first load,
 * the rings turn (paused off screen and under reduced motion).
 */
export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useHeroArcs(heroRef);

  // First-load entrance: heading, paragraph, actions, video block in order. Only the
  // copy moves (the flight owns the objects), and only when motion is allowed.
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
    <section className="hero hero-wash" id={SECTIONS.top} aria-labelledby="hero-title" ref={heroRef}>
      <span className="hero-wash__texture" aria-hidden="true" />
      <div className="hero__stage">
        <div className="hero__card" aria-hidden="true" />

        {/* Two dotted rings (V1's seamless asset): round the left and right object
            groups on desktop, across the top and bottom groups on phones. Above the
            card, beneath the objects and the copy; clipped by the card. The outer span
            holds the fixed tilt/mirror, [data-hero-arc] is the only part that turns. */}
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
          <span key={a.id} className="hero__slot" data-asset={a.id} data-flight-from={a.id} style={heroBox(a.hero)} aria-hidden="true">
            <img className="flight-static" src={a.src} srcSet={a.srcSet} sizes={FLIGHT_SIZES} alt="" />
          </span>
        ))}

        <div className="hero__content" ref={contentRef}>
          <h1 className="hero__title" id="hero-title">
            {HERO.title}
          </h1>
          <p className="hero__lead">{HERO.lead}</p>
          <div className="hero__actions">
            <EarlyAccessButton className="btn btn--primary hero__btn" />
            <SmartLink to="advisorsInfo" className="btn btn--ghost hero__btn">
              {LINKS.advisorsInfo.label}
            </SmartLink>
          </div>
          <HeroVideo />
        </div>
      </div>
    </section>
  );
}
