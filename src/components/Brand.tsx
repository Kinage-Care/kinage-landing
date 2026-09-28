import logo from '../../design-system/brand/kinage-logo.svg';
import logoInverse from '../assets/brand/kinage-logo-inverse.svg';
import './Brand.css';

/**
 * Kinage lockup, straight from the canonical SVG (design-system/brand/
 * kinage-logo.svg): the four-quarter mark with its own negative-space gaps +
 * the wordmark, one file, rendered as an image so no page style can touch its
 * fills or geometry. `tone="inverse"` uses the white variant generated from the
 * same file (scripts/build-brand.mjs), as does the favicon.
 * Decorative by default — the wrapping link carries the accessible name.
 */
export function Brand({ className = '', tone = 'default' }: { className?: string; tone?: 'default' | 'inverse' }) {
  return (
    <span className={`brand${tone === 'inverse' ? ' brand--inverse' : ''} ${className}`} aria-hidden="true">
      <img className="brand__logo" src={tone === 'inverse' ? logoInverse : logo} alt="" width={151} height={34} />
    </span>
  );
}
