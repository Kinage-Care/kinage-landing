import { useRef } from 'react';
import { EarlyAccessButton } from '../components/EarlyAccess';
import { PersonCaption } from '../components/PersonCaption';
import { BEN_PORTRAIT } from '../content/media';
import { OUR_STORY } from '../content/our-story';
import { useReveal } from '../motion/useReveal';
import './OurStory.css';

/**
 * /our-story — Ben's story in the landing's language. The home hero's wash
 * and texture (.hero-wash) sit at the top of the page; the whole story is one
 * white card in front of it, like the home hero card, in two columns: Ben's
 * photo with its caption (the home Ben section's) on the left, the text
 * (intro, then the chapters in order) on the right; stacked on phones, photo
 * first. Content: src/content/our-story.ts; only chapters with approved copy
 * are rendered. The text comes first in the reading order.
 */
export function OurStory() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  const chapters = OUR_STORY.chapters.filter((c) => c.copy?.length);

  return (
    <article className="story" ref={ref} aria-labelledby="story-title">
      <div className="story__top">
        <span className="story__wash hero-wash" aria-hidden="true">
          <span className="hero-wash__texture" />
        </span>
        <div className="story__card">
          <div className="story__text">
            <header className="story__head">
              <h1 className="story__title" id="story-title" data-reveal>
                Why I built this
              </h1>
              {OUR_STORY.intro.map((p) => (
                <p className="story__intro" key={p.slice(0, 24)} data-reveal>
                  {p}
                </p>
              ))}
            </header>

            {chapters.map((c) => (
              <section className="story__chapter" key={c.id} aria-labelledby={`story-${c.id}`} data-reveal>
                <h2 className="story__chapter-title" id={`story-${c.id}`}>
                  {c.title}
                </h2>
                <p className="story__kicker">{c.kicker}</p>
                {c.copy!.map((p) => (
                  <p className="story__body" key={p.slice(0, 24)}>
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <figure className="story__portrait" data-reveal>
            <img
              className="story__photo"
              src={BEN_PORTRAIT.src}
              srcSet={BEN_PORTRAIT.srcSet}
              sizes="(max-width: 767px) 240px, 370px"
              alt="Ben Terk, founder of Kinage"
              width={BEN_PORTRAIT.width}
              height={BEN_PORTRAIT.height}
              decoding="async"
            />
            <PersonCaption className="story__signature" name={OUR_STORY.signature.name} role={OUR_STORY.signature.role} />
          </figure>
        </div>
      </div>

      <section className="story__close" aria-labelledby="story-close-title">
        <div className="story__column story__column--center">
          <h2 className="story__close-title" id="story-close-title" data-reveal>
            {OUR_STORY.closing}
          </h2>
          <div data-reveal>
            <EarlyAccessButton className="btn btn--primary story__cta" />
          </div>
        </div>
      </section>
    </article>
  );
}
