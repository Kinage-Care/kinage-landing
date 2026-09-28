/**
 * Structured copy and geometry for the Kinage landing page.
 * Copy is verbatim from Figma node 583:518 unless noted.
 */
import bill from '../assets/3d/bill.webp';
import doc from '../assets/3d/doc.webp';
import gmail from '../assets/3d/gmail.webp';
import sms from '../assets/3d/sms.webp';
import scam from '../assets/3d/scam.webp';
import chart from '../assets/3d/chart.webp';
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
    hero: { left: -78.27, top: 0.57, width: 225.89, height: 221.648 },
    card: 0,
    slot: { left: 13.32, top: 13.87, width: 173.903, height: 170.637 },
    slotOpacity: 0.9,
    shadow: { kind: 'blur', box: { left: -10.46, top: 19.07, width: 155.916, height: 153.16 }, inner: { width: 128.129, height: 124.231 }, rotate: -15, blur: 32.95, radius: 11, opacity: 0.14 },
    z: 2,
  },
  {
    id: 'doc',
    label: 'Document',
    src: doc,
    hero: { left: 65.77, top: 253.14, width: 121.025, height: 124.983 },
    card: 0,
    slot: { left: 153.37, top: 13.67, width: 82.815, height: 85.524 },
    slotOpacity: 0.6,
    shadow: { kind: 'blur', box: { left: 125.19, top: 12.26, width: 87.06, height: 86.434 }, inner: { width: 72.686, height: 71.849 }, rotate: -13.08, blur: 32.95, radius: 11, opacity: 0.15 },
    z: 1,
  },
  {
    id: 'gmail',
    label: 'Gmail',
    src: gmail,
    hero: { left: -92.59, top: 442.4, width: 190.047, height: 180.764 },
    card: 0,
    slot: { left: 165.92, top: 82.01, width: 125.353, height: 119.229 },
    slotOpacity: 1,
    shadow: { kind: 'blur', box: { left: 163.16, top: 74.33, width: 133.888, height: 132.109 }, inner: { width: 105.07, height: 102.066 }, rotate: 20.24, blur: 32.95, radius: 11, opacity: 0.15 },
    z: 3,
  },
  {
    id: 'scam',
    label: 'Scam alert',
    src: scam,
    layer: 'front',
    hero: { left: 954.67, top: 345.34, width: 133.458, height: 128.564 },
    card: 1,
    slot: { left: 78.48, top: 18.05, width: 173.597, height: 167.231 },
    slotOpacity: 1,
    shadow: { kind: 'svg', box: { left: 69.77, top: 2.43, width: 196.456, height: 196.145 }, inner: { width: 153.125, height: 152.6 }, rotate: 20.24 },
    z: 1,
  },
  {
    id: 'chart',
    label: 'Chart',
    src: chart,
    hero: { left: 1039.8, top: 490.33, width: 227.416, height: 169.48 },
    card: 2,
    slot: { left: 121.76, top: 49.64, width: 185.389, height: 138.16 },
    slotOpacity: 1,
    shadow: { kind: 'blur', box: { left: 150.91, top: 49.64, width: 127.073, height: 128.423 }, inner: { width: 105.521, height: 107.327 }, rotate: -13.08, blur: 48.867, radius: 16.314, opacity: 0.15 },
    z: 1,
  },
  {
    id: 'sms',
    label: 'Family messages',
    src: sms,
    hero: { left: 1052.2, top: -31.96, width: 198.185, height: 183.212 },
    card: 2,
    slot: { left: 58.01, top: 22.72, width: 102.847, height: 95.077 },
    slotOpacity: 1,
    shadow: { kind: 'blur', box: { left: 63.4, top: 23.79, width: 92.496, height: 93.19 }, inner: { width: 80.643, height: 81.48 }, rotate: 9.08, blur: 32.95, radius: 11, opacity: 0.15 },
    z: 2,
  },
];

/* ------------------------------------------------------------------------ */

export const PROBLEMS = [
  {
    title: '"I have no idea what\'s going on with my parent\'s finances."',
    body: "Bills are scattered, and you find out about problems after they're emergencies.",
  },
  {
    title: '"I\'m terrified my parent will get scammed."',
    body: 'Scams often deceive older adults into sending money they believe is safe, and banks rarely cover the loss.',
  },
  {
    title: '"Our family has no system, and it\'s causing friction."',
    body: "Nobody knows who's handling what. No coordination, no accountability.",
  },
] as const;

export const BENEFITS = [
  { title: 'Full Visibility, One Dashboard', body: 'Every bill, organized automatically: upcoming, past, and anything that needs review.', image: benefitDashboard },
  { title: 'Early Warning for Fraud', body: 'Suspicious amounts and unfamiliar vendors flagged before money leaves the account.', image: benefitFraud },
  { title: 'Family Coordination Without the Arguments', body: "Assign roles, share visibility, track who's handling what from one dashboard.", image: benefitFamily },
] as const;

export const STEPS = [
  { title: "Connect your parent's email", body: 'Bills discovered and organized automatically.', tone: 1 },
  { title: 'Link a bank account (optional)', body: 'Match bills to payments, get overdraft alerts.', tone: 2 },
  { title: 'Get alerts when something looks off', body: 'Unusual amounts, duplicates, potential scams.', tone: 3 },
  { title: 'Invite your family and advisors', body: 'Assign roles, share visibility, one dashboard.', tone: 4 },
] as const;

export const TRUST_CHIPS = ['Read-only access', 'No stored passwords', 'No money movement', 'Family and parent controls'] as const;

/** Three columns as designed: left, centre, right (DOM order = reading order per column). */
export const TRUST_COLUMNS = [
  [
    { title: 'Read-only access', body: 'Kinage can only see data, never move, change, or touch anything in any account.', icon: iconEye, fixed: true },
    { title: 'No Social Security number', body: 'We never ask for a Social Security number. Not during setup. Not ever.', icon: iconIdCard, fixed: true },
  ],
  [
    { title: 'No stored passwords', body: 'Connections run through Plaid, the same system used by PayPal, Venmo, Robinhood, and thousands of banks.', icon: iconKey, fixed: false },
    { title: 'Bank-grade encryption', body: 'All data is encrypted in transit and at rest.', icon: iconShieldCheck, fixed: true },
  ],
  [
    { title: 'No money movement', body: 'We cannot initiate transfers, make payments, or touch funds, by design.', icon: iconCircleX, fixed: true },
    { title: 'Parent controls permissions', body: 'Your parent decides who sees what. They can revoke access at any time.', icon: iconUsers, fixed: true },
  ],
] as const;

export const STATS = [
  { value: '$4.9B', label: 'reported to elder fraud in 2024 (FBI IC3, reported amounts only)' },
  { value: '69M', label: 'family caregivers in the U.S. (AARP)' },
  { value: '$49T', label: '49% of U.S. household wealth held by adults 65 and older (WSJ)' },
  { value: '1 in 2', label: 'older adults will need some level of financial coordination before end of life' },
] as const;

export const NAV_LINKS: LinkKey[] = ['howItWorks', 'forFamilies', 'pricing', 'forAdvisors', 'ourStory'];

export const FOOTER_COLUMNS: { title: string; links: LinkKey[] }[] = [
  { title: 'Product', links: ['howItWorks', 'forFamilies', 'pricing', 'forAdvisors'] },
  { title: 'Company', links: ['ourStory', 'contact'] },
  { title: 'Legal', links: ['privacy', 'terms', 'security'] },
];
