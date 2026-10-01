import { useRef } from 'react';
import { BENEFITS } from '../content/landing';
import { SECTIONS } from '../content/links';
import { gsap, ScrollTrigger, useGSAP } from '../motion/gsap';
import { MOTION, MQ } from '../motion/tokens';
import { useReveal } from '../motion/useReveal';
import './Benefits.css';

/**
 * 06 — THREE BENEFITS: brand 3D icons from example/3d img.
 *
 * Entrance: the heading uses the shared reveal. Each card then rises and
 * fades in, and its icon follows as a separate step (motion tokens
 * stagger.icon-delay / duration.icon-reveal / distance.icon-reveal), so the
 * icon visibly arrives after its card. Card and icon have separate owners —
 * the card tween moves the <li>, the icon tween moves the <img> inside a
 * fixed-size wrapper that reserves its space. Desktop: one trigger for the
 * row, cards staggered by stagger.cards. Phones: each card plays when it
 * enters the viewport. Plays once. Reduced motion, or no JS: final state.
 */
export function Benefits() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, { targets: '[data-reveal]' });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: MQ.motion, mobile: MQ.mobile }, (ctx) => {
        const { motion, mobile } = ctx.conditions as { motion: boolean; mobile: boolean };
        if (!motion || !ref.current) return;
        const cards = gsap.utils.toArray<HTMLElement>('.benefit', ref.current);
        if (!cards.length) return;
        const rise = mobile ? MOTION.distance.revealMobile : MOTION.distance.reveal;

        cards.forEach((card) => {
          gsap.set(card, { autoAlpha: 0, y: rise });
          gsap.set(card.querySelector('.benefit__icon'), { autoAlpha: 0, y: MOTION.distance.iconReveal });
        });

        const play = (card: HTMLElement, delay: number) =>
          gsap
            .timeline({ delay, defaults: { ease: 'kinage.out' } })
            .to(card, { autoAlpha: 1, y: 0, duration: MOTION.duration.reveal, clearProps: 'transform,visibility,opacity' })
            .to(
              card.querySelector('.benefit__icon'),
              { autoAlpha: 1, y: 0, duration: MOTION.duration.iconReveal, clearProps: 'transform,visibility,opacity' },
              MOTION.stagger.iconDelay,
            );

        if (mobile) {
          cards.forEach((card) =>
            ScrollTrigger.create({ trigger: card, start: MOTION.trigger.revealStart, once: true, onEnter: () => play(card, 0) }),
          );
        } else {
          ScrollTrigger.create({
            trigger: ref.current.querySelector('.benefits__grid'),
            start: MOTION.trigger.revealStart,
            once: true,
            onEnter: () => cards.forEach((card, i) => play(card, i * MOTION.stagger.cards)),
          });
        }
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section className="benefits" id={SECTIONS.benefits} aria-labelledby="benefits-title" ref={ref}>
      <div className="container benefits__inner">
        <header className="section-head" data-reveal>
          <p className="eyebrow">What you get</p>
          <h2 className="section-title" id="benefits-title">
            One clear view. <span className="accent">Three ways to support your family</span>
          </h2>
        </header>
        <ul className="benefits__grid">
          {BENEFITS.map((b) => (
            <li className="benefit" key={b.title}>
              <span className="benefit__art">
                <img className="benefit__icon" src={b.image} alt="" width={128} height={128} loading="lazy" />
              </span>
              <h3 className="benefit__title">{b.title}</h3>
              <p className="benefit__body">{b.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
