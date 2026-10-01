/**
 * Structured copy and geometry for the Kinage landing page.
 * Copy is verbatim from Figma node 583:518 unless noted.
 */
import bill from '../assets/3d/hero-bill.webp';
import doc from '../assets/3d/hero-doc.webp';
import gmail from '../assets/3d/hero-gmail.webp';
import sms from '../assets/3d/hero-sms.webp';
import scam from '../assets/3d/hero-scam.webp';
import chart from '../assets/3d/hero-chart.webp';
import benefitDashboard from '../assets/3d/benefit-dashboard.webp';
import benefitFraud from '../assets/3d/benefit-fraud.webp';
import benefitFamily from '../assets/3d/benefit-family.webp';
import iconEye from '../assets/figma/icon-eye.svg';
import iconKey from '../assets/figma/icon-key.svg';
import iconCircleX from '../assets/figma/icon-circle-x.svg';
import iconIdCard from '../assets/figma/icon-id-card.svg';
import iconShieldCheck from '../assets/figma/icon-shield-check.svg';
import iconUsers from '../assets/figma/icon-users-2.svg';
import type { LinkKey } from './links';

/* ------------------------------------------------------------------------
 * Hero → problem-card shared elements
 *
 * `hero` is in hero-card coordinates (the eggplant card is 1201 × 637 at the
 * reference width; negative values sit outside the card, as in Figma).
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

export const HERO_CARD = { width: 1201, height: 637 };
export const SLOT_AREA = { width: 336, height: 201 };

export const FLIGHT_ASSETS: FlightAsset[] = [
  {
    id: 'bill',
    label: 'Bill',
    src: bill,
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
    hero: { left: 1014.024, top: 474.87, width: 275.732, height: 183.821 },
    card: 2,
    slot: { left: 100.747, top: 37.037, width: 224.776, height: 149.851 },
    slotOpacity: 1,
    shadow: { kind: 'blur', box: { left: 150.91, top: 49.64, width: 127.073, height: 128.423 }, inner: { width: 105.521, height: 107.327 }, rotate: -13.08, blur: 48.867, radius: 16.314, opacity: 0.15 },
    z: 1,
  },
  {
    id: 'sms',
    label: 'Family messages',
    src: sms,
    hero: { left: 1053.846, top: -44.503, width: 196.664, height: 196.664 },
    card: 2,
    slot: { left: 58.864, top: 16.211, width: 102.058, height: 102.058 },
    slotOpacity: 1,
    shadow: { kind: 'blur', box: { left: 63.4, top: 23.79, width: 92.496, height: 93.19 }, inner: { width: 80.643, height: 81.48 }, rotate: 9.08, blur: 32.95, radius: 11, opacity: 0.15 },
    z: 2,
  },
];

/* ------------------------------------------------------------------------ */

export const PROBLEMS = [
  {
    title: '"I have no idea what\'s going on with my parent\'s finances"',
    body: "Bills are scattered, and you find out about problems after they're emergencies.",
  },
  {
    title: '"I\'m terrified my parent will get scammed"',
    body: "Scams often trick older adults into sending money they believe is safe, and once it's gone, it's usually gone for good.",
  },
  {
    title: '"Our family has no system, and it\'s causing friction"',
    body: 'Everyone assumes someone else has it, so nobody is sure who is handling what.',
  },
] as const;

export const BENEFITS = [
  {
    title: 'See bills in one place',
    body: 'View upcoming bills, payment activity, and items that need attention from connected sources.',
    image: benefitDashboard,
  },
  {
    title: 'See what needs a closer look',
    body: 'Kinage flags unusual amounts, unfamiliar vendors, and other suspicious signals in the data it monitors. Your family decides what to do next.',
    image: benefitFraud,
  },
  {
    title: 'See who is handling what',
    body: 'You, your siblings, and trusted advisors can share responsibilities and keep a record of decisions in one place.',
    image: benefitFamily,
  },
] as const;

export const STEPS = [
  { title: "Connect your parent's email", body: 'Kinage finds bills and statements and organizes them for you.', tone: 1 },
  { title: 'Link a bank account', body: 'Connect through Plaid with read-only access. Kinage cannot move money.', tone: 2 },
  { title: 'Get alerts when something looks off', body: 'Kinage flags unusual amounts, duplicate charges, and possible scams.', tone: 3 },
  { title: 'Invite your family and advisors', body: 'Share one view and agree on who handles what.', tone: 4 },
] as const;

export const TRUST_CHIPS = ['Read-only access', 'No stored passwords', 'No money movement', 'Family and parent controls'] as const;

/** Three columns as designed: left, centre, right (DOM order = reading order per column). */
export const TRUST_COLUMNS = [
  [
    { title: 'Read-only access', body: "Kinage only sees the data you connect. It can't move or change anything in any account, and it can't see cash or phone calls.", icon: iconEye },
    { title: 'No Social Security number', body: 'We never ask for a Social Security number. Not during setup. Not ever.', icon: iconIdCard },
  ],
  [
    { title: 'No stored passwords', body: "Bank connections run through Plaid. Your bank gives Kinage a locked, one-purpose code instead of a login, so there's no password to store.", icon: iconKey },
    {
      title: 'Bank-level encryption',
      body: "Your family's data is protected with the same encryption standards large financial institutions use.",
      icon: iconShieldCheck,
    },
  ],
  [
    { title: 'No money movement', body: 'We cannot initiate transfers, make payments, or touch funds, by design.', icon: iconCircleX },
    { title: 'Parent controls permissions', body: 'Your parent decides who sees what. They can revoke access at any time.', icon: iconUsers },
  ],
] as const;

export const STATS = [
  { value: '$4.9B', label: 'in fraud and scam losses reported by older Americans in 2024, up a little over 40% from 2023 (FBI IC3)' },
  { value: '67M', label: 'Americans already provide care to an aging family member (AARP)' },
  { value: '10,000', label: 'Baby Boomers turn 65 every day (AARP)' },
  { value: '95M', label: 'Americans 65 and older expected by 2060 (AARP)' },
] as const;

export const NAV_LINKS: LinkKey[] = ['howItWorks', 'forFamilies', 'pricing', 'forAdvisors', 'ourStory'];

export const FOOTER_COLUMNS: { title: string; links: LinkKey[] }[] = [
  { title: 'Product', links: ['howItWorks', 'forFamilies', 'pricing', 'forAdvisors'] },
  { title: 'Company', links: ['ourStory', 'contact'] },
  { title: 'Legal', links: ['privacy', 'terms', 'security'] },
];
