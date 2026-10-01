import { useEffect, useRef, type ReactElement } from 'react';
import { EarlyAccessButton } from '../components/EarlyAccess';
import { ADVISORS_PAGE as A, type AdvisorCard } from '../content/advisors';
import { LINKS } from '../content/links';
import { useReveal } from '../motion/useReveal';
import './Advisors.css';

/** Lucide-style glyphs for the setup points (same shapes as the source list). */
const ICONS: Record<(typeof A.setup.points)[number]['icon'], ReactElement> = {
  lock: (
    <>
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  ban: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M4.9 4.9l14.2 14.2" />
    </>
  ),
  power: (
    <>
      <path d="M18.4 5.6a9 9 0 1 1-12.8 0" />
      <path d="M12 2v10" />
    </>
  ),
};

function Cards({ cards }: { cards: AdvisorCard[] }) {
  return (
    <ul className="adv__cards">
      {cards.map((c) => (
        <li className="adv__card surface-card" key={c.title}>
          <h3 className="adv__card-title">{c.title}</h3>
          <p className="adv__card-body">{c.body}</p>
        </li>
      ))}
    </ul>
  );
}

/**
 * /advisors — the advisor page, native to this site (content: content/advisors.ts,
 * from the source file's #/advisors route). White and cream bands, one
 * eggplant band for the setup, the shared surface card, section rhythm,
 * calm one-shot reveals. "Partner with Kinage" opens the contact dialog in
 * partnership mode.
 */
export function AdvisorsPage() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, { targets: '[data-reveal], .adv__card' });

  useEffect(() => {
    const previous = document.title;
    document.title = 'For advisors — Kinage';
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <article className="adv" ref={ref} aria-labelledby="adv-title">
      <header className="adv__hero">
        <div className="container adv__center">
          <p className="eyebrow" data-reveal>
            {A.hero.eyebrow}
          </p>
          <h1 className="adv__title" id="adv-title" data-reveal>
            {A.hero.title.plain} <span className="accent">{A.hero.title.accent}</span>
          </h1>
          <p className="adv__lede adv__lede--intro" data-reveal>
            {A.hero.lede}
          </p>
          <div className="adv__actions" data-reveal>
            <EarlyAccessButton mode="partner" className="btn btn--primary adv__cta">
              {LINKS.partner.label}
            </EarlyAccessButton>
            <a className="btn btn--outline adv__cta" href="#adv-setup">
              {A.hero.secondary}
            </a>
          </div>
        </div>
      </header>

      <section className="adv__band adv__band--warm" aria-labelledby="adv-problem">
        <div className="container adv__narrow">
          <p className="eyebrow" data-reveal>
            {A.problem.eyebrow}
          </p>
          <h2 className="section-title adv__h2" id="adv-problem" data-reveal>
            {A.problem.title}
          </h2>
          <p className="adv__lede adv__lede--left" data-reveal>
            {A.problem.lede}
          </p>
        </div>
      </section>

      <section className="adv__band" aria-labelledby="adv-benefits">
        <div className="container">
          <header className="section-head" data-reveal>
            <p className="eyebrow">{A.benefits.eyebrow}</p>
            <h2 className="section-title" id="adv-benefits">
              {A.benefits.title}
            </h2>
          </header>
          <Cards cards={A.benefits.cards} />
        </div>
      </section>

      <section className="adv__band adv__band--brand on-brand" id="adv-setup" aria-labelledby="adv-setup-title">
        <div className="container adv__split">
          <div className="adv__split-copy">
            <p className="eyebrow adv__eyebrow-on-brand" data-reveal>
              {A.setup.eyebrow}
            </p>
            <h2 className="section-title adv__h2 adv__h2--on-brand" id="adv-setup-title" data-reveal>
              {A.setup.title}
            </h2>
            <p className="adv__lede adv__lede--left adv__lede--on-brand" data-reveal>
              {A.setup.lede}
            </p>
          </div>
          <ul className="adv__points">
            {A.setup.points.map((p) => (
              <li className="adv__point" key={p.icon} data-reveal>
                <span className="adv__point-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">{ICONS[p.icon]}</svg>
                </span>
                <span>{p.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="adv__band" aria-labelledby="adv-practice">
        <div className="container">
          <header className="section-head" data-reveal>
            <p className="eyebrow">{A.practice.eyebrow}</p>
            <h2 className="section-title" id="adv-practice">
              {A.practice.title}
            </h2>
          </header>
          <Cards cards={A.practice.cards} />
        </div>
      </section>

      <section className="adv__band adv__band--warm" aria-labelledby="adv-close">
        <div className="container adv__center">
          <h2 className="section-title" id="adv-close" data-reveal>
            {A.close.title}
          </h2>
          <p className="adv__lede" data-reveal>
            {A.close.lede}
          </p>
          <div className="adv__actions" data-reveal>
            <EarlyAccessButton mode="partner" className="btn btn--primary adv__cta">
              {LINKS.partner.label}
            </EarlyAccessButton>
          </div>
        </div>
      </section>
    </article>
  );
}
