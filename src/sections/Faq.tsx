import { useId, useRef, useState } from 'react';
import { FAQ } from '../content/faq';
import { SECTIONS } from '../content/links';
import { useReveal } from '../motion/useReveal';
import './Faq.css';

/**
 * 13 — FAQ. Heading has no trailing period ("Common questions").
 * All closed on load (as designed); one item open at a time.
 * Height animates with a CSS grid-rows transition; collapsed panels are
 * `inert` so their content leaves the tab order and the accessibility tree.
 */
export function Faq() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const [open, setOpen] = useState<string | null>(null);
  const baseId = useId();

  return (
    <section className="faq" id={SECTIONS.faq} aria-labelledby="faq-title" ref={ref}>
      <div className="container faq__inner">
        <header className="section-head" data-reveal>
          <p className="eyebrow">FAQ</p>
          <h2 className="section-title" id="faq-title">
            Common <span className="accent">questions</span>
          </h2>
        </header>

        <div className="faq__list" data-reveal>
          {FAQ.map((item) => {
            const isOpen = open === item.id;
            const btnId = `${baseId}-${item.id}-q`;
            const panelId = `${baseId}-${item.id}-a`;
            return (
              <div className="faq__item" key={item.id} data-open={isOpen || undefined} data-status={item.status}>
                <h3 className="faq__q">
                  <button
                    id={btnId}
                    type="button"
                    className="faq__button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : item.id)}
                  >
                    <span className="faq__question">{item.question}</span>
                    <span className="faq__toggle" aria-hidden="true">
                      <svg viewBox="0 0 14 14">
                        <path d="M2.5 7h9" />
                        <path className="faq__toggle-v" d="M7 2.5v9" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <div className="faq__panel" id={panelId} role="region" aria-labelledby={btnId} inert={!isOpen}>
                  <div className="faq__panel-inner">
                    {/* Draft status stays in content/faq.ts only — never rendered. */}
                    <p className="faq__answer">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
