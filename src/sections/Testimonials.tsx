import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { INITIAL_TESTIMONIAL, TESTIMONIALS } from '../content/testimonials';
import { SECTIONS } from '../content/links';
import { MOTION } from '../motion/tokens';
import { usePrefersReducedMotion } from '../motion/usePrefersReducedMotion';
import { useReveal } from '../motion/useReveal';
import quoteMark from '../assets/figma/quote-large.svg';
import './Testimonials.css';

const COUNT = TESTIMONIALS.length;
const wrap = (i: number) => ((i % COUNT) + COUNT) % COUNT;

/** Signed distance from the active slide on a ring: −1 left, 0 centre, +1 right. */
const offsetOf = (i: number, active: number) => {
  let d = wrap(i - active);
  if (d > COUNT / 2) d -= COUNT;
  return d;
};

/**
 * 07 — WHAT FAMILIES ARE SAYING (Figma 583:941). Centre card active,
 * neighbours on either side in the Figma side-card layout (smaller, lighter
 * type). The stage height is set by an invisible sizer holding every quote in
 * the active layout, so the section never changes height while cards change
 * role; the cards themselves only move, scale and ease their metrics (CSS).
 *
 * Autoplay (every 4 s, token) runs continuously; it pauses while the pointer is
 * over the carousel or focus is inside it, when off screen or in a background
 * tab, and never runs under prefers-reduced-motion. A manual change (arrow,
 * key, swipe, side-card click) restarts the countdown instead of stopping
 * autoplay — there is deliberately no visible pause button (refinement brief).
 * Keyboard: ←/→ on the carousel. Touch: swipe. Focus is never moved.
 */
export function Testimonials() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(INITIAL_TESTIMONIAL);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const sizerRef = useRef<HTMLDivElement>(null);
  useReveal(sectionRef);

  // One base height per role: the tallest quote in that layout (sizer copies).
  useLayoutEffect(() => {
    const sizer = sizerRef.current;
    const stage = sizer?.parentElement;
    if (!sizer || !stage) return;
    const measure = () => {
      const tallest = (role: string) =>
        Math.max(0, ...Array.from(sizer.querySelectorAll<HTMLElement>(`[data-sizer="${role}"]`), (e) => e.offsetHeight));
      stage.style.setProperty('--card-min-active', `${tallest('active')}px`);
      stage.style.setProperty('--card-min-side', `${tallest('side')}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(sizer);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);
  const pointer = useRef<{ x: number; y: number; id: number } | null>(null);
  /** A swipe ends with a click on the card under the pointer — ignore that one. */
  const swiped = useRef(false);

  const autoplay = !reduced && !hovered && !focused && visible;

  const go = useCallback((delta: number) => setActive((a) => wrap(a + delta)), []);
  // The interval effect depends on `active`, so any change restarts the countdown.
  const manual = (delta: number) => go(delta);

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') go(1);
    }, MOTION.carousel.interval);
    return () => window.clearInterval(id);
  }, [autoplay, go, active]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      manual(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      manual(-1);
    }
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    swiped.current = false;
    pointer.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };
  const onPointerUp = (e: PointerEvent) => {
    const start = pointer.current;
    pointer.current = null;
    if (!start || start.id !== e.pointerId) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      swiped.current = true;
      manual(dx < 0 ? 1 : -1);
    }
  };

  return (
    <section className="testimonials" id={SECTIONS.testimonials} aria-labelledby="testimonials-title" ref={sectionRef}>
      <div className="container testimonials__inner">
        <header className="section-head testimonials__head" data-reveal>
          <p className="eyebrow">What families are saying</p>
          <h2 className="section-title" id="testimonials-title">
            What families are <span className="accent">already seeing</span>
          </h2>
        </header>

        <div
          ref={rootRef}
          className="carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label="What families are saying"
          style={
            {
              '--side-scale': MOTION.carousel.sideScale,
              '--active-scale': MOTION.carousel.activeScale,
              '--slide-ms': `${MOTION.duration.carousel * 1000}ms`,
            } as CSSProperties
          }
          onKeyDown={onKeyDown}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setFocused(true)}
          onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setFocused(false)}
        >
          <button type="button" className="carousel__arrow carousel__arrow--prev" onClick={() => manual(-1)} aria-label="Previous testimonial">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 7l-5 5 5 5" />
            </svg>
          </button>

          <div
            className="carousel__stage"
            aria-live={autoplay ? 'off' : 'polite'}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (pointer.current = null)}
          >
            {/* Invisible copies in the active layout: they alone set the stage height. */}
            <div className="carousel__sizer" aria-hidden="true" ref={sizerRef}>
              {(['0', '1'] as const).flatMap((role) =>
                TESTIMONIALS.map((t) => (
                <div className="quote-card" data-offset={role} data-sizer={role === '0' ? 'active' : 'side'} key={`${role}-${t.id}`}>
                  <span className="quote-card__mark" />
                  <div className="quote-card__copy">
                    <p className="quote-card__text">{t.quote}</p>
                    <p className="quote-card__who">
                      {t.name}, {t.role}
                      {t.kind === 'demo' && <span className="quote-card__demo"> · Demo quote</span>}
                    </p>
                  </div>
                </div>
                )),
              )}
            </div>
            {TESTIMONIALS.map((t, i) => {
              const offset = offsetOf(i, active);
              return (
                <figure
                  key={t.id}
                  className="quote-card"
                  data-offset={offset}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${COUNT}`}
                  aria-hidden={offset !== 0}
                  onClick={() => {
                    if (swiped.current) {
                      swiped.current = false;
                      return;
                    }
                    if (offset !== 0) manual(offset);
                  }}
                >
                  <img className="quote-card__mark" src={quoteMark} alt="" width={53} height={41} />
                  <div className="quote-card__copy">
                    <blockquote className="quote-card__text">
                      <p>{t.quote}</p>
                    </blockquote>
                    <figcaption className="quote-card__who">
                      {t.name}, {t.role}
                      {t.kind === 'demo' && <span className="quote-card__demo"> · Demo quote</span>}
                    </figcaption>
                  </div>
                </figure>
              );
            })}
          </div>

          <button type="button" className="carousel__arrow carousel__arrow--next" onClick={() => manual(1)} aria-label="Next testimonial">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 7l5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
