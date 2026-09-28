import { useEffect, useId, useRef, useState } from 'react';
import { Brand } from '../components/Brand';
import { EarlyAccessButton } from '../components/EarlyAccess';
import { SmartLink } from '../components/SmartLink';
import { NAV_LINKS } from '../content/landing';
import { SECTIONS } from '../content/links';
import { withBase } from '../lib/base';
import { MOTION } from '../motion/tokens';
import { pageOf, usePathname } from '../router';
import './Nav.css';

/**
 * Floating nav bar (Figma 583:1070): 1200 wide, 80% white with a 6.85px
 * backdrop blur, 37px from the top. Fixed, so it never takes part in layout.
 *
 * Behaviour is scrolling vs idle — not direction: any scroll hides it with a
 * short fade and lift; once no scroll event has arrived for MOTION.nav.idle ms
 * it returns (a little slower than it left). It stays visible while its menu
 * is open, while keyboard focus is inside it, and always under
 * prefers-reduced-motion. While hidden it is `visibility: hidden`, so it can't
 * catch clicks or focus. Below 1024px the links collapse into a menu.
 */
export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef(false);
  openRef.current = open;
  const page = pageOf(usePathname());

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer = 0;
    const onScroll = () => {
      if (reduced.matches || openRef.current || headerRef.current?.contains(document.activeElement)) return;
      setHidden(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setHidden(false), MOTION.nav.idle);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const mql = window.matchMedia('(min-width: 1024px)');
    const onWide = () => mql.matches && setOpen(false);
    window.addEventListener('keydown', onKey);
    mql.addEventListener('change', onWide);
    return () => {
      window.removeEventListener('keydown', onKey);
      mql.removeEventListener('change', onWide);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      ref={headerRef}
      className="nav"
      data-hidden={(hidden && !open) || undefined}
      data-open={open || undefined}
      onFocus={() => setHidden(false)}
    >
      <nav className="nav__bar" aria-label="Primary">
        <a className="nav__brand" href={withBase(`/#${SECTIONS.top}`)} aria-label="Kinage home" onClick={close}>
          <Brand />
        </a>

        <ul className="nav__links" id={menuId}>
          {NAV_LINKS.map((key) => (
            <li key={key}>
              <SmartLink
                to={key}
                className="nav__link"
                onClick={close}
                aria-current={(key === 'ourStory' && page === 'story') || (key === 'forAdvisors' && page === 'advisors') ? 'page' : undefined}
              />
            </li>
          ))}
          <li className="nav__menu-cta">
            <EarlyAccessButton className="btn btn--outline" onClick={close} />
          </li>
        </ul>

        <EarlyAccessButton className="btn btn--outline nav__cta" />

        <button
          ref={toggleRef}
          type="button"
          className="nav__toggle"
          data-focus-return
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <path className="nav__toggle-top" d="M3 7h16" />
            <path className="nav__toggle-bottom" d="M3 15h16" />
          </svg>
        </button>
      </nav>
    </header>
  );
}
