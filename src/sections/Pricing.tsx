import { useRef } from 'react';
import { EarlyAccessButton } from '../components/EarlyAccess';
import { SECTIONS } from '../content/links';
import { gsap, useGSAP } from '../motion/gsap';
import { MOTION, MQ } from '../motion/tokens';
import pricingTexture from '../assets/figma/pricing-texture.png';
import household from '../assets/3d/household.webp';
import arrowRight from '../assets/figma/arrow-right-long.svg';
import './Pricing.css';

/**
 * 09 — PRICING banner (Figma 583:960).
 *
 * Banner in normal flow; copy column on the left (36px heading, 300-weight
 * copy, outlined CTA). The household illustration is absolutely placed in the
 * 1200px inner with that inner's own Figma coordinates: (776.49, 0),
 * 423.5 × 282.3 — the art keeps its transparent padding, so the visible card
 * sits inside the band. 768–1199px: the same anchor scales with the inner
 * width (container units); under 768px it stacks below the CTA.
 */
export function Pricing() {
  const ref = useRef<HTMLElement>(null);

  // Light entrance for the household card; it settles exactly on its anchor.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from('.pricing__household', {
          autoAlpha: 0,
          y: MOTION.distance.reveal,
          duration: MOTION.duration.revealSlow,
          clearProps: 'transform,visibility,opacity',
          scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section className="pricing on-brand" id={SECTIONS.pricing} aria-labelledby="pricing-title" ref={ref}>
      <div className="pricing__decor" aria-hidden="true">
        <span className="pricing__glow">
          <span />
        </span>
        <img className="pricing__texture" src={pricingTexture} alt="" />
      </div>

      <div className="container pricing__inner">
        <div className="pricing__copy">
          <h2 className="pricing__title" id="pricing-title">
            Plans starting at $19.99/month
          </h2>
          <p className="pricing__body">
            A monthly subscription for families. Your plan depends on how many family members and trusted
            advisors you involve.
          </p>
          {/* Opens the shared contact dialog in its plans-inquiry mode. */}
          <EarlyAccessButton mode="plans" className="btn btn--ghost-light pricing__cta">
            Ask about plans
            <img src={arrowRight} alt="" width={26} height={12} />
          </EarlyAccessButton>
        </div>
        <img
          className="pricing__household"
          src={household}
          alt="Kinage household card showing three connected family members with a check mark"
          width={424}
          height={282}
          loading="lazy"
        />
      </div>
    </section>
  );
}
