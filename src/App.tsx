import { useEffect, useLayoutEffect } from 'react';
import { EarlyAccessProvider } from './components/EarlyAccess';
import { pendingDestinations } from './content/links';
import { PAGE_META } from './content/meta';
import { applyPageMeta } from './lib/pageMeta';
import { ScrollTrigger } from './motion/gsap';
import { initSmoothScroll, jumpTo } from './motion/smoothScroll';
import { AdvisorsPage } from './pages/Advisors';
import { OurStory } from './pages/OurStory';
import { interceptLinks, pageOf, takePendingScroll, usePathname } from './router';
import { Ben } from './sections/Ben';
import { Compare } from './sections/Compare';
import { Faq } from './sections/Faq';
import { FinalCta } from './sections/FinalCta';
import { Footer } from './sections/Footer';
import { HeroFlight } from './sections/hero/HeroFlight';
import { HowItWorks } from './sections/how/HowItWorks';
import { Nav } from './sections/Nav';
import { Pricing } from './sections/Pricing';
import { Trust } from './sections/Trust';

/**
 * Page order: hero + problem (one flight zone, always adjacent) → the
 * emotional hook (the closing section, repeated here) → walkthrough → pricing
 * → comparison → security → founder → FAQ → the closing section again.
 */
function Landing() {
  return (
    <>
      <HeroFlight />
      <FinalCta placement="early" />
      <HowItWorks />
      <Pricing />
      <Compare />
      <Trust />
      <Ben />
      <Faq />
      <FinalCta />
    </>
  );
}

export function App() {
  const page = pageOf(usePathname());

  // The current page's title and description (content/meta.ts).
  useEffect(() => applyPageMeta(PAGE_META[page]), [page]);

  useEffect(() => {
    if (import.meta.env.DEV) {
      const pending = pendingDestinations();
      if (pending.length) console.info(`[kinage] ${pending.length} link destinations pending (src/content/links.ts):\n  ${pending.join('\n  ')}`);
    }
  }, []);

  useEffect(() => {
    const stopSmooth = initSmoothScroll();
    const stopLinks = interceptLinks();
    return () => {
      stopLinks();
      stopSmooth();
    };
  }, []);

  // After a page change: go to the saved position (Back/Forward) or the hash
  // target, then let every scroll animation of the new page measure itself.
  useLayoutEffect(() => {
    const target = takePendingScroll();
    if (!target) return;
    const id = target.hash.slice(1);
    const el = id ? document.getElementById(decodeURIComponent(id)) : null;
    if (el && target.y === 0) {
      const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      jumpTo(el.getBoundingClientRect().top + window.scrollY - pad);
    } else {
      jumpTo(target.y);
    }
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, [page]);

  return (
    <EarlyAccessProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main" key={page}>
        {page === 'story' ? <OurStory /> : page === 'advisors' ? <AdvisorsPage /> : <Landing />}
      </main>
      <Footer />
    </EarlyAccessProvider>
  );
}
