import type { CSSProperties } from 'react';
import chevronDown from '../../assets/figma/upcoming/chevron-down.svg';
import house from '../../assets/figma/upcoming/house.svg';
import open from '../../assets/figma/upcoming/open.svg';
import shieldCheck from '../../assets/figma/upcoming/shield-check.svg';
import storefront from '../../assets/figma/upcoming/storefront.svg';
import television from '../../assets/figma/upcoming/television.svg';
import type { UpcomingIcon, UpcomingRow } from '../../content/home';
import { ProductBadge } from './ProductBadge';
import './upcoming.css';

const ICONS: Record<UpcomingIcon, string> = { house, television, storefront, 'shield-check': shieldCheck };

type Props = {
  rows: UpcomingRow[];
  filters?: readonly string[];
  /** Extra badges shown on a row (step 3 adds "Was Flagged" to the AT&T bill). */
  extraBadges?: Record<string, UpcomingRow['badges']>;
  /** A row drawn with a restrained highlight (background + hairline), others unchanged. */
  highlightId?: string;
};

/**
 * Kinage "Upcoming payments" table (Figma 544:406): white rows 77px high on
 * a 12px-radius table with a soft plum drop shadow, 2px warm separators, a
 * 3px state edge, a 50px icon tile, vendor 18/24 and date 14/18 in Museo
 * Sans 500, the "Cleared by …" line in Museo 300 16, badges, a right-aligned
 * amount and the open arrow. Rows carry `--i` for staggered reveals.
 */
export function UpcomingTable({ rows, filters, extraBadges, highlightId }: Props) {
  return (
    <div className="up p-ui">
      {filters && (
        <div className="up__filters">
          {filters.map((f) => (
            <span className="up__filter" key={f}>
              {f}
              <img src={chevronDown} alt="" width={16} height={16} />
            </span>
          ))}
        </div>
      )}
      <ul className="up__table">
        {rows.map((r, i) => {
          const badges = [...r.badges, ...(extraBadges?.[r.id] ?? [])];
          return (
            <li
              className="up__row"
              key={r.id}
              data-edge={r.edge}
              data-highlight={highlightId === r.id || undefined}
              style={{ '--i': i } as CSSProperties}
            >
              <span className="up__edge" />
              <span className="up__icon">
                <img src={ICONS[r.icon]} alt="" width={24} height={24} />
              </span>
              <span className="up__identity">
                <span className="up__line">
                  <span className="up__vendor">{r.vendor}</span>
                  <span className="up__date">{r.date}</span>
                </span>
                {r.meta && <span className="up__meta">{r.meta}</span>}
              </span>
              <span className="up__badges">
                {badges.map((b) => (
                  <span className="up__badge" key={b} data-kind={b}>
                    <ProductBadge kind={b} />
                  </span>
                ))}
              </span>
              <span className="up__amount">{r.amount}</span>
              <span className="up__open">
                <img src={open} alt="" width={20} height={20} />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
