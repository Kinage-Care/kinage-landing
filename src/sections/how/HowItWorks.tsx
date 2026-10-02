import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { HOW } from '../../content/home';
import { SECTIONS } from '../../content/links';
import { gsap } from '../../motion/gsap';
import { usePrefersReducedMotion } from '../../motion/usePrefersReducedMotion';
import { useReveal } from '../../motion/useReveal';
import { BillsSlide } from './slides/BillsSlide';
import { ConnectSlide } from './slides/ConnectSlide';
import { DecideSlide } from './slides/DecideSlide';
import { FlagSlide } from './slides/FlagSlide';
import './HowItWorks.css';
import './slides/slides.css';

const HOVER_INTENT_MS = 160;
/** Arc between neighbouring positions: angle (deg) on a circle of radius R (× stage width). */
const ARC_DEG = 16;
const ARC_RADIUS = 1.35;
const TRANSITION_S = 0.56;

const SLIDES = [ConnectSlide, BillsSlide, FlagSlide, DecideSlide];

/**
 * 3 — How it works: four steps and one presentation stage, driven by one
 * shared `active` index, so the highlighted step and its visual can never
 * disagree.
 *
 * - Autoplay 1 → 2 → 3 → 4 → 1, each step for its own scene length (7–8 s
 *   for the animated scenes, 5 s for the list). While a step is active its
 *   visual loops (end state held 4 s, then replayed; useSequence), also on
 *   hover when autoplay is paused. It starts at step 1 when the
 *   section first comes into view, and runs only while the section is on
 *   screen, the tab is visible, nobody is hovering or focused inside the
 *   steps or stage, and motion is allowed. Any pause restarts a full
 *   interval afterwards.
 * - A step is selected by hover (after a short intent delay), click, tap, or
 *   the keyboard (tabs: arrows, Home, End).
 * - Visuals move between positions on an arc — the outgoing one travels a
 *   little along it and fades, the incoming one settles into place along the
 *   same path. Surfaces stay upright; only their position moves. A new
 *   selection interrupts the running move from where it is (no queue).
 * - Reduced motion: no autoplay, no movement; manual switching only.
 *
 * The section's entrance reveal is separate (useReveal on the heading, tabs
 * and stage as groups) and never replays when the step changes.
 */
export function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hoverTimer = useRef<number | undefined>(undefined);
  const baseId = useId();
  useReveal(ref, { targets: '[data-reveal]' });

  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [run, setRun] = useState(0);

  const autoplay = !reduced && inView && !hovering && !focusInside && !pageHidden;

  // In view: the first entry starts the walkthrough at step 1.
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    let entered = false;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting && !entered) {
          entered = true;
          setActive(0);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    const onVisibility = () => setPageHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // One timer for the whole walkthrough; every change of step or of the
  // pause conditions starts a fresh, full interval.
  useEffect(() => {
    if (!autoplay) return;
    setRun((r) => r + 1);
    // Each step holds for its own sequence plus a reading pause (content: HOW.steps[].ms).
    const t = window.setTimeout(() => setActive((a) => (a + 1) % SLIDES.length), HOW.steps[active].ms);
    return () => window.clearTimeout(t);
  }, [autoplay, active]);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  // Arc transition between the outgoing and incoming visuals.
  const prevRef = useRef<number | null>(null);
  const angles = useRef<number[]>(SLIDES.map(() => 0));
  const tweens = useRef<gsap.core.Tween[]>([]);
  useLayoutEffect(() => {
    const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
    const stage = stageRef.current;
    if (slides.length !== SLIDES.length || !stage) return;
    const prev = prevRef.current;
    prevRef.current = active;
    const radius = stage.offsetWidth * ARC_RADIUS;
    const place = (i: number, deg: number) => {
      angles.current[i] = deg;
      const rad = (deg * Math.PI) / 180;
      gsap.set(slides[i], {
        x: radius * Math.sin(rad),
        y: radius * (1 - Math.cos(rad)),
        scale: 1 - (Math.abs(deg) / ARC_DEG) * 0.05,
      });
    };

    // Interrupt whatever is moving: the new move starts from where things are.
    tweens.current.forEach((t) => t.kill());
    tweens.current = [];
    gsap.killTweensOf(slides);

    if (prev === null || prev === active || reduced) {
      slides.forEach((el, i) => {
        place(i, 0);
        gsap.set(el, { autoAlpha: i === active ? 1 : 0 });
      });
      return;
    }

    const forward = (active - prev + SLIDES.length) % SLIDES.length <= SLIDES.length / 2;
    const dir = forward ? 1 : -1;
    slides.forEach((el, i) => {
      if (i === active || i === prev) return;
      place(i, 0);
      gsap.set(el, { autoAlpha: 0 });
    });

    const outgoing = { deg: angles.current[prev] };
    // An incoming visual that was still on its way out returns along its own path.
    const startDeg = angles.current[active] !== 0 ? angles.current[active] : dir * ARC_DEG;
    const incoming = { deg: startDeg };
    place(active, startDeg);
    tweens.current.push(
      gsap.to(outgoing, {
        deg: -dir * ARC_DEG,
        duration: TRANSITION_S,
        ease: 'kinage.inOut',
        onUpdate: () => place(prev, outgoing.deg),
      }),
      gsap.to(slides[prev], { autoAlpha: 0, duration: TRANSITION_S * 0.7, ease: 'kinage.exit' }),
      gsap.to(incoming, {
        deg: 0,
        duration: TRANSITION_S,
        ease: 'kinage.out',
        delay: 0.06,
        onUpdate: () => place(active, incoming.deg),
      }),
      gsap.to(slides[active], { autoAlpha: 1, duration: TRANSITION_S, ease: 'kinage.out', delay: 0.06 }),
    );
  }, [active, reduced]);

  useEffect(
    () => () => {
      tweens.current.forEach((t) => t.kill());
      gsap.killTweensOf(slideRefs.current.filter(Boolean));
    },
    [],
  );

  const select = useCallback((i: number) => setActive(i), []);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = SLIDES.length;
    const to =
      e.key === 'ArrowDown' || e.key === 'ArrowRight'
        ? (i + 1) % n
        : e.key === 'ArrowUp' || e.key === 'ArrowLeft'
          ? (i - 1 + n) % n
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? n - 1
              : null;
    if (to === null) return;
    e.preventDefault();
    select(to);
    tabRefs.current[to]?.focus();
  };

  const onTabPointerEnter = (e: PointerEvent, i: number) => {
    if (e.pointerType !== 'mouse') return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => select(i), HOVER_INTENT_MS);
  };
  const onTabPointerLeave = () => window.clearTimeout(hoverTimer.current);

  const step = HOW.steps[active];

  return (
    <section className="section section--warm how" id={SECTIONS.howItWorks} aria-labelledby="how-title" ref={ref}>
      <div className="container">
        <header className="section-head" data-reveal>
          <h2 className="section-title" id="how-title">
            {HOW.title}
          </h2>
          <p className="section-lead">{HOW.lead}</p>
        </header>

        <div
          className="how__area"
          ref={areaRef}
          data-live={(inView && !pageHidden) || undefined}
          onPointerEnter={(e) => e.pointerType === 'mouse' && setHovering(true)}
          onPointerLeave={(e) => e.pointerType === 'mouse' && setHovering(false)}
          onFocus={() => setFocusInside(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusInside(false);
          }}
        >
          <div className="how__tabs" role="tablist" aria-label="How Kinage works, step by step" aria-orientation="vertical" data-reveal>
            {HOW.steps.map((s, i) => {
              const selected = i === active;
              return (
                <button
                  key={s.title}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${i}`}
                  className="how__tab"
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  aria-labelledby={`${baseId}-title-${i}`}
                  aria-describedby={`${baseId}-body-${i}`}
                  tabIndex={selected ? 0 : -1}
                  data-active={selected || undefined}
                  onClick={() => select(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  onPointerEnter={(e) => onTabPointerEnter(e, i)}
                  onPointerLeave={onTabPointerLeave}
                >
                  <span className="how__num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="how__tab-text">
                    <span className="how__tab-title" id={`${baseId}-title-${i}`}>
                      <span className="how__tab-long">{s.title}</span>
                      <span className="how__tab-short" aria-hidden="true">
                        {s.short}
                      </span>
                    </span>
                    <span className="how__tab-body" id={`${baseId}-body-${i}`}>
                      {s.body}
                    </span>
                  </span>
                  {selected && autoplay && (
                    <span className="how__progress" key={run} style={{ animationDuration: `${s.ms}ms` }} aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Phones and tablets: the selected step's text, right above its visual. */}
          <div className="how__current" aria-hidden="true">
            <p className="how__current-title">{step.title}</p>
            <p className="how__current-body">{step.body}</p>
          </div>

          <div
            className="how__stage"
            ref={stageRef}
            role="tabpanel"
            id={`${baseId}-panel`}
            aria-labelledby={`${baseId}-tab-${active}`}
            tabIndex={0}
            data-reveal
          >
            <p className="sr-only">{step.caption}</p>
            {SLIDES.map((Slide, i) => (
              <div
                key={i}
                className="how__slide"
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                aria-hidden="true"
                data-active={i === active || undefined}
              >
                <Slide active={i === active} reduced={reduced} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
