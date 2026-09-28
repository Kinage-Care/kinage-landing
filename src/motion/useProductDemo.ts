import type { RefObject } from 'react';
import { DEMO_CHAT } from '../content/demo-chat';
import { gsap, ScrollTrigger, useGSAP } from './gsap';
import { MOTION, MQ } from './tokens';

/**
 * Phone demo (Family Financial Oversight), played as a calm loop:
 *
 *   phone fades up once → ┌ header → first alert + card stack
 *                         │ question typed in the composer and sent
 *                         │ reply indicator → reply + review card stack
 *                         │ (the feed scrolls up just enough to keep it above the composer)
 *                         │ hold the completed state          (3 s, from the moment it completes)
 *                         └ everything fades out, then the sequence starts again
 *
 * One timeline with `repeat: -1`: the fade-out ends in exactly the start state
 * (all hidden, feed back at 0), so the restart is invisible — no second
 * timer, no flash. Only elements *inside* the phone screen animate; the phone
 * shell and screen geometry stay fixed. It pauses whenever the section is off
 * screen or the tab is hidden and resumes where it stopped. Under
 * prefers-reduced-motion nothing plays and the static Figma screen is shown.
 */
export function useProductDemo(rootRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const q = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(`[data-demo="${sel}"]`)!;
        const t = DEMO_CHAT.timing;
        const typed = q('typed');
        const caret = q('caret');
        const placeholder = q('placeholder');
        const scroll = q('scroll');
        const layers = (part: string) => root.querySelectorAll(`[data-demo="${part}-stack"] [data-demo-layer]`);
        const text = { chars: 0 };
        const blink = gsap.to(q('caret-blink'), { opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: 'steps(1)', paused: true });

        // How far the feed has to scroll so the reply's last line clears the
        // composer — measured in the screen's own (unscaled) layout.
        const overflow = () => {
          const s2 = q('s2');
          const composer = root.querySelector<HTMLElement>('.pm__composer')!;
          const bottom = s2.offsetTop + s2.offsetHeight + 12;
          const limit = composer.offsetTop;
          return Math.max(0, Math.ceil(bottom - limit));
        };

        root.setAttribute('data-demo-active', '');
        typed.textContent = '';

        const content = [q('overview'), q('s1'), q('question'), q('thinking'), q('s2')];

        gsap.set(q('frame'), { autoAlpha: 0, y: MOTION.distance.reveal });
        gsap.set([q('overview'), q('s1-message'), q('s1-more')], { autoAlpha: 0, y: 24 });
        gsap.set(layers('s1'), { autoAlpha: 0, y: 36 });
        gsap.set([q('question'), q('thinking'), q('s2')], { autoAlpha: 0, y: 24 });
        gsap.set([q('s2-message'), q('s2-more')], { autoAlpha: 0, y: 16 });
        gsap.set(layers('s2'), { autoAlpha: 0, y: 36 });
        gsap.set([q('question'), q('thinking'), q('s2')], { display: 'none' });

        const loop = gsap.timeline({ paused: true, repeat: -1, defaults: { ease: 'kinage.out' } });
        loop
          .set(q('s1'), { autoAlpha: 1 })
          .to(q('overview'), { autoAlpha: 1, y: 0, duration: 0.5 })
          .to(q('s1-message'), { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.2')
          .to(layers('s1'), { autoAlpha: 1, y: 0, duration: 0.55, stagger: t.stagger }, '-=0.3')
          .to(q('s1-more'), { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.2')
          // type the question into the composer
          .set(placeholder, { autoAlpha: 0 }, `+=${t.beforeTyping}`)
          .set(caret, { autoAlpha: 1 })
          .call(() => blink.play(0))
          .to(text, {
            chars: DEMO_CHAT.question.length,
            duration: DEMO_CHAT.question.length * t.perChar,
            ease: 'none',
            snap: { chars: 1 },
            onUpdate: () => {
              typed.textContent = DEMO_CHAT.question.slice(0, text.chars);
            },
          })
          // send
          .to(q('send'), { scale: 0.88, duration: 0.12, ease: 'kinage.exit' }, `+=${t.beforeSend}`)
          .to(q('send'), { scale: 1, duration: 0.3 })
          .call(() => {
            typed.textContent = '';
          }, undefined, '<')
          .set(caret, { autoAlpha: 0 }, '<')
          .call(() => blink.pause(0), undefined, '<')
          .set(placeholder, { autoAlpha: 1 }, '<')
          .set(q('question'), { display: 'flex' }, '<')
          .to(q('question'), { autoAlpha: 1, y: 0, duration: 0.45 }, '<')
          // reply indicator
          .set(q('thinking'), { display: 'flex' }, '+=0.25')
          .to(q('thinking'), { autoAlpha: 1, y: 0, duration: 0.35 })
          .to(
            q('thinking').querySelectorAll('.pm__dots span'),
            {
              opacity: 1,
              duration: 0.35,
              stagger: { each: 0.15, repeat: Math.max(1, Math.round(t.thinking / 0.7)), yoyo: true },
              ease: 'sine.inOut',
            },
            '<',
          )
          .to(q('thinking'), { autoAlpha: 0, duration: 0.2, ease: 'kinage.exit' }, '>-0.05')
          .set(q('thinking'), { display: 'none' })
          // reply and review cards; the feed scrolls up as they arrive
          .set(q('s2'), { display: 'flex', autoAlpha: 1, y: 0 })
          .to(scroll, { y: () => -overflow(), duration: 0.6, ease: 'kinage.inOut' }, '<')
          .to(q('s2-message'), { autoAlpha: 1, y: 0, duration: t.replyIn }, '<')
          .to(layers('s2'), { autoAlpha: 1, y: 0, duration: 0.55, stagger: t.stagger }, '-=0.3')
          .to(q('s2-more'), { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.2')
          .addLabel('complete')
          // hold the completed state, then fade everything back to the start state
          .to(content, { autoAlpha: 0, duration: t.reset, ease: 'kinage.exit' }, `complete+=${t.hold}`)
          .set({}, {}, `+=${t.restartGap}`);

        let started = false;
        let inView = false;
        const shouldRun = () => inView && document.visibilityState === 'visible';
        const intro = gsap
          .timeline({ paused: true })
          .to(q('frame'), { autoAlpha: 1, y: 0, duration: t.frameIn })
          .call(() => (shouldRun() ? loop.play() : undefined), undefined, t.frameIn * 0.55);
        const sync = () => {
          if (!shouldRun()) {
            intro.pause();
            loop.pause();
            return;
          }
          if (!started) {
            started = true;
            intro.play();
          } else if (intro.progress() < 1) intro.resume();
          else loop.resume();
        };

        const st = ScrollTrigger.create({
          trigger: root,
          start: MOTION.trigger.demoStart,
          end: 'bottom top',
          onToggle: (self) => {
            inView = self.isActive;
            sync();
          },
        });
        document.addEventListener('visibilitychange', sync);

        return () => {
          document.removeEventListener('visibilitychange', sync);
          st.kill();
          intro.kill();
          loop.kill();
          blink.kill();
          root.removeAttribute('data-demo-active');
          typed.textContent = '';
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );
}
