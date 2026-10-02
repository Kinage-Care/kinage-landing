import { useRef } from 'react';
import { Brand } from '../components/Brand';
import { Icon } from '../components/Icon';
import { COMPARE } from '../content/home';
import { SECTIONS } from '../content/links';
import { useReveal } from '../motion/useReveal';
import './Compare.css';

/**
 * 5 — Why Kinage. Three white cards side by side — spreadsheet, bank bill
 * pay or budgeting app, Kinage — read row by row. Wording avoids absolutes
 * ("usually", "often"); the Kinage card carries the highlight shadow.
 */
export function Compare() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, { targets: '[data-reveal], .compare__card', stagger: 0.12 });

  return (
    <section className="section compare" id={SECTIONS.compare} aria-labelledby="compare-title" ref={ref}>
      <div className="container">
        <header className="section-head" data-reveal>
          <h2 className="section-title" id="compare-title">
            {COMPARE.title}
          </h2>
          <p className="section-lead">{COMPARE.lead}</p>
        </header>

        <div className="compare__grid">
          {COMPARE.columns.map((col) => (
            <div className="compare__card" key={col.name} data-kinage={col.kinage || undefined}>
              <h3 className="compare__name">
                {col.kinage ? (
                  <>
                    {/* The same lockup as the navigation bar; the heading keeps its text name. */}
                    <Brand className="compare__logo" />
                    <span className="sr-only">{col.name}</span>
                  </>
                ) : (
                  col.name
                )}
              </h3>
              <dl className="compare__cells">
                {col.cells.map((cell, i) => (
                  <div className="compare__cell" key={COMPARE.rows[i]}>
                    <dt>
                      <span className="compare__mark" aria-hidden="true">
                        <Icon name={col.kinage ? 'check' : 'minus'} size={13} strokeWidth={2.4} />
                      </span>
                      {COMPARE.rows[i]}
                    </dt>
                    <dd>{cell}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
