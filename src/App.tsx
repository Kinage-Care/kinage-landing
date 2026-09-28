import { useEffect, useLayoutEffect } from 'react';
import { EarlyAccessProvider } from './components/EarlyAccess';
import { StackGroup } from './components/StackGroup';
import { pendingDestinations } from './content/links';
import { ScrollTrigger } from './motion/gsap';
import { initSmoothScroll, jumpTo } from './motion/smoothScroll';
import { AdvisorsPage } from './pages/Advisors';
import { OurStory } from './pages/OurStory';
import { interceptLinks, pageOf, takePendingScroll, usePathname } from './router';
import { Advisors } from './sections/Advisors';
import { Benefits } from './sections/Benefits';
import { Faq } from './sections/Faq';
import { FinalCta } from './sections/FinalCta';
import { Footer } from './sections/Footer';
import { Founder } from './sections/Founder';
import { HeroFlight } from './sections/HeroFlight';
import { HowItWorks } from './sections/HowItWorks';
import { Nav } from './sections/Nav';
import { Pricing } from './sections/Pricing';
import { Stats } from './sections/Stats';
import { Testimonials } from './sections/Testimonials';
import { Trust } from './sections/Trust';
import { WhatKinage } from './sections/WhatKinage';

/** Section order = Figma node 583:518 (hero: 596:1908), top to bottom. */
function Landing() {
  return (
    <>
      <HeroFlight />
      <WhatKinage />
      <StackGroup equalize={2}>
        <Advisors />
        <Founder />
        <Benefits />
      </StackGroup>
      <HowItWorks />
      <Trust />
      <Testimonials />
      <Pricing />
      <Stats />
      <Faq />
      <FinalCta />
    </>
  );
}

export function App() {
  const page = pageOf(usePathname());

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
