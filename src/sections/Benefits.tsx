import { useRef } from 'react';
import { BENEFITS } from '../content/landing';
import { SECTIONS } from '../content/links';
import { useReveal } from '../motion/useReveal';
import './Benefits.css';

/** 06 — THREE BENEFITS: brand 3D icons from example/3d img. */
export function Benefits() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, { targets: '[data-reveal], .benefit' });

  return (
    <section className="benefits" id={SECTIONS.benefits} aria-labelledby="benefits-title" ref={ref}>
      <div className="container benefits__inner">
        <header className="section-head" data-reveal>
          <p className="eyebrow">What you get</p>
          <h2 className="section-title" id="benefits-title">
            One tool. <span className="accent">Three reasons to have peace of mind</span>
          </h2>
        </header>
        <ul className="benefits__grid">
          {BENEFITS.map((b) => (
            <li className="benefit" key={b.title}>
              <img className="benefit__icon" src={b.image} alt="" width={128} height={128} loading="lazy" />
              <h3 className="benefit__title">{b.title}</h3>
              <p className="benefit__body">{b.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
