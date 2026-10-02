import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import household from '../../../assets/3d/household-paper.webp';
import household340 from '../../../assets/3d/household-paper-340.webp';
import household680 from '../../../assets/3d/household-paper-680.webp';
import { Avatar } from '../../../components/product/ProductBadge';
import { HOW } from '../../../content/home';
import { useSequence } from '../useSequence';

/** 0 the household settles · 1 people appear · 2 the dashed links appear and keep flowing. */
const TIMES = [0, 350, 1050] as const;

type Link = { id: string; d: string };

/**
 * Step 4 — the household at the centre: the V1 landing's paper-style
 * "Kinage / Your household" card (three connected people and a check, the
 * decision), copied from Kinage-Care/kinage-landing, with Ben, Sarah and
 * Martha around it and a dashed line from each to the household, its dashes
 * flowing slowly towards the household while the step is on screen (static
 * dashes under reduced motion). The lines are measured from the rendered
 * cards and image, so they stay attached at every size.
 */
export function DecideSlide({ active, reduced }: { active: boolean; reduced: boolean }) {
  const phase = useSequence(active, TIMES, reduced);
  const h = HOW.household;
  const mapRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [links, setLinks] = useState<Link[]>([]);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const map = mapRef.current;
    const art = artRef.current;
    if (!map || !art) return;
    const measure = () => {
      // Layout boxes (offset*), so transforms from the entrance never skew the lines.
      const rel = (el: HTMLElement) => {
        let x = 0;
        let y = 0;
        for (let n: HTMLElement | null = el; n && n !== map; n = n.offsetParent as HTMLElement | null) {
          x += n.offsetLeft;
          y += n.offsetTop;
        }
        return { x, y, w: el.offsetWidth, h: el.offsetHeight };
      };
      const a = rel(art);
      const cx = a.x + a.w / 2;
      const next = h.members.flatMap((m) => {
        const el = cardRefs.current[m.id];
        if (!el) return [];
        const c = rel(el);
        const fromTop = c.y + c.h <= a.y + a.h * 0.3; // card above the household
        // From the card edge that faces the household to a point on the card art (inset from its edge).
        const sx = c.x + c.w / 2;
        const sy = fromTop ? c.y + c.h : c.y;
        const ex = cx + (sx - cx) * 0.42;
        const ey = fromTop ? a.y + a.h * 0.2 : a.y + a.h * 0.86;
        const my = (sy + ey) / 2;
        return [{ id: m.id, d: `M${sx.toFixed(1)} ${sy.toFixed(1)} C ${sx.toFixed(1)} ${my.toFixed(1)}, ${ex.toFixed(1)} ${my.toFixed(1)}, ${ex.toFixed(1)} ${ey.toFixed(1)}` }];
      });
      setLinks(next);
      setBox({ w: map.offsetWidth, h: map.offsetHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(map);
    return () => ro.disconnect();
  }, [h.members]);

  const card = (m: (typeof h.members)[number], i: number, place: string) => (
    <li
      className="hh2__member"
      data-place={place}
      key={m.id}
      ref={(el) => {
        cardRefs.current[m.id] = el;
      }}
      style={{ '--i': i } as CSSProperties}
    >
      <Avatar initials={m.initials} tone={m.tone as 'eggplant'} size={34} />
      <span>
        <strong>{m.name}</strong>
        <small>{m.role}</small>
      </span>
    </li>
  );

  return (
    <div className="hh2 p-ui" data-phase={phase}>
      <div className="hh2__head">
        <p className="hh2__title">{h.name}</p>
        <span className="hh2__count">{h.members.length} members</span>
      </div>
      <div className="hh2__map" ref={mapRef}>
        <svg className="hh2__links" width={box.w} height={box.h} viewBox={`0 0 ${box.w || 1} ${box.h || 1}`} aria-hidden="true">
          {links.map((l) => (
            <path key={l.id} d={l.d} />
          ))}
        </svg>
        <ul className="hh2__members">
          {card(h.members[0], 0, 'top-left')}
          {card(h.members[1], 1, 'top-right')}
          {card(h.members[2], 2, 'bottom')}
        </ul>
        <div className="hh2__art" ref={artRef}>
          <img
            src={household}
            srcSet={`${household340} 340w, ${household680} 680w, ${household} 1040w`}
            sizes="(max-width: 767px) 230px, 330px"
            alt=""
            width={1040}
            height={648}
          />
        </div>
      </div>
    </div>
  );
}
