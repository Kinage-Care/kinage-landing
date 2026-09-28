import type { RefObject } from 'react';
import { FLIGHT_ASSETS } from '../content/landing';
import { gsap, ScrollTrigger, useGSAP } from './gsap';
import { MOTION, MQ } from './tokens';

type Geo = { fx: number; fy: number; fw: number; fh: number; tx: number; ty: number; scale: number };

/**
 * Hero → problem-card shared-element transition.
 *
 * One <img> per asset lives in an absolutely positioned layer covering the
 * hero and the problems section. Its start and end are *measured* from empty
 * anchor boxes placed exactly where Figma puts the asset (hero slot) and where
 * it lands (card slot), in the zone's own coordinate system — nothing is
 * hard-coded per viewport. The element is sized to the hero box; the landing
 * is a uniform scale (hero and slot boxes share the PNG's aspect ratio, so the
 * transparent padding scales with the art).
 *
 * The timeline is scrubbed by native scroll: stop scrolling and it stops,
 * scroll up and it reverses continuously. No pinning, no scroll hijack.
 * Paths bend (vertical first, horizontal later) so assets drop past the hero
 * copy and the section header instead of cutting across them; the flight
 * layer also sits beneath all copy (z-index), so an asset can never cover text.
 */
export function useHeroFlight(zoneRef: RefObject<HTMLDivElement | null>) {
  useGSAP(
    () => {
      const zone = zoneRef.current;
      if (!zone) return;
      const mm = gsap.matchMedia();

      // ------------------------------------------------ tablet & desktop, motion allowed
      mm.add(`${MQ.tabletUp} and ${MQ.motion}`, () => {
        const row = zone.querySelector<HTMLElement>('[data-flight-row]');
        if (!row) return;

        const items = FLIGHT_ASSETS.map((asset) => ({
          asset,
          el: zone.querySelector<HTMLImageElement>(`[data-flight-asset="${asset.id}"]`)!,
          from: zone.querySelector<HTMLElement>(`[data-flight-from="${asset.id}"]`)!,
          to: zone.querySelector<HTMLElement>(`[data-flight-to="${asset.id}"]`)!,
          geo: { fx: 0, fy: 0, fw: 1, fh: 1, tx: 0, ty: 0, scale: 1 } as Geo,
        }));
        if (items.some((i) => !i.el || !i.from || !i.to)) return;

        const measure = () => {
          const z = zone.getBoundingClientRect();
          for (const it of items) {
            const f = it.from.getBoundingClientRect();
            const t = it.to.getBoundingClientRect();
            it.geo = {
              fx: f.left - z.left,
              fy: f.top - z.top,
              fw: f.width,
              fh: f.height,
              tx: t.left - z.left,
              ty: t.top - z.top,
              scale: f.width > 0 ? t.width / f.width : 1,
            };
            gsap.set(it.el, { width: f.width, height: f.height });
          }
        };

        zone.classList.add('is-flying');
        measure();
        ScrollTrigger.addEventListener('refreshInit', measure);

        const { spread, shadowIn } = MOTION.flight;
        const n = items.length;
        const span = 1 - spread; // each asset's share of the timeline
        // Launch order: far-travelling assets first so the group reads as one gesture.
        const order: Record<string, number> = { scam: 0, gmail: 1, bill: 2, doc: 3, sms: 4, chart: 5 };

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            id: 'hero-flight',
            trigger: zone,
            start: 'top top',
            endTrigger: row,
            end: MOTION.flight.end,
            scrub: MOTION.flight.scrub,
            invalidateOnRefresh: true,
          },
        });

        for (const it of items) {
          const s = (spread * order[it.asset.id]) / (n - 1);
          const g = () => it.geo;
          tl.fromTo(it.el, { y: () => g().fy }, { y: () => g().ty, duration: span, ease: 'power1.inOut' }, s);
          tl.fromTo(it.el, { x: () => g().fx }, { x: () => g().tx, duration: span * 0.62, ease: 'power1.inOut' }, s + span * 0.38);
          tl.fromTo(it.el, { scale: 1 }, { scale: () => g().scale, duration: span, ease: 'power1.inOut' }, s);
          if (it.asset.slotOpacity < 1) {
            tl.fromTo(it.el, { opacity: 1 }, { opacity: it.asset.slotOpacity, duration: span * 0.4 }, s + span * 0.6);
          }
        }

        const shadows = zone.querySelectorAll('[data-flight-shadow]');
        tl.fromTo(shadows, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 - shadowIn }, shadowIn);

        // Recalculate once fonts and every participating image have settled —
        // both change the anchors' positions.
        let raf = 0;
        const refresh = () => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => ScrollTrigger.refresh());
        };
        const imgs = Array.from(zone.querySelectorAll('img'));
        Promise.all([document.fonts?.ready, ...imgs.map((img) => img.decode().catch(() => undefined))]).then(refresh);
        const ro = new ResizeObserver(refresh);
        ro.observe(zone);

        return () => {
          ro.disconnect();
          cancelAnimationFrame(raf);
          ScrollTrigger.removeEventListener('refreshInit', measure);
          zone.classList.remove('is-flying');
        };
      });

      // ------------------------------------------------ mobile, motion allowed
      // Simplified: each card's assets appear in sequence as the card arrives.
      mm.add(`${MQ.mobile} and ${MQ.motion}`, () => {
        zone.querySelectorAll<HTMLElement>('.problem-card__art').forEach((art) => {
          const parts = art.querySelectorAll('.problem-card__slot img, .problem-card__shadow');
          gsap.from(parts, {
            autoAlpha: 0,
            y: MOTION.distance.revealMobile,
            scale: 0.96,
            duration: MOTION.duration.reveal,
            stagger: MOTION.stagger.list,
            clearProps: 'transform,visibility',
            scrollTrigger: { trigger: art, start: MOTION.trigger.revealStart, once: true },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: zoneRef },
  );
}
