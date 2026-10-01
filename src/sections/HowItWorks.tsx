import { useRef } from 'react';
import { VideoPlayer } from '../components/VideoPlayer';
import { STEPS } from '../content/landing';
import { SECTIONS } from '../content/links';
import { withBase } from '../lib/base';
import { gsap, ScrollTrigger, useGSAP } from '../motion/gsap';
import { MOTION, MQ } from '../motion/tokens';
import { useReveal } from '../motion/useReveal';
import './HowItWorks.css';

/**
 * 07 — HOW IT WORKS. Normal flow (not part of the stack).
 * Heading + video reveal gently; the roadmap then reveals 1 → 2 → 3 → 4 with
 * each connector line drawing toward the next step.
 */
export function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, { targets: '.how__intro [data-reveal]', duration: MOTION.duration.revealSlow });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: MQ.motion, mobile: MQ.mobile }, (ctx) => {
        const { motion, mobile } = ctx.conditions as { motion: boolean; mobile: boolean };
        if (!motion || !ref.current) return;
        const steps = gsap.utils.toArray<HTMLElement>('.step', ref.current);
        const lines = gsap.utils.toArray<HTMLElement>('.step__line', ref.current);
        gsap.set(steps, { autoAlpha: 0, y: mobile ? MOTION.distance.revealMobile : MOTION.distance.reveal });
        gsap.set(lines, { scaleX: 0 });
        const tl = gsap.timeline({ paused: true });
        steps.forEach((step, i) => {
          const at = i * MOTION.stagger.steps;
          tl.to(step, { autoAlpha: 1, y: 0, duration: MOTION.duration.reveal, clearProps: 'transform,visibility,opacity' }, at);
          const line = step.querySelector('.step__line');
          if (line) tl.to(line, { scaleX: 1, duration: MOTION.duration.reveal, ease: 'kinage.inOut' }, at + 0.12);
        });
        ScrollTrigger.create({
          trigger: ref.current.querySelector('.steps'),
          start: MOTION.trigger.revealStart,
          once: true,
          onEnter: () => tl.play(),
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section className="how" id={SECTIONS.howItWorks} aria-labelledby="how-title" ref={ref}>
      <div className="container how__inner">
        <div className="how__intro">
          <header className="section-head" data-reveal>
            <p className="eyebrow">How it works</p>
            <h2 className="section-title" id="how-title">
              A clear view <span className="accent">in a few steps</span>
            </h2>
            <p className="section-lead">Connect your parent’s email and bank account, with their consent.</p>
          </header>
          <div data-reveal>
            <VideoPlayer
              src={withBase('/media/kinage-explainer.mp4')}
              poster={withBase('/media/kinage-explainer-poster.jpg')}
              captions={{ src: withBase('/media/kinage-explainer.en.vtt'), srclang: 'en', label: 'English' }}
              title="A one-minute video on how Kinage works and why your accounts stay safe"
            />
          </div>
        </div>

        <ol className="steps">
          {STEPS.map((s, i) => (
            <li className="step" key={s.title}>
              <div className="step__num-row">
                <span className={`step__circle step__circle--${s.tone}`} aria-hidden="true">
                  {i + 1}
                </span>
                {i < STEPS.length - 1 && <span className="step__line" aria-hidden="true" />}
              </div>
              <div className="step__copy">
                <h3 className="step__title">
                  <span className="sr-only">Step {i + 1}: </span>
                  {s.title}
                </h3>
                <p className="step__body">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
