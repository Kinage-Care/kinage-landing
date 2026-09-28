/**
 * Motion tokens for JS, read from the same design-system/tokens.json that
 * generates tokens.css — so CSS transitions and GSAP timelines cannot drift.
 */
import tokens from '../../design-system/tokens.json';

const m = tokens.motion;

/** "600ms" → 0.6 (GSAP works in seconds). */
const seconds = (v: string) => parseFloat(v) / (v.endsWith('ms') ? 1000 : 1);
const px = (v: string) => parseFloat(v);
/** "cubic-bezier(a, b, c, d)" → "a,b,c,d" for CustomEase. */
const bezier = (v: string) => v.replace(/^cubic-bezier\(|\)$/g, '').replace(/\s+/g, '');

export const MOTION = {
  duration: {
    instant: seconds(m.duration.instant.$value),
    hover: seconds(m.duration.hover.$value),
    accordion: seconds(m.duration.accordion.$value),
    reveal: seconds(m.duration.reveal.$value),
    revealSlow: seconds(m.duration['reveal-slow'].$value),
    carousel: seconds(m.duration.carousel.$value),
  },
  bezier: {
    out: bezier(m.ease.out.$value),
    inOut: bezier(m.ease['in-out'].$value),
    exit: bezier(m.ease.exit.$value),
  },
  distance: {
    reveal: px(m.distance.reveal.$value),
    revealMobile: px(m.distance['reveal-mobile'].$value),
  },
  stagger: {
    list: seconds(m.stagger.list.$value),
    steps: seconds(m.stagger.steps.$value),
  },
  trigger: {
    revealStart: m.trigger['reveal-start'].$value,
    demoStart: m.trigger['demo-start'].$value,
  },
  flight: {
    scrub: m.flight.scrub.$value,
    end: m.flight.end.$value,
    spread: m.flight.spread.$value,
    shadowIn: m.flight['shadow-in'].$value,
    minWidth: m.flight['min-width'].$value,
  },
  nav: {
    idle: m.nav.idle.$value,
    hide: seconds(m.nav.hide.$value),
    show: seconds(m.nav.show.$value),
    distance: px(m.nav.distance.$value),
  },
  carousel: {
    interval: m.carousel.interval.$value,
    sideScale: m.carousel['side-scale'].$value,
    activeScale: m.carousel['active-scale'].$value,
  },
  arcs: {
    period: m.arcs.period.$value,
    ramp: m.arcs.ramp.$value,
  },
  smooth: {
    lerp: m.smooth.lerp.$value,
    minWidth: m.smooth['min-width'].$value,
  },
} as const;

/** Media conditions shared by every gsap.matchMedia() on the page. */
export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
  mobile: '(max-width: 767px)',
  tabletUp: `(min-width: ${MOTION.flight.minWidth}px)`,
} as const;
