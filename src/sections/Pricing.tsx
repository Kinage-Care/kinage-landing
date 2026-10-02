import { useRef } from 'react';
import { EarlyAccessButton } from '../components/EarlyAccess';
import { Icon } from '../components/Icon';
import { PRICING } from '../content/pricing';
import { SECTIONS } from '../content/links';
import { useReveal } from '../motion/useReveal';
import './Pricing.css';

/**
 * Pricing — the current landing's pricing banner, rebuilt on this page's
 * tokens: one wide eggplant panel (the final banner's shared .brand-panel:
 * same surface, glow and texture) with the price on the left and the plan
 * points and "Ask about plans" (white button, contact dialog, plans mode) on
 * the right. The household
 * illustration moved to the walkthrough (step 4), so the panel is two text
 * columns. The amount is a local placeholder (content/pricing.ts).
 */
export function Pricing() {
  const ref = useRef<HTMLElement>(null);
  // Panel, then the price block, then the plan: one batch, 120ms apart.
  useReveal(ref, { targets: '[data-reveal]', stagger: 0.12 });

  return (
    <section className="section pricing" id={SECTIONS.pricing} aria-labelledby="pricing-title" ref={ref}>
      <div className="container">
        <div className="pricing__panel brand-panel on-brand" data-reveal>
          <span className="brand-panel__glow" aria-hidden="true" />
          <span className="brand-panel__texture" aria-hidden="true" />
          <div className="pricing__price" data-reveal>
            <h2 className="pricing__title" id="pricing-title">
              {PRICING.title}
            </h2>
            <p className="pricing__label">{PRICING.priceLabel}</p>
            <p className="pricing__amount">
              <strong>{PRICING.price}</strong>
              <span>{PRICING.period}</span>
            </p>
          </div>
          <div className="pricing__plan" data-reveal>
            <p className="pricing__lead">{PRICING.lead}</p>
            <ul className="pricing__points">
              {PRICING.points.map((p) => (
                <li key={p}>
                  <span className="pricing__check" aria-hidden="true">
                    <Icon name="check" size={14} strokeWidth={2.4} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <EarlyAccessButton mode="plans" className="btn btn--light pricing__cta">
              {PRICING.cta}
              <Icon name="arrowRight" size={18} strokeWidth={2} />
            </EarlyAccessButton>
          </div>
        </div>
      </div>
    </section>
  );
}
