import { useRef } from 'react';
import { EarlyAccessButton } from '../components/EarlyAccess';
import { SmartLink } from '../components/SmartLink';
import { SECTIONS } from '../content/links';
import { useReveal } from '../motion/useReveal';
import ctaTexture from '../assets/figma/cta-texture.png';
import './FinalCta.css';

/** 14 — FINAL CTA: eggplant band with two soft ellipses and the luminosity texture. */
export function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, { stagger: 0.08 });

  return (
    <section className="final-cta on-brand" id={SECTIONS.getStarted} aria-labelledby="final-cta-title" ref={ref}>
      <div className="final-cta__decor" aria-hidden="true">
        <span className="final-cta__ellipse final-cta__ellipse--a">
          <span />
        </span>
        <img className="final-cta__texture" src={ctaTexture} alt="" />
        <span className="final-cta__ellipse final-cta__ellipse--b">
          <span />
        </span>
      </div>
      <div className="final-cta__inner">
        <p className="final-cta__eyebrow" data-reveal>
          Get started today
        </p>
        <h2 className="final-cta__title" id="final-cta-title" data-reveal>
          See what’s happening. <span className="final-cta__hl">Before it matters</span>
        </h2>
        <p className="final-cta__body" data-reveal>
          No more spreadsheets. No more group texts. No more wondering if Dad paid the electric bill.{' '}
          <strong className="final-cta__line">Connection is protection.</strong>
        </p>
        <div className="final-cta__row" data-reveal>
          <EarlyAccessButton className="btn btn--light final-cta__primary" />
          <SmartLink to="howItWorks" className="btn btn--ghost-light">
            See How It Works
          </SmartLink>
        </div>
      </div>
    </section>
  );
}
