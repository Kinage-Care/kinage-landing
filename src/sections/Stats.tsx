import { useRef } from 'react';
import { STATS } from '../content/landing';
import { SECTIONS } from '../content/links';
import { useReveal } from '../motion/useReveal';
import './Stats.css';

/** 11 — YOU'RE NOT ALONE. Figures and sources verbatim from Figma; no counters. */
export function Stats() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, { targets: '[data-reveal], .stat' });

  return (
    <section className="stats" id={SECTIONS.stats} aria-labelledby="stats-title" ref={ref}>
      <div className="container stats__inner">
        <header className="section-head" data-reveal>
          <p className="eyebrow">You're not alone</p>
          <h2 className="section-title" id="stats-title">
            The need is <span className="accent">clearer than ever</span>
          </h2>
          <p className="section-lead">
            Millions of families are managing an older adult's finances without a real system. Nobody has to do this alone. Research
            links isolation with scam risk in older adults, so staying connected is a form of protection too.
          </p>
        </header>
        <ul className="stats__grid">
          {STATS.map((s) => (
            <li className="stat surface-card" key={s.value}>
              <p className="stat__value">{s.value}</p>
              <p className="stat__label">{s.label}</p>
            </li>
          ))}
        </ul>
        <p className="stats__note" data-reveal>
          FBI IC3 figures are reported cases only. Broader estimates put true losses in the tens of billions each year.
        </p>
        <p className="stats__quote" data-reveal>"Father time remains undefeated. We will all need help at some point."</p>
      </div>
    </section>
  );
}
