/**
 * Minimal History-API routing for the pages: the landing (/), Our Story
 * (/our-story) and For Advisors (/advisors). No dependency; Vite's dev and
 * preview servers serve index.html for these paths, so direct loads and
 * refreshes work locally.
 *
 * - Same-origin links that change the page are intercepted and pushed onto
 *   history (see `interceptLinks`); links within the current page — including
 *   /#section hashes on the landing — stay native.
 * - Each history entry remembers its scroll offset, so Back/Forward return
 *   to where the reader was.
 */
import { useSyncExternalStore } from 'react';
import { stripBase } from './lib/base';
import { jumpTo } from './motion/smoothScroll';
import { PATHS } from './routes';

export { PATHS };
export type Page = 'home' | 'story' | 'advisors';

export const pageOf = (pathname: string): Page => {
  const path = stripBase(pathname).replace(/\/+$/, '');
  if (path === PATHS.story) return 'story';
  if (path === PATHS.advisors) return 'advisors';
  return 'home';
};

/** What the next render should do with the scroll position. */
export type PendingScroll = { hash: string; y: number } | null;
let pending: PendingScroll = null;
export const takePendingScroll = (): PendingScroll => {
  const p = pending;
  pending = null;
  return p;
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

let popBound = false;
function bindPopState() {
  if (popBound) return;
  popBound = true;
  window.addEventListener('popstate', (e) => {
    const state = e.state as { scrollY?: number } | null;
    pending = { hash: location.hash, y: state?.scrollY ?? 0 };
    emit();
  });
}

export function usePathname(): string {
  bindPopState();
  return useSyncExternalStore(subscribe, () => location.pathname, () => PATHS.home);
}

export function navigate(to: string) {
  const url = new URL(to, location.href);
  history.replaceState({ ...(history.state ?? {}), scrollY: window.scrollY }, '');
  history.pushState({ scrollY: 0 }, '', url.pathname + url.search + url.hash);
  pending = { hash: url.hash, y: 0 };
  emit();
}

/** Delegated click handler: SPA navigation between pages, native otherwise. */
export function interceptLinks(): () => void {
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    const url = new URL(a.href);
    if (url.origin !== location.origin) return;
    if (pageOf(url.pathname) === pageOf(location.pathname)) {
      // A link to the page you are on (no hash) would reload it: go to the top instead.
      if (!url.hash) {
        e.preventDefault();
        jumpTo(0);
      }
      return;
    }
    e.preventDefault();
    navigate(url.href);
  };
  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}
