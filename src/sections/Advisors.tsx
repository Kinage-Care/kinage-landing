import { useRef } from 'react';
import { EarlyAccessButton } from '../components/EarlyAccess';
import { SmartLink } from '../components/SmartLink';
import { LINKS, SECTIONS } from '../content/links';
import { useReveal } from '../motion/useReveal';
import './Advisors.css';

/** 09 — FOR ADVISORS: cream panel inside a white band. Partner → contact dialog (partnership mode); Learn more → /advisors. */
export function Advisors() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section className="advisors stack-section" id={SECTIONS.advisors} aria-labelledby="advisors-title" ref={ref}>
      <div className="container advisors__panel">
        <p className="eyebrow" data-reveal>
          For trusted advisors
        </p>
        <h2 className="section-title" id="advisors-title" data-reveal>
          Built for the professionals <span className="accent">families trust</span>
        </h2>
        <p className="advisors__lead" data-reveal>
          Give your clients' families the visibility they need, without adding to your workload.
        </p>
        <div className="advisors__cta" data-reveal>
          <EarlyAccessButton mode="partner" className="btn btn--primary advisors__btn">
            {LINKS.partner.label}
          </EarlyAccessButton>
          <SmartLink to="advisorsInfo" className="btn btn--outline advisors__more" />
        </div>
      </div>
    </section>
  );
}
