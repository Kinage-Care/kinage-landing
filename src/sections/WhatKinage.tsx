import { useRef } from 'react';
import { PhoneDemo } from '../components/PhoneDemo';
import { SmartLink } from '../components/SmartLink';
import { SECTIONS } from '../content/links';
import { useReveal } from '../motion/useReveal';
import './WhatKinage.css';

/** 05 — WHAT KINAGE IS (Figma 596:1985): copy left, the animated Kinage phone on its lavender panel right. */
export function WhatKinage() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, { targets: '.what__copy [data-reveal]' });

  return (
    <section className="what" id={SECTIONS.forFamilies} aria-labelledby="what-title" ref={ref}>
      <div className="container what__inner">
        <div className="what__copy">
          <div className="what__text">
            <p className="eyebrow" data-reveal>
              Family financial oversight
            </p>
            <h2 className="section-title what__title" id="what-title" data-reveal>
              <span className="what__title-line">Managing a parent's finances is overwhelming.</span>{' '}
              <span className="what__title-line accent">It shouldn't be guesswork</span>
            </h2>
            <p className="what__body" data-reveal>
              Kinage automatically finds your parent's bills, flags anything suspicious, and keeps your family and advisors on the
              same page. Your parent controls who sees what.
            </p>
          </div>
          {/* The reveal moves this wrapper; the button keeps its own press transform. */}
          <div data-reveal>
            <SmartLink to="howItWorks" className="btn btn--primary">
              See how it works
            </SmartLink>
          </div>
        </div>
        <div className="what__demo">
          <PhoneDemo />
        </div>
      </div>
    </section>
  );
}
