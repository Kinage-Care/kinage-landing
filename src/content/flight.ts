/**
 * Geometry of the hero → problem-card flight, ported from the V1 landing
 * (Kinage-Care/kinage-landing, src/content/landing.ts). The six paper-style
 * objects and their hero / card-slot boxes are V1's; only the copy around them
 * is this page's.
 */
import bill from '../assets/3d/hero-bill.webp';
import bill320 from '../assets/3d/hero-bill-320.webp';
import bill640 from '../assets/3d/hero-bill-640.webp';
import doc from '../assets/3d/hero-doc.webp';
import doc320 from '../assets/3d/hero-doc-320.webp';
import doc640 from '../assets/3d/hero-doc-640.webp';
import gmail from '../assets/3d/hero-gmail.webp';
import gmail320 from '../assets/3d/hero-gmail-320.webp';
import gmail640 from '../assets/3d/hero-gmail-640.webp';
import sms from '../assets/3d/hero-sms.webp';
import sms320 from '../assets/3d/hero-sms-320.webp';
import sms640 from '../assets/3d/hero-sms-640.webp';
import scam from '../assets/3d/hero-scam.webp';
import scam320 from '../assets/3d/hero-scam-320.webp';
import scam640 from '../assets/3d/hero-scam-640.webp';
import chart from '../assets/3d/hero-chart.webp';
import chart320 from '../assets/3d/hero-chart-320.webp';
import chart640 from '../assets/3d/hero-chart-640.webp';

/* ------------------------------------------------------------------------
 * Hero → problem-card shared elements
 *
 * `hero` is in hero-card coordinates (the white card is 1201 wide at the
 * reference width, 801 tall with the video block; negative values sit outside
 * the card, as in Figma). Top coordinates are V1's, unchanged by the taller card.
 * `slot` is in problem-card image-area coordinates (336 × 201).
 * Hero and slot boxes share each PNG's aspect ratio, so a uniform scale maps
 * one onto the other, transparent padding included.
 * ---------------------------------------------------------------------- */

export type Rect = { left: number; top: number; width: number; height: number };

export type ContactShadow = {
  /** Rotated blurred rounded rect (Figma) or the exported shadow SVG. */
  kind: 'blur' | 'svg';
  box: Rect;
  inner: { width: number; height: number };
  rotate: number;
  blur?: number;
  radius?: number;
  opacity?: number;
};

export type FlightAsset = {
  id: 'bill' | 'doc' | 'gmail' | 'sms' | 'scam' | 'chart';
  label: string;
  src: string;
  /** 320w / 640w copies and the original (960w); one `sizes` for every use (FLIGHT_SIZES). */
  srcSet: string;
  hero: Rect;
  card: 0 | 1 | 2;
  slot: Rect;
  /** Opacity in the destination card (Figma). */
  slotOpacity: number;
  shadow: ContactShadow;
  /** Paint order inside its destination card (higher = in front). */
  z: number;
  /**
   * Flight layer. 'back' (default) travels beneath all copy; 'front' travels
   * above the section copy it crosses (refinement brief: the scam icon passes
   * over "You're not the only one" instead of behind it).
   */
  layer?: 'back' | 'front';
};

/**
 * The paper objects' `sizes`: the largest box each object takes anywhere (hero
 * slot, card slot or in flight). Every use shares it, so a browser picks one
 * file per object and never downloads two: up to 276px on desktop (hero
 * slots at the reference width), up to 241px on phones (card slots).
 */
export const FLIGHT_SIZES = '(max-width: 767px) 241px, 276px';

export const HERO_CARD = { width: 1201, height: 801 };
export const SLOT_AREA = { width: 336, height: 201 };

export const FLIGHT_ASSETS: FlightAsset[] = [
  {
    id: 'bill',
    label: 'Bill',
    src: bill,
    srcSet: `${bill320} 320w, ${bill640} 640w, ${bill} 960w`,
    hero: { left: -84.959, top: -6.051, width: 224.357, height: 224.357 },
    card: 0,
    slot: { left: 8.17, top: 8.773, width: 172.723, height: 172.723 },
    slotOpacity: 0.9,
    shadow: { kind: 'blur', box: { left: -10.46, top: 19.07, width: 155.916, height: 153.16 }, inner: { width: 128.129, height: 124.231 }, rotate: -15, blur: 32.95, radius: 11, opacity: 0.14 },
    z: 2,
  },
  {
    id: 'doc',
    label: 'Document',
    src: doc,
    srcSet: `${doc320} 320w, ${doc640} 640w, ${doc} 960w`,
    hero: { left: 49.029, top: 238.107, width: 151.511, height: 151.511 },
    card: 0,
    slot: { left: 141.914, top: 3.384, width: 103.676, height: 103.676 },
    slotOpacity: 0.6,
    shadow: { kind: 'blur', box: { left: 125.19, top: 12.26, width: 87.06, height: 86.434 }, inner: { width: 72.686, height: 71.849 }, rotate: -13.08, blur: 32.95, radius: 11, opacity: 0.15 },
    z: 1,
  },
  {
    id: 'gmail',
    label: 'Gmail',
    src: gmail,
    srcSet: `${gmail320} 320w, ${gmail640} 640w, ${gmail} 960w`,
    hero: { left: -100.363, top: 451.373, width: 236.736, height: 157.824 },
    card: 0,
    slot: { left: 151.559, top: 87.928, width: 156.148, height: 104.099 },
    slotOpacity: 1,
    shadow: { kind: 'blur', box: { left: 163.16, top: 74.33, width: 133.888, height: 132.109 }, inner: { width: 105.07, height: 102.066 }, rotate: 20.24, blur: 32.95, radius: 11, opacity: 0.15 },
    z: 3,
  },
  {
    id: 'scam',
    label: 'Scam alert',
    src: scam,
    srcSet: `${scam320} 320w, ${scam640} 640w, ${scam} 960w`,
    layer: 'front',
    hero: { left: 950.149, top: 335.878, width: 142.797, height: 142.797 },
    card: 1,
    slot: { left: 72.6, top: 5.742, width: 185.744, height: 185.744 },
    slotOpacity: 1,
    shadow: { kind: 'svg', box: { left: 69.77, top: 2.43, width: 196.456, height: 196.145 }, inner: { width: 153.125, height: 152.6 }, rotate: 20.24 },
    z: 1,
  },
  {
    id: 'chart',
    label: 'Chart',
    src: chart,
    srcSet: `${chart320} 320w, ${chart640} 640w, ${chart} 960w`,
    hero: { left: 1014.024, top: 474.87, width: 275.732, height: 183.821 },
    card: 2,
    slot: { left: 100.747, top: 37.037, width: 224.776, height: 149.851 },
    slotOpacity: 1,
    shadow: { kind: 'blur', box: { left: 150.91, top: 49.64, width: 127.073, height: 128.423 }, inner: { width: 105.521, height: 107.327 }, rotate: -13.08, blur: 48.867, radius: 16.314, opacity: 0.15 },
    // In front of the messages card (as the bill is in front of the document in card 1).
    z: 2,
  },
  {
    id: 'sms',
    label: 'Family messages',
    src: sms,
    srcSet: `${sms320} 320w, ${sms640} 640w, ${sms} 960w`,
    hero: { left: 1053.846, top: -44.503, width: 196.664, height: 196.664 },
    card: 2,
    slot: { left: 58.864, top: 16.211, width: 102.058, height: 102.058 },
    // Further away, behind the chart: card 1's document values (opacity 0.6, z 1),
    // so the order is the same in the card and during the whole flight.
    slotOpacity: 0.6,
    shadow: { kind: 'blur', box: { left: 63.4, top: 23.79, width: 92.496, height: 93.19 }, inner: { width: 80.643, height: 81.48 }, rotate: 9.08, blur: 32.95, radius: 11, opacity: 0.15 },
    z: 1,
  },
];
