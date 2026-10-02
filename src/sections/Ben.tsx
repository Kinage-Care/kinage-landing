import { useRef } from 'react';
import { Icon } from '../components/Icon';
import { PersonCaption } from '../components/PersonCaption';
import { SmartLink } from '../components/SmartLink';
import { BEN } from '../content/home';
import { BEN_PORTRAIT } from '../content/media';
import { LINKS, SECTIONS } from '../content/links';
import { useReveal } from '../motion/useReveal';
import './Ben.css';

/**
 * 7 — Ben. His own words from the Q&A script (Q1), shortened, in a white
 * card with his photo; the full story is on /our-story. His name and role
 * are the photo's caption; on two columns the button's bottom lines up with
 * the bottom of the photo's purple frame, and the caption hangs below that
 * line (Ben.css).
 */
export function Ben() {
  const ref = useRef<HTMLElement>(null);
  // Photo with its caption, then the copy in reading order: title, quote, button.
  useReveal(ref, { targets: '.ben__photo, .ben__copy > *' });

  return (
    <section className="section ben" id={SECTIONS.story} aria-labelledby="ben-title" ref={ref}>
      <div className="container">
        <div className="ben__card">
          <figure className="ben__photo">
            <img
              src={BEN_PORTRAIT.src}
              srcSet={BEN_PORTRAIT.srcSet}
              sizes="(max-width: 767px) 240px, 340px"
              alt="Ben Terk"
              width={BEN_PORTRAIT.width}
              height={BEN_PORTRAIT.height}
              loading="lazy"
              decoding="async"
            />
            <PersonCaption className="ben__sign" name={BEN.name} role={BEN.role} />
          </figure>
          <div className="ben__copy">
            <h2 className="section-title ben__title" id="ben-title">
              {BEN.title}
            </h2>
            <blockquote className="ben__quote">
              {BEN.quote.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </blockquote>
            {/* The entrance moves this wrapper; the button keeps its own press transform. */}
            <div className="ben__action">
              <SmartLink to="story" className="btn btn--ghost ben__link">
                {LINKS.story.label}
                <Icon name="arrowRight" size={18} strokeWidth={2} className="btn__icon ben__arrow" />
              </SmartLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
