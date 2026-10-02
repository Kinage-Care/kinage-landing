import { useRef } from 'react';
import canSee from '../assets/images/trust-can-see.webp';
import cantDo from '../assets/images/trust-cant-do.webp';
import parentDecides from '../assets/images/trust-parent-decides.webp';
import { TRUST } from '../content/home';
import { SECTIONS } from '../content/links';
import { useReveal } from '../motion/useReveal';
import './Trust.css';

/**
 * 6 — Security and control, on the cream band. Three white cards, each with
 * its paper-style icon (the client's set: an eye, a "no" sign, the family):
 * what Kinage can see, what it can't do, what the parent decides. Only points
 * confirmed in several sources (read-only via Plaid, no money movement, no
 * bank passwords or SSN, cannot see cash or calls, disconnect any time).
 */
const ICONS: Record<string, string> = { eye: canSee, ban: cantDo, users: parentDecides };
export function Trust() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, { targets: '[data-reveal], .trust__card' });

  return (
    <section className="section section--warm trust" id={SECTIONS.security} aria-labelledby="trust-title" ref={ref}>
      <div className="container">
        <header className="section-head" data-reveal>
          <h2 className="section-title" id="trust-title">
            {TRUST.title}
          </h2>
          <p className="section-lead">{TRUST.lead}</p>
        </header>

        <ul className="trust__grid">
          {TRUST.columns.map((col) => (
            <li className="trust__card surface-card" key={col.title} data-kind={col.icon}>
              <img className="trust__icon" src={ICONS[col.icon]} alt="" width={64} height={64} loading="lazy" decoding="async" />
              <h3 className="trust__title">{col.title}</h3>
              <ul className="trust__points">
                {col.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
