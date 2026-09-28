import { Children, useLayoutEffect, useRef, type ReactNode } from 'react';
import { ScrollTrigger } from '../motion/gsap';
import './StackGroup.css';

/** Desktop width from which `equalize` applies (the stack-section rule in base.css). */
const EQUALIZE_FROM = '(min-width: 1200px)';

/**
 * Sticky card stack: each child section sticks, and the next one rises from
 * below and covers it. Only the children of one StackGroup overlap; the last
 * child is not sticky, so the flow returns to normal right after it.
 *
 * Each layer sticks at `top = min(0, viewportHeight − layerHeight)`: a short
 * section sticks at the top edge; a section taller than the viewport scrolls
 * fully into view first and sticks with its bottom on the viewport's bottom —
 * never cropped, no extra scroll distance added.
 *
 * `equalize={n}`: on desktop the first n layers get the same total height —
 * the natural height of the tallest one, set as a minimum (`--stack-equal-h`),
 * re-measured whenever their content, the viewport or the fonts change. Pure
 * CSS can't do this across sticky layers: in a grid, a sticky item would be
 * confined to its own row.
 *
 * Sticky is disabled (plain flow) under 768px and under prefers-reduced-motion, in CSS.
 */
export function StackGroup({ children, label, equalize = 0 }: { children: ReactNode; label?: string; equalize?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const layers = Array.from(root.children) as HTMLElement[];
    const equal = layers.slice(0, equalize);
    const desktop = window.matchMedia(EQUALIZE_FROM);

    let lastEqual = '';
    let raf = 0;
    // Everything below the stack moved: let scroll-driven animations re-measure (once per frame).
    const remeasure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    const equalizeHeights = () => {
      if (!equal.length) return;
      if (!desktop.matches) {
        equal.forEach((l) => l.style.removeProperty('--stack-equal-h'));
        if (lastEqual) remeasure();
        lastEqual = '';
        return;
      }
      // Natural heights first (one synchronous layout), then the shared minimum.
      equal.forEach((l) => l.style.removeProperty('--stack-equal-h'));
      const h = `${Math.ceil(Math.max(...equal.map((l) => l.offsetHeight)))}px`;
      equal.forEach((l) => l.style.setProperty('--stack-equal-h', h));
      if (h !== lastEqual) remeasure();
      lastEqual = h;
    };
    const stick = () => {
      const vh = window.innerHeight;
      for (const layer of layers) {
        layer.style.setProperty('--stick-top', `${Math.min(0, vh - layer.offsetHeight)}px`);
      }
    };
    const update = () => {
      equalizeHeights();
      stick();
    };

    update();
    // Content of the equalised sections (not the sections themselves, whose
    // min-height we set) drives re-measuring; layer sizes drive the sticky offsets.
    const contentRo = new ResizeObserver(() => update());
    equal.forEach((l) => {
      const inner = l.firstElementChild?.firstElementChild;
      if (inner) contentRo.observe(inner);
    });
    const layerRo = new ResizeObserver(stick);
    layers.forEach((l) => layerRo.observe(l));
    window.addEventListener('resize', update);
    desktop.addEventListener('change', update);
    document.fonts?.ready.then(update);
    return () => {
      cancelAnimationFrame(raf);
      contentRo.disconnect();
      layerRo.disconnect();
      window.removeEventListener('resize', update);
      desktop.removeEventListener('change', update);
      if (lastEqual) equal.forEach((l) => l.style.removeProperty('--stack-equal-h'));
    };
  }, [equalize]);

  return (
    <div className="stack" ref={ref} aria-label={label}>
      {Children.map(children, (child, i) => (
        <div className="stack__layer" style={{ zIndex: i + 1 }}>
          {child}
        </div>
      ))}
    </div>
  );
}
