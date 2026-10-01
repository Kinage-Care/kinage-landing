import { useRef } from 'react';
import { SmartLink } from '../components/SmartLink';
import { SECTIONS } from '../content/links';
import { useReveal } from '../motion/useReveal';
import benTerk from '../assets/images/ben-terk.webp';
import './Founder.css';

/** 12 — FOUNDER: Ben's photo (local composite from example/Ben img) + story. */
export function Founder() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section className="founder stack-section" id={SECTIONS.story} aria-labelledby="founder-title" ref={ref}>
      <div className="container founder__inner">
        {/* Label aligned to the copy column (photo 219.8 + gap 40), not the section centre. */}
        <div className="founder__label" data-reveal>
          <p className="eyebrow">The story behind Kinage</p>
        </div>
        <div className="founder__row">
          <div className="founder__photo" data-reveal>
            <img src={benTerk} alt="Ben Terk, founder of Kinage" width={254} height={313} />
          </div>
          <div className="founder__copy" data-reveal>
            <h2 className="founder__title" id="founder-title">
              Why I built this
            </h2>
            <p className="founder__story">
              I built Kinage because my family lived this problem firsthand. When we needed to coordinate my mother’s finances,
              nothing available truly helped. Kinage is the product I wish we’d had.
            </p>
            <p className="founder__byline byline">
              <span className="byline__name">Ben Terk</span>
              <span className="byline__role">Founder of Kinage</span>
            </p>
            <SmartLink to="story" className="btn btn--outline founder__cta" />
          </div>
        </div>
      </div>
    </section>
  );
}
