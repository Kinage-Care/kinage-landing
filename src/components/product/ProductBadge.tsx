import alertTriangleCard from '../../assets/figma/upcoming/alert-triangle-card.svg';
import alertTriangle from '../../assets/figma/upcoming/alert-triangle.svg';
import checkCircle from '../../assets/figma/upcoming/check-circle.svg';
import clock from '../../assets/figma/upcoming/clock.svg';
import flagFlagged from '../../assets/figma/upcoming/flag-flagged.svg';
import flagUnusual from '../../assets/figma/upcoming/flag-unusual.svg';
import type { UpcomingBadge } from '../../content/home';
import './product.css';

/**
 * Status badges of the Kinage app, exactly as in Figma: 26px high, 4px
 * radius, Museo Sans 500 14/16, a 12px icon 5px before the label (544:406
 * table badges, 544:337 card badges). Icons are the design's own SVGs.
 */
const BADGES: Record<UpcomingBadge, { label: string; icon?: string }> = {
  overdue: { label: 'Overdue', icon: alertTriangle },
  flagged: { label: 'Was Flagged', icon: flagFlagged },
  unusual: { label: 'Unusual Amount', icon: flagUnusual },
  'due-soon': { label: 'Due Soon', icon: clock },
  confirmed: { label: 'Confirmed', icon: checkCircle },
  autopay: { label: 'Autopay' },
  subscription: { label: 'Subscription' },
};

export function ProductBadge({ kind, context = 'table' }: { kind: UpcomingBadge; context?: 'table' | 'card' }) {
  const b = BADGES[kind];
  const icon = context === 'card' && kind === 'overdue' ? alertTriangleCard : b.icon;
  return (
    <span className="p-badge" data-kind={kind} data-icon={icon ? true : undefined}>
      {icon && <img src={icon} alt="" width={12} height={12} />}
      {b.label}
    </span>
  );
}

/** Figma avatar (sidebar user row): a 4px-radius square with initials. */
export function Avatar({ initials, tone = 'eggplant', size = 32 }: { initials: string; tone?: 'eggplant' | 'violet' | 'rose' | 'sand'; size?: number }) {
  return (
    <span className="p-avatar" data-tone={tone} style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}>
      {initials}
    </span>
  );
}
