import { useEffect, useRef } from 'react';
import { EarlyAccessButton } from '../components/EarlyAccess';
import { OUR_STORY } from '../content/our-story';
import { useReveal } from '../motion/useReveal';
import benTerk from '../assets/images/ben-terk.webp';
import './OurStory.css';

/**
 * /our-story — Ben's story in the landing's language (Museo Sans, cream and
 * white surfaces, section rhythm). Content: src/content/our-story.ts; only
 * chapters with approved copy are rendered. Ben's photo closes the story.
 */
export function OurStory() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  useEffect(() => {
    const previous = document.title;
    document.title = 'Our story — Kinage';
    return () => {
      document.title = previous;
    };
  }, []);

  const chapters = OUR_STORY.chapters.filter((c) => c.copy?.length);

  return (
    <article className="story" ref={ref} aria-labelledby="story-title">
      <header className="story__head">
        <div className="story__column">
          <p className="eyebrow" data-reveal>
            {OUR_STORY.eyebrow}
          </p>
          <h1 className="story__title" id="story-title" data-reveal>
            Why I <span className="accent">built this</span>
          </h1>
          {OUR_STORY.intro.map((p) => (
            <p className="story__intro" key={p.slice(0, 24)} data-reveal>
              {p}
            </p>
          ))}
        </div>
      </header>

      <div className="story__chapters">
        <div className="story__column">
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

          <figure className="story__portrait" data-reveal>
            <span className="story__photo">
              <img src={benTerk} alt="Ben Terk, founder of Kinage" width={254} height={313} loading="lazy" />
            </span>
            <figcaption className="story__signature">
              <span className="story__signature-name">{OUR_STORY.signature.name}</span>
              <span className="story__signature-role">{OUR_STORY.signature.role}</span>
            </figcaption>
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
