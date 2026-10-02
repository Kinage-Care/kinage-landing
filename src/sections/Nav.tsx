import { useEffect, useId, useRef, useState } from 'react';
import { Brand } from '../components/Brand';
import { EarlyAccessButton } from '../components/EarlyAccess';
import { SmartLink } from '../components/SmartLink';
import { LINKS, SECTIONS, type LinkKey } from '../content/links';
import { NAV_LINKS } from '../content/site';
import { withBase } from '../lib/base';
import { MOTION } from '../motion/tokens';
import { pageOf, usePathname } from '../router';
import './Nav.css';

/** Section links that can be "current" while their section is on screen. */
const SPY: Partial<Record<LinkKey, string>> = {
  howItWorks: SECTIONS.howItWorks,
  security: SECTIONS.security,
  faq: SECTIONS.faq,
};

/**
 * Floating nav (reference pack): a white 8px container with the layered
 * shadow, pill-shaped items, the current one in Mist Violet, one filled
 * action. Fixed, so it never takes part in layout.
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
  const [current, setCurrent] = useState<string | null>(null);

  // Scroll spy (landing only): the section crossing the upper third is current.
  useEffect(() => {
    if (page !== 'home') {
      setCurrent(null);
      return;
    }
    const ids = Object.values(SPY) as string[];
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id));
        setCurrent(ids.find((id) => visible.has(id)) ?? null);
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [page]);

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
                data-current={(SPY[key] && SPY[key] === current) || undefined}
                aria-current={(key === 'ourStory' && page === 'story') || (key === 'forAdvisors' && page === 'advisors') ? 'page' : undefined}
              />
            </li>
          ))}
          <li className="nav__menu-cta">
            <EarlyAccessButton className="btn btn--outline" onClick={close} />
          </li>
        </ul>

        <EarlyAccessButton className="btn btn--outline btn--sm nav__cta">{LINKS.earlyAccess.label}</EarlyAccessButton>

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
