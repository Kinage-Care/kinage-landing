import { useRef } from 'react';
import { TRUST_CHIPS, TRUST_COLUMNS } from '../content/landing';
import { SECTIONS } from '../content/links';
import { useReveal } from '../motion/useReveal';
import './Trust.css';

/** 08 — TRUST: chips, three columns of cards (as designed), reframe line. */
export function Trust() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, { targets: '[data-reveal], .trust-card', stagger: 0.09 });

  return (
    <section className="trust" id={SECTIONS.trust} aria-labelledby="trust-title" ref={ref}>
      <div className="container trust__inner">
        <div className="trust__top">
          <header className="section-head" data-reveal>
            <p className="eyebrow">Trust and safety</p>
            <h2 className="section-title" id="trust-title">
              See exactly what Kinage <span className="accent">can and cannot do</span>
            </h2>
            <p className="section-lead">Specific answers, not vague reassurance.</p>
          </header>
          <ul className="trust__chips" aria-label="At a glance" data-reveal>
            {TRUST_CHIPS.map((c) => (
              <li className="trust__chip" key={c}>
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="trust__cards">
          {TRUST_COLUMNS.map((col, i) => (
            <ul className="trust__col" key={i}>
              {col.map((card) => (
                <li className={`trust-card surface-card${card.fixed ? ' trust-card--fixed' : ''}`} key={card.title}>
                  <span className="trust-card__icon" aria-hidden="true">
                    <img src={card.icon} alt="" width={28} height={28} />
                  </span>
                  <div className="trust-card__copy">
                    <h3 className="trust-card__title">{card.title}</h3>
                    <p className="trust-card__body">{card.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          ))}
        </div>

        <p className="trust__reframe">You're never giving anyone access to your money. Think of it like a safe family window, not a door.</p>
      </div>
    </section>
  );
}
