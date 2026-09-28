#!/usr/bin/env node
/**
 * Checks for the refinement brief (Figma 583:518): nav scroll/idle behaviour,
 * section rhythm, typography, shared card surface, headings, footer lockup and
 * the scam icon flying above the problems copy.
 *
 *   npm run dev              (in another terminal)
 *   npm run verify:refinements [-- --url=http://localhost:5190/]
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const url = (process.argv.find((a) => a.startsWith('--url=')) ?? '--url=http://localhost:5190/').slice(6);
const out = (process.argv.find((a) => a.startsWith('--out=')) ?? '--out=verification/v4/after').slice(6);
mkdirSync(out, { recursive: true });
const rows = [];
const log = (check, ok, detail = '') => rows.push({ check, ok, detail: String(detail).slice(0, 110) });
const near = (a, b, tol = 1) => Math.abs(a - b) <= tol;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
async function open(width, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'no-preference', ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.mouse.move(2, 2);
  await page.waitForTimeout(500);
  return { ctx, page, errors };
}
const navState = (page) =>
  page.evaluate(() => {
    const nav = document.querySelector('.nav');
    const r = nav.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return {
      hidden: nav.hasAttribute('data-hidden'),
      visibility: getComputedStyle(nav).visibility,
      opacity: +getComputedStyle(nav.querySelector('.nav__bar')).opacity,
      catchesClicks: !!hit?.closest('.nav'),
      top: +r.top.toFixed(1),
    };
  });

/* ------------------------------------------------ 1 · nav, desktop, motion on */
{
  const { ctx, page, errors } = await open(1440);
  const look = await page.evaluate(() => {
    const bar = document.querySelector('.nav__bar');
    const cs = getComputedStyle(bar);
    const r = bar.getBoundingClientRect();
    return { bg: cs.backgroundColor, blur: cs.backdropFilter, radius: cs.borderRadius, shadow: cs.boxShadow, w: r.width, h: r.height, top: r.top };
  });
  log('nav: 80% white, 6.85px blur, 1200×72 at 37px', look.bg === 'rgba(255, 255, 255, 0.8)' && look.blur === 'blur(6.85px)' && look.w === 1200 && look.h === 72 && near(look.top, 37), JSON.stringify(look));
  const s0 = await navState(page);
  log('nav: visible on load', !s0.hidden && s0.visibility === 'visible' && s0.opacity === 1 && s0.catchesClicks, JSON.stringify(s0));

  const mainTop0 = await page.evaluate(() => document.querySelector('main').getBoundingClientRect().top + scrollY);
  // Continuous wheel scrolling (~1.1s): must be hidden during it.
  const during = [];
  for (let i = 0; i < 26; i++) {
    await page.mouse.wheel(0, 90);
    await page.waitForTimeout(40);
    if (i > 8 && i % 4 === 0) during.push(await navState(page));
  }
  log('nav: hidden while actively scrolling down', during.every((s) => s.hidden && !s.catchesClicks), during.map((s) => `${s.visibility}/${s.opacity.toFixed(2)}`).join(' '));
  const settled = await navState(page);
  await page.screenshot({ path: `${out}/nav-hidden-while-scrolling.png`, clip: { x: 0, y: 0, width: 1440, height: 160 } });
  // Desktop wheel smoothing glides a little after the last wheel event; idle
  // starts when the page actually stops moving.
  const stopped = () =>
    page.evaluate(
      () =>
        new Promise((resolve) => {
          let last = scrollY;
          let still = 0;
          const tick = () => {
            if (Math.abs(scrollY - last) < 0.5) still += 1;
            else still = 0;
            last = scrollY;
            if (still >= 3) resolve(performance.now());
            else requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }),
    );
  await stopped();
  // Idle: still hidden before the delay, back after it.
  await page.waitForTimeout(300);
  const early = await navState(page);
  // 500ms idle + 380ms reveal transition, with a margin for a busy headless frame clock.
  await page.waitForTimeout(900);
  const back = await navState(page);
  log('nav: stays hidden until idle (~500ms), then returns', settled.hidden && early.hidden && !back.hidden && back.opacity === 1 && back.catchesClicks, `+0 ${settled.hidden} · +300 ${early.hidden} · +1200 ${back.hidden} (opacity ${back.opacity})`);
  await page.screenshot({ path: `${out}/nav-back-after-idle.png`, clip: { x: 0, y: 0, width: 1440, height: 160 } });
  // Upward scrolling behaves the same (not direction-based).
  const up = [];
  for (let i = 0; i < 14; i++) {
    await page.mouse.wheel(0, -90);
    await page.waitForTimeout(40);
    if (i > 4 && i % 4 === 0) up.push(await navState(page));
  }
  await stopped();
  await page.waitForTimeout(1000);
  const upBack = await navState(page);
  log('nav: hides while scrolling up too, returns on idle', up.every((s) => s.hidden) && !upBack.hidden, `${up.map((s) => s.hidden).join(',')} → ${upBack.hidden}`);
  const mainTop1 = await page.evaluate(() => document.querySelector('main').getBoundingClientRect().top + scrollY);
  log('nav: no layout shift (fixed, out of flow)', mainTop0 === mainTop1 && s0.top === upBack.top, `main ${mainTop0}→${mainTop1}`);

  // Keyboard: focus inside the nav keeps it visible while the page scrolls.
  await page.waitForFunction(() => !document.querySelector('.nav').hasAttribute('data-hidden'));
  await page.focus('.nav__link');
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 90);
    await page.waitForTimeout(40);
  }
  const focused = await navState(page);
  log('nav: stays visible while focus is inside it', !focused.hidden && focused.visibility === 'visible', JSON.stringify(focused));
  await page.evaluate(() => document.activeElement.blur());
  log('nav: no console errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

/* ------------------------------------------------------ nav, reduced motion */
{
  const { ctx, page } = await open(1440, { reducedMotion: 'reduce' });
  const seen = [];
  for (let i = 0; i < 12; i++) {
    await page.mouse.wheel(0, 90);
    await page.waitForTimeout(40);
    if (i % 3 === 0) seen.push((await navState(page)).hidden);
  }
  const tr = await page.evaluate(() => getComputedStyle(document.querySelector('.nav')).transitionDuration);
  log('nav (reduced motion): never hides, no transition', seen.every((h) => !h) && /^0s/.test(tr), `${seen.join(',')} · ${tr}`);
  await ctx.close();
}

/* ------------------------------------------- 12 · scam above the problems copy */
{
  const { ctx, page, errors } = await open(1440);
  const END = await page.evaluate(() => {
    const row = document.querySelector('[data-flight-row]').getBoundingClientRect();
    return Math.round(scrollY + row.top + row.height / 2 - innerHeight * 0.58);
  });
  // Hit testing follows paint order, so for the test only the decorative layers
  // take pointer events; the topmost of {scam, text} at their overlap is what paints on top.
  const probe = () =>
    page.evaluate(() => {
      const tag = document.createElement('style');
      tag.textContent = '.flight-layer,.flight-asset{pointer-events:auto!important}';
      document.head.append(tag);
      const scam = document.querySelector('[data-flight-asset="scam"]');
      const s = scam.getBoundingClientRect();
      const texts = [...document.querySelectorAll('.problems h2, .problems p, .problems .problem-card__title, .problems .problem-card__body, .problems .eyebrow, .hero h1, .hero p')];
      const res = [];
      for (const t of texts) {
        for (const r of t.getClientRects()) {
          const x0 = Math.max(s.left, r.left), x1 = Math.min(s.right, r.right);
          const y0 = Math.max(s.top, r.top), y1 = Math.min(s.bottom, r.bottom);
          if (x1 - x0 < 4 || y1 - y0 < 4 || y0 < 0 || y1 > innerHeight) continue;
          const stack = document.elementsFromPoint((x0 + x1) / 2, (y0 + y1) / 2);
          const iScam = stack.indexOf(scam);
          const iText = stack.findIndex((e) => t === e || t.contains(e));
          res.push({ text: t.textContent.trim().slice(0, 24), scamOnTop: iScam > -1 && (iText === -1 || iScam < iText) });
        }
      }
      tag.remove();
      const layer = scam.parentElement;
      return {
        res,
        layer: layer.className,
        layerZ: getComputedStyle(layer).zIndex,
        pe: getComputedStyle(layer).pointerEvents,
        backIds: [...document.querySelectorAll('.flight-layer--back [data-flight-asset]')].map((e) => e.dataset.flightAsset),
      };
    });
  const hits = { down: [], up: [] };
  let meta;
  let shot = false;
  for (let i = 0; i <= 40; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round((END * i) / 40));
    await page.waitForTimeout(130);
    const p = await probe();
    meta = p;
    hits.down.push(...p.res);
    if (!shot && p.res.length) {
      await page.waitForTimeout(250);
      await page.screenshot({ path: `${out}/scam-over-copy-down.png` });
      shot = true;
    }
  }
  shot = false;
  for (let i = 40; i >= 0; i--) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round((END * i) / 40));
    await page.waitForTimeout(130);
    const p = await probe();
    hits.up.push(...p.res);
    if (!shot && p.res.length && i < 30) {
      await page.waitForTimeout(250);
      await page.screenshot({ path: `${out}/scam-over-copy-reverse.png` });
      shot = true;
    }
  }
  const texts = [...new Set([...hits.down, ...hits.up].map((h) => h.text))];
  log('scam: front layer z 4, non-interactive; other five in back layer', meta.layer.includes('front') && meta.layerZ === '4' && meta.pe === 'none' && meta.backIds.length === 5 && !meta.backIds.includes('scam'), `${meta.layerZ} ${meta.pe} back=${meta.backIds.join(',')}`);
  log('scam: paints above crossed copy (scrolling down)', hits.down.length > 0 && hits.down.every((h) => h.scamOnTop), `${hits.down.length} overlaps · ${texts.join(' | ')}`);
  log('scam: paints above crossed copy (reverse)', hits.up.length > 0 && hits.up.every((h) => h.scamOnTop), `${hits.up.length} overlaps`);
  log('scam: no console errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

/* ------------------------------------- hero fits short laptop viewports */
for (const [w, h] of [[1440, 900], [1366, 768], [1280, 720], [1920, 1080], [1920, 1200], [2560, 1440]]) {
  const { ctx, page, errors } = await open(w, { viewport: { width: w, height: h }, reducedMotion: 'reduce' });
  const r = await page.evaluate(() => {
    const nav = document.querySelector('.nav__bar').getBoundingClientRect();
    const boxes = ['bill', 'doc', 'gmail', 'sms', 'scam', 'chart'].map((id) => document.querySelector(`[data-flight-from="${id}"]`).getBoundingClientRect());
    const cta = document.querySelector('.hero__cta').getBoundingClientRect();
    return {
      top: Math.round(Math.min(...boxes.map((b) => b.top))),
      bottom: Math.round(Math.max(...boxes.map((b) => b.bottom))),
      left: Math.round(Math.min(...boxes.map((b) => b.left))),
      right: Math.round(Math.max(...boxes.map((b) => b.right))),
      nav: Math.round(nav.bottom),
      cta: Math.round(cta.bottom),
      title: parseFloat(getComputedStyle(document.querySelector('.hero__title')).fontSize),
    };
  });
  log(
    `hero @${w}×${h}: copy, CTA and all six icons in the first screen`,
    r.top >= r.nav && r.bottom <= h && r.left >= 0 && r.right <= w && r.cta <= h && r.title >= 40,
    JSON.stringify(r),
  );
  if (w === 1366) await page.screenshot({ path: `${out}/hero-1366x768.png` });
  log(`hero @${w}×${h}: no console errors`, errors.length === 0, errors.join(' | '));
  await ctx.close();
}

/* ---------------------------------------------- early-access dialog + route */
{
  const { ctx, page, errors } = await open(1440);
  const stack = await page.evaluate(() => [...document.querySelectorAll('.stack__layer')].map((l) => `${getComputedStyle(l).position}|${getComputedStyle(l).boxShadow === 'none' ? 'none' : 'shadow'}|${getComputedStyle(l).clipPath}`));
  log('stack (motion on): upper edge shadow kept, clipped so nothing falls below Benefits', stack[1].includes('shadow|inset(-64px 0px 0px') && stack[2].includes('shadow|inset(-64px 0px 0px') && stack[2].startsWith('relative'), stack.join(' · '));
  // Dotted hero arcs: very slow, linear rotation of the arc wrappers only.
  const arcAngle = () =>
    page.evaluate(() =>
      [...document.querySelectorAll('[data-hero-arc]')].map((e) => {
        const m = new DOMMatrix(getComputedStyle(e).transform);
        return (Math.atan2(m.b, m.a) * 180) / Math.PI;
      }),
    );
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(2500);
  const r0 = await arcAngle();
  await page.waitForTimeout(2000);
  const r1 = await arcAngle();
  const rate = (r1[0] - r0[0]) / 2;
  const arcsOnly = await page.evaluate(() => ({
    parents: [...document.querySelectorAll('.hero__arc > span')].map((e) => getComputedStyle(e).rotate),
    inFlight: [...document.querySelectorAll('[data-hero-arc]')].some((e) => e.closest('.flight-layer, .hero__content')),
    pe: getComputedStyle(document.querySelector('.hero__card')).pointerEvents,
  }));
  log('hero arcs rotate ~112 s per turn (100 + 12%), only the arc wrappers (Figma tilt kept)', r0.length === 2 && rate > 2.9 && rate < 3.5 && arcsOnly.parents.join() === '-60deg,-120deg' && !arcsOnly.inFlight, `${rate.toFixed(2)}°/s ${JSON.stringify(arcsOnly)}`);
  const triggers = await page.evaluate(() => [...document.querySelectorAll('[aria-haspopup="dialog"]')].map((e) => `${e.tagName}:${e.textContent.trim()}`));
  const early = triggers.filter((t) => /^BUTTON:Get early access$/i.test(t));
  log('every Get Early Access control is a dialog button (nav ×2, hero, final CTA, footer)', early.length === 5, triggers.join(' | '));
  log('pricing "Ask about plans" is an active dialog button (no link)', triggers.includes('BUTTON:Ask about plans'), triggers.join(' | '));
  log('landing "Partner with Kinage" is a dialog button (partnership mode)', triggers.includes('BUTTON:Partner with Kinage'), triggers.join(' | '));
  await page.evaluate(() => window.scrollTo(0, document.querySelector('.advisors').getBoundingClientRect().top + scrollY - 100));
  await page.waitForTimeout(1500);
  await page.click('.advisors__btn');
  await page.waitForTimeout(400);
  const pm = await page.evaluate(() => ({
    title: document.querySelector('.ea__title').textContent,
    intro: document.querySelector('.ea__intro').textContent,
    ph: document.querySelector('[name="message"]').placeholder,
    submit: document.querySelector('.ea__submit').textContent,
    fields: [...document.querySelectorAll('.ea__form [name]')].map((e) => e.name).join(','),
  }));
  log(
    'Partner with Kinage: partnership mode ("Partner with Kinage", "Tell us how you’d like to work together.", placeholder, "Send inquiry")',
    pm.title === 'Partner with Kinage' && pm.intro === 'Tell us how you’d like to work together.' && pm.ph === 'I’d like to learn more about partnering with Kinage.' && pm.submit === 'Send inquiry' && pm.fields === 'firstName,lastName,email,message',
    JSON.stringify(pm),
  );
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  const pmBack = await page.evaluate(() => document.activeElement.className);
  log('partnership dialog: Esc closes, focus back on its button', pmBack.includes('advisors__btn'), pmBack);
  await page.evaluate(() => window.scrollTo(0, document.querySelector('.final-cta').getBoundingClientRect().top + scrollY - 100));
  await page.waitForTimeout(1500);
  await page.click('.final-cta__primary');
  await page.waitForTimeout(400);
  // Measured once the dialog is open (a click may first scroll its target into view).
  const y0 = await page.evaluate(() => Math.round(scrollY));
  const opened = await page.evaluate(() => ({ open: document.querySelector('dialog.ea').open, focus: document.activeElement.name, locked: document.documentElement.classList.contains('is-scroll-locked') }));
  await page.mouse.wheel(0, 700);
  await page.waitForTimeout(400);
  const moved = (await page.evaluate(() => Math.round(scrollY))) - y0;
  log('dialog opens, focuses the first field, page scroll is locked', opened.open && opened.focus === 'firstName' && opened.locked && moved === 0, `${JSON.stringify(opened)} moved ${moved}`);
  await page.click('.ea__submit');
  await page.waitForTimeout(150);
  const empty = await page.evaluate(() => ({ n: document.querySelectorAll('.ea__error').length, focus: document.activeElement.name, desc: document.querySelector('[name="email"]').getAttribute('aria-describedby') }));
  log('empty submit: three labelled errors, focus on the first invalid field', empty.n === 3 && empty.focus === 'firstName' && !!empty.desc, JSON.stringify(empty));
  await page.fill('[name="firstName"]', 'Dana');
  await page.fill('[name="lastName"]', 'Okonjo');
  await page.fill('[name="email"]', 'dana@example.com');
  await page.click('.ea__submit');
  await page.waitForTimeout(400);
  const res = await page.evaluate(() => ({ alert: document.querySelector('.ea__alert')?.getAttribute('role'), done: !!document.querySelector('.ea__done') }));
  log('no endpoint configured: honest failure message, never a fake success', res.alert === 'alert' && !res.done, JSON.stringify(res));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  const closed = await page.evaluate(() => ({ open: document.querySelector('dialog.ea').open, focus: document.activeElement.className, locked: document.documentElement.classList.contains('is-scroll-locked'), y: Math.round(scrollY) }));
  log('Esc closes, focus returns to the opener, scroll position unchanged', !closed.open && closed.focus.includes('final-cta__primary') && !closed.locked && closed.y === y0, JSON.stringify(closed));

  // Plans inquiry mode: same dialog, own copy, required question, no leak into early access.
  await page.evaluate(() => window.scrollTo(0, document.querySelector('.pricing').getBoundingClientRect().top + scrollY - 200));
  await page.waitForTimeout(1500);
  await page.click('.pricing__cta');
  await page.waitForTimeout(400);
  const plans = await page.evaluate(() => ({
    title: document.querySelector('.ea__title').textContent,
    intro: document.querySelector('.ea__intro').textContent,
    label: document.querySelector('label[for$="-message"]').textContent.trim(),
    required: document.querySelector('[name="message"]').required,
    submit: document.querySelector('.ea__submit').textContent,
    fields: [...document.querySelectorAll('.ea__form [name]')].map((e) => e.name).join(','),
  }));
  log(
    'Ask about plans: "Ask about our plans", subscriptions copy, required "Your question", "Send question"',
    plans.title === 'Ask about our plans' && plans.intro === 'Have a question about subscriptions? Send us a message.' && plans.label === 'Your question' && plans.required && plans.submit === 'Send question' && plans.fields === 'firstName,lastName,email,message',
    JSON.stringify(plans),
  );
  await page.fill('[name="firstName"]', 'Dana');
  await page.fill('[name="lastName"]', 'Okonjo');
  await page.fill('[name="email"]', 'dana@example.com');
  await page.click('.ea__submit');
  await page.waitForTimeout(200);
  const q = await page.evaluate(() => ({ err: document.querySelector('[id$="-message-error"]')?.textContent, focus: document.activeElement.name }));
  log('plans inquiry: the question is required (error + focus)', q.err === 'Please enter your question.' && q.focus === 'message', JSON.stringify(q));
  await page.fill('[name="message"]', 'Do you offer a family plan?');
  await page.click('.ea__submit');
  await page.waitForTimeout(400);
  const qs = await page.evaluate(() => ({ alert: document.querySelector('.ea__alert')?.textContent ?? '', done: !!document.querySelector('.ea__done') }));
  log('plans inquiry without an endpoint: honest failure, no fake "sent"', qs.alert.includes('question') && !qs.done, qs.alert);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  const focusBack = await page.evaluate(() => document.activeElement.className);
  await page.click('.nav__cta');
  await page.waitForTimeout(400);
  const ea = await page.evaluate(() => ({ title: document.querySelector('.ea__title').textContent, msg: document.querySelector('[name="message"]').value, req: document.querySelector('[name="message"]').required, errs: document.querySelectorAll('.ea__error').length, alert: !!document.querySelector('.ea__alert') }));
  log('switching back to Get Early Access: original mode, no leaked question, errors or result', focusBack.includes('pricing__cta') && ea.title === 'Get early access' && ea.msg === '' && !ea.req && ea.errs === 0 && !ea.alert, `${focusBack} ${JSON.stringify(ea)}`);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // Our Story route: nav link → page, Back restores the landing position, section link returns home.
  await page.evaluate(() => window.scrollTo(0, 2400));
  await page.waitForTimeout(900);
  const yLanding = await page.evaluate(() => Math.round(scrollY));
  await page.evaluate(() => document.querySelector('.nav').removeAttribute('data-hidden'));
  await page.waitForTimeout(600);
  await page.click('.nav__link[href="/our-story"]');
  await page.waitForTimeout(900);
  const story = await page.evaluate(() => {
    const name = document.querySelector('.story__signature-name');
    const role = document.querySelector('.story__signature-role');
    const rules = [...document.querySelectorAll('.story *')].filter((e) => ['borderTopWidth', 'borderBottomWidth'].some((k) => parseFloat(getComputedStyle(e)[k]) > 0) || e.tagName === 'HR');
    return {
      path: location.pathname,
      y: Math.round(scrollY),
      photoLast: document.querySelector('.story__chapters .story__column').lastElementChild.classList.contains('story__portrait'),
      name: name?.textContent,
      nameWeight: name && getComputedStyle(name).fontWeight,
      nameSize: name && parseFloat(getComputedStyle(name).fontSize),
      role: role?.textContent,
      roleSize: role && parseFloat(getComputedStyle(role).fontSize),
      twoLines: name && role && role.getBoundingClientRect().top >= name.getBoundingClientRect().bottom - 1,
      rules: rules.map((e) => e.className),
      current: document.querySelector('[aria-current="page"]')?.textContent,
    };
  });
  log(
    'Our Story: /our-story, no dividers, ends with Ben’s photo over "Ben Terk" (700, larger) / "Founder of Kinage"',
    story.path === '/our-story' && story.y === 0 && story.photoLast && story.name === 'Ben Terk' && story.nameWeight === '700' && story.role === 'Founder of Kinage' && story.nameSize > story.roleSize && story.twoLines && story.rules.length === 0 && story.current === 'Our Story',
    JSON.stringify(story),
  );
  await page.screenshot({ path: `${out}/our-story.png` });
  await page.goBack();
  await page.waitForTimeout(1200);
  const back = await page.evaluate(() => ({ path: location.pathname, y: Math.round(scrollY), flying: document.querySelector('.flight-zone').classList.contains('is-flying') }));
  log('Back returns to the landing at the same position, animations re-initialised', back.path === '/' && Math.abs(back.y - yLanding) < 4 && back.flying, `${JSON.stringify(back)} (was ${yLanding})`);
  await page.goForward();
  await page.waitForTimeout(900);
  await page.click('.nav__link[href="/#how-it-works"]');
  await page.waitForTimeout(1200);
  const sec = await page.evaluate(() => ({ url: location.pathname + location.hash, top: Math.round(document.getElementById('how-it-works').getBoundingClientRect().top) }));
  log('section link from Our Story lands on that landing section', sec.url === '/#how-it-works' && sec.top >= 0 && sec.top <= 120, JSON.stringify(sec));
  await page.goto(url.replace(/\/$/, '') + '/our-story', { waitUntil: 'networkidle' });
  const direct = await page.evaluate(() => ({ h1: document.querySelector('h1')?.textContent, cta: !!document.querySelector('.story__cta[aria-haspopup="dialog"]') }));
  log('direct load of /our-story works, dialog available there', direct.h1 === 'Why I built this' && direct.cta, JSON.stringify(direct));
  log('dialog + route: no console errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

/* --------------------------------------- static checks at every breakpoint */
for (const width of [1920, 1440, 1024, 768, 390]) {
  const { ctx, page, errors } = await open(width, { reducedMotion: 'reduce' });
  const r = await page.evaluate(() => {
    const px = (v) => Math.round(parseFloat(v));
    const cs = (sel) => getComputedStyle(document.querySelector(sel));
    const sections = [...document.querySelectorAll('main section')]
      .filter((s, i, a) => a.indexOf(s) === i)
      .map((s) => {
        // The final CTA pads its inner (the texture fills the section edge to edge).
        const p = getComputedStyle(s.querySelector(':scope > .final-cta__inner') ?? s);
        return { id: s.className.split(' ')[0], top: px(p.paddingTop), bottom: px(p.paddingBottom), h: Math.round(s.getBoundingClientRect().height), bg: getComputedStyle(s).backgroundColor };
      });
    const card = (sel) => {
      const c = cs(sel);
      return { bg: c.backgroundColor, radius: c.borderRadius, shadow: c.boxShadow, pad: c.padding, border: c.borderTopWidth };
    };
    const stats = [...document.querySelectorAll('.stat')];
    const headings = [...document.querySelectorAll('h1, h2, h3')].map((h) => h.textContent.replace(/\s+/g, ' ').trim());
    const label = document.querySelector('.founder__label .eyebrow').getBoundingClientRect();
    const copy = document.querySelector('.founder__copy').getBoundingClientRect();
    const byline = document.querySelector('.founder__byline');
    const lead = document.querySelectorAll('.hero__lead');
    const activeCard = document.querySelector('.carousel__stage > .quote-card[data-offset="0"]');
    const sideCard = document.querySelector('.carousel__stage > .quote-card[data-offset="1"]').getBoundingClientRect();
    const quote = activeCard.querySelector('.quote-card__text');
    const qcs = getComputedStyle(quote);
    const footerLogo = document.querySelector('.footer .brand__logo');
    const navLogo = document.querySelector('.nav .brand__logo');
    const phoneHeader = getComputedStyle(document.querySelector('.pm__header'));
    const favicons = [...document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]')].map((l) => l.getAttribute('href'));
    const panel = document.querySelector('.phone-demo').getBoundingClientRect();
    const phoneBox = document.querySelector('.phone').getBoundingClientRect();
    const screenBox = document.querySelector('.phone__screen').getBoundingClientRect();
    const cta = document.querySelector('.final-cta').getBoundingClientRect();
    const ctaTexture = document.querySelector('.final-cta__texture').getBoundingClientRect();
    const pricingInner = document.querySelector('.pricing__inner').getBoundingClientRect();
    const house = document.querySelector('.pricing__household').getBoundingClientRect();
    const copyRight = Math.max(...[...document.querySelectorAll('.pricing__copy > *')].map((e) => e.getBoundingClientRect().right));
    const copyBottom = document.querySelector('.pricing__copy').getBoundingClientRect().bottom;
    // "one dashboard." (roadmap step 4) must sit on one line.
    const step4 = [...document.querySelectorAll('.step')][3]?.querySelector('p:last-of-type, .step__body');
    let oneLine = null;
    if (step4) {
      const node = [...step4.childNodes].find((n) => n.nodeType === 3 && n.textContent.includes('dashboard'));
      const i = node.textContent.indexOf('one');
      const range = document.createRange();
      range.setStart(node, i);
      range.setEnd(node, node.textContent.length);
      oneLine = new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size === 1;
    }
    const hero = getComputedStyle(document.querySelector('.hero__card'));
    const toggle = getComputedStyle(document.querySelector('.faq__toggle'));
    const plans = document.querySelector('.pricing__cta');
    return {
      surfaces: {
        hero: hero.backgroundColor,
        heroStage: getComputedStyle(document.querySelector('.hero')).backgroundColor,
        heroTail: parseFloat(getComputedStyle(document.querySelector('.flight-zone')).getPropertyValue('--hero-tail')),
        heroRadius: hero.borderTopLeftRadius,
        heroShadow: hero.boxShadow,
        mock: getComputedStyle(document.querySelector('.phone__screen')).backgroundImage.includes('248, 247, 241') ? 'rgb(248, 247, 241)' : getComputedStyle(document.querySelector('.phone__screen')).backgroundImage,
        panel: getComputedStyle(document.querySelector('.advisors__panel')).backgroundColor,
      },
      oneLine,
      byline: byline.textContent,
      toggle: { bg: toggle.backgroundColor, border: toggle.borderTopStyle, glyph: getComputedStyle(document.querySelector('.faq__toggle svg')).stroke },
      stackClip: [...document.querySelectorAll('.stack__layer')].map((l) => `${getComputedStyle(l).boxShadow === 'none' ? 'no-shadow' : 'shadow'}|${getComputedStyle(l).clipPath}`),
      plans: { tag: plans.tagName, disabled: plans.disabled, href: plans.getAttribute('href'), text: plans.textContent.trim(), popup: plans.getAttribute('aria-haspopup') },
      tokens: { hero: getComputedStyle(document.documentElement).getPropertyValue('--shadow-hero').trim(), nav: getComputedStyle(document.documentElement).getPropertyValue('--shadow-nav').trim() },
      navShadow: getComputedStyle(document.querySelector('.nav__bar')).boxShadow,
      navBg: getComputedStyle(document.querySelector('.nav__bar')).backgroundColor,
      benefitRadius: getComputedStyle(document.querySelector('.benefit')).borderTopLeftRadius,
      advisorsRadius: ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'].map((k) => getComputedStyle(document.querySelector('.advisors__panel'))[k]),
      trustShadow: getComputedStyle(document.querySelector('.trust-card')).boxShadow,
      trustRadius: getComputedStyle(document.querySelector('.trust-card')).borderTopLeftRadius,
      cards: [...document.querySelectorAll('.carousel__stage > .quote-card')].map((c) => {
        const cs = getComputedStyle(c);
        const scale = new DOMMatrix(cs.transform).a;
        const radii = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'].map((k) => +(parseFloat(cs[k]) * scale).toFixed(2));
        const m = cs.boxShadow.match(/rgba?\([^)]*\)\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px/);
        return { off: c.dataset.offset, radii, color: cs.boxShadow.match(/rgba?\([^)]*\)/)?.[0], y: m ? +(parseFloat(m[2]) * scale).toFixed(2) : null, blur: m ? +(parseFloat(m[3]) * scale).toFixed(2) : null, border: cs.borderTopWidth };
      }),
      heroTitle: getComputedStyle(document.querySelector('.hero__title')).color,
      overflow: document.documentElement.scrollWidth - innerWidth,
      sections,
      trust: card('.trust-card'),
      stat: card('.stat'),
      statScroll: stats.some((s) => s.scrollHeight > s.clientHeight + 1 || /auto|scroll/.test(getComputedStyle(s).overflowY)),
      headingsWithPeriod: headings.filter((h) => /\.$/.test(h)),
      draftLabel: /draft answer/i.test(document.body.innerText),
      founder: { labelLeft: Math.round(label.left), copyLeft: Math.round(copy.left), dash: /—|–/.test(byline.textContent), weight: getComputedStyle(byline).fontWeight },
      hero: [...lead].map((p) => getComputedStyle(p).fontWeight).join('/'),
      quote: { size: qcs.fontSize, line: qcs.lineHeight, ratio: +(parseFloat(qcs.lineHeight) / parseFloat(qcs.fontSize)).toFixed(3), pad: getComputedStyle(activeCard).padding, side: [+sideCard.width.toFixed(1), +sideCard.height.toFixed(1)] },
      footer: { src: footerLogo?.getAttribute('src') ?? '', filter: getComputedStyle(footerLogo).filter },
      navLogo: { src: navLogo?.getAttribute('src') ?? '', w: navLogo?.getBoundingClientRect().width, cssMark: !!document.querySelector('.brand__mark'), filter: navLogo && getComputedStyle(navLogo).filter },
      phoneCorner: phoneHeader.borderBottomRightRadius,
      phoneFill: { clip: getComputedStyle(document.querySelector('.pm__header'), '::before').clipPath.startsWith('path('), notch: !!document.querySelector('.pm__notch') },
      // Letter spacing by role (pass 8): em of each element's own size.
      tracking: Object.fromEntries(
        Object.entries({ h1: '.hero__title', h2: '.section-title', title: '.problem-card__title', text: '.section-lead', lead: '.hero__lead', control: '.nav__cta', nav: '.nav__link', small: '.step__body', caption: '.stat__label', footer: '.footer__link', eyebrow: '.eyebrow', balance: '.pm__balance-value' }).map(([k, sel]) => {
          const c = getComputedStyle(document.querySelector(sel));
          const ls = c.letterSpacing === 'normal' ? 0 : parseFloat(c.letterSpacing);
          return [k, k === 'eyebrow' || k === 'balance' ? ls : +(ls / parseFloat(c.fontSize)).toFixed(4)];
        }),
      ),
      favicons,
      eyebrowTop: document.querySelector('.problems__head .eyebrow').getBoundingClientRect().top + scrollY,
      vh: innerHeight,
      demo: {
        panel: [+panel.width.toFixed(1), +panel.height.toFixed(1)],
        phone: [+phoneBox.width.toFixed(1), +phoneBox.height.toFixed(1)],
        screen: +screenBox.width.toFixed(1),
        overlap: +(panel.top - phoneBox.top).toFixed(1),
        fits: phoneBox.left >= 0 && phoneBox.right <= innerWidth && phoneBox.bottom <= panel.bottom,
        old: !!document.querySelector('.mock, .demo__viewport, .demo__replay'),
      },
      ctaCover: ctaTexture.top <= cta.top + 0.5 && ctaTexture.bottom >= cta.bottom - 0.5 && ctaTexture.left <= cta.left + 0.5 && ctaTexture.right >= cta.right - 0.5,
      pricing: { left: Math.round(house.left - pricingInner.left), top: Math.round(house.top - pricingInner.top), centre: Math.round(house.top + house.height / 2 - (pricingInner.top + pricingInner.height / 2)), w: Math.round(house.width), copyClear: copyRight <= house.left + 1 || house.top >= copyBottom - 1 },
    };
  });
  const tag = `@${width}`;
  log(`${tag} no horizontal overflow`, r.overflow <= 0, r.overflow);
  // Base rhythm + the one shared extra (30 / 22 / 16).
  const exp = width >= 1200 ? [150, 102] : width >= 768 ? [110, 78] : [80, 56];
  const feature = width >= 1200 ? 182 : width >= 768 ? 134 : 96;
  const sec = Object.fromEntries(r.sections.map((x) => [x.id, x]));
  // Hero, problems (flight zone), pricing (own 64px banner padding) keep their Figma spacing;
  // testimonials have their own feature spacing; advisors + founder share 576px on desktop.
  // Sound Familiar (problems) follows the rhythm since pass 5, minus the lavender the
  // reversed hero carries below its composition (pass 9, --hero-tail); the founder adds its extra room.
  const own = ['hero', 'problems', 'pricing', 'testimonials', 'founder', ...(width >= 1200 ? ['advisors'] : [])];
  const ruled = r.sections.filter((x) => !own.includes(x.id));
  const bad = ruled.filter((x) => !exp.includes(x.top) || x.bottom !== exp[0]);
  log(`${tag} section rhythm ${exp[0]} (join ${exp[1]})`, bad.length === 0, ruled.map((x) => `${x.id} ${x.top}/${x.bottom}`).join(' · '));
  const tail = width >= 1200 ? 72 : width >= 768 ? 48 : 24;
  log(`${tag} Sound Familiar: rhythm minus the hero's ${tail}px lavender tail on top (card-to-heading distance unchanged)`, r.surfaces.heroTail === tail && sec.problems.top === exp[0] - tail && sec.problems.bottom === exp[0], `${sec.problems.top}/${sec.problems.bottom} tail ${r.surfaces.heroTail}`);
  log(`${tag} testimonials padding ${feature} (more than the rhythm)`, sec.testimonials.top === feature && sec.testimonials.bottom === feature, `${sec.testimonials.top}/${sec.testimonials.bottom}`);
  const roomy = width >= 1200 ? 28 : width >= 768 ? 22 : 16;
  if (width < 1200) log(`${tag} founder: rhythm + ${roomy}px extra room`, sec.founder.top === exp[1] + roomy && sec.founder.bottom === exp[0] + roomy, `${sec.founder.top}/${sec.founder.bottom}`);
  if (width >= 1200) log(`${tag} advisors and founder equal, grown together by the extra room (≈693)`, sec.advisors.h === sec.founder.h && sec.advisors.h >= 690 && sec.advisors.h <= 696 && sec.advisors.top === 140, `${sec.advisors.h} / ${sec.founder.h} · padding ${sec.advisors.top}`);
  else log(`${tag} advisors and founder grow with content`, sec.advisors.h > 300 && sec.founder.h > 300, `${sec.advisors.h} / ${sec.founder.h}`);
  const WHITE = 'rgb(255, 255, 255)';
  const CREAM = 'rgb(251, 246, 239)';
  const LAVENDER = 'rgb(241, 236, 249)';
  log(
    `${tag} surfaces: hero lavender (#f1ecf9) with a white card; what/advisors/trust/FAQ cream; problems/testimonials/stats white; phone UI keeps its own canvas`,
    r.surfaces.heroStage === LAVENDER && r.surfaces.hero === WHITE && sec.what.bg === CREAM && r.surfaces.panel === CREAM && sec.trust.bg === CREAM && sec.faq.bg === CREAM &&
      sec.problems.bg === WHITE && sec.testimonials.bg === WHITE && sec.stats.bg === WHITE && r.surfaces.mock === 'rgb(248, 247, 241)',
    `hero ${r.surfaces.heroStage} card ${r.surfaces.hero} faq ${sec.faq.bg} stats ${sec.stats.bg} mock ${r.surfaces.mock}`,
  );
  log(`${tag} hero card: 28 radius, soft cool-neutral shadow (token, no long halo or purple glow), eggplant heading`, r.tokens.hero.includes('52, 40, 66') && !r.surfaces.heroShadow.includes('30.2px') && !/\b(4[0-9]|[5-9][0-9])px/.test(r.tokens.hero) && r.heroTitle === 'rgb(106, 57, 106)' && (width < 768 || r.surfaces.heroRadius === '28px' || parseFloat(r.surfaces.heroRadius) >= 20), `${r.surfaces.heroRadius} ${r.surfaces.heroShadow}`);
  log(`${tag} nav: 80% fill kept, short neutral shadow (no purple haze)`, r.navBg === 'rgba(255, 255, 255, 0.8)' && !r.navShadow.includes('115, 65, 116') && !r.navShadow.includes('41.9px'), r.navShadow);
  log(`${tag} advisors panel: What You Get card radius on all four corners`, r.advisorsRadius.every((x) => x === r.benefitRadius), `${r.advisorsRadius.join(' ')} vs ${r.benefitRadius}`);
  log(`${tag} founder attribution "Ben Terk, Founder of Kinage"`, r.byline === 'Ben Terk, Founder of Kinage', r.byline);
  log(`${tag} roadmap step 4: "one dashboard." on one line`, r.oneLine === true, String(r.oneLine));
  log(`${tag} FAQ toggle: lilac disc, no outline, eggplant glyph`, r.toggle.bg === 'rgb(243, 236, 250)' && r.toggle.border === 'none' && r.toggle.glyph === 'rgb(106, 57, 106)', JSON.stringify(r.toggle));
  log(`${tag} pricing CTA "Ask about plans": active dialog button`, r.plans.tag === 'BUTTON' && !r.plans.disabled && r.plans.href === null && r.plans.text === 'Ask about plans' && r.plans.popup === 'dialog', JSON.stringify(r.plans));
  log(`${tag} stack: no edge shadow spills below (reduced motion: no shadow at all)`, r.stackClip.every((c) => c.startsWith('no-shadow') || c.includes('inset(-64px 0px 0px')), r.stackClip.join(' | '));
  log(`${tag} stats cards = trust-card surface, no inner scroll`, JSON.stringify(r.trust) === JSON.stringify(r.stat) && r.stat.border === '0px' && !r.statScroll, `${r.stat.bg} r${r.stat.radius} p${r.stat.pad}`);
  log(`${tag} no heading ends with a period`, r.headingsWithPeriod.length === 0, r.headingsWithPeriod.join(' | '));
  log(`${tag} no visible “Draft answer” label`, !r.draftLabel);
  log(`${tag} founder label aligned to copy, byline 500 without dash`, (width < 768 || r.founder.labelLeft === r.founder.copyLeft) && !r.founder.dash && r.founder.weight === '500', JSON.stringify(r.founder));
  log(`${tag} hero paragraph 300 / 500`, r.hero === '300/500', r.hero);
  log(`${tag} testimonial line-height 1.2, roomier card padding`, r.quote.ratio === 1.2 && (width >= 1024 ? r.quote.pad === '40px 28px' : r.quote.pad === '32px 24px'), JSON.stringify(r.quote));
  if (width >= 1200) log(`${tag} side testimonial card 294.9 wide (Figma 583:952), taller than Figma's 101 (more air)`, near(r.quote.side[0], 294.9, 0.6) && r.quote.side[1] >= 120, r.quote.side.join(' × '));
  {
    const trustR = parseFloat(r.trustRadius);
    const tm = r.trustShadow.match(/rgba?\([^)]*\)\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px/);
    const tColor = r.trustShadow.match(/rgba?\([^)]*\)/)?.[0];
    const visible = r.cards.filter((c) => width >= 768 || c.off === '0');
    const ok = visible.every((c) => c.radii.every((x) => near(x, trustR, 0.3)) && c.color === tColor && near(c.y, parseFloat(tm[2]), 0.3) && near(c.blur, parseFloat(tm[3]), 0.3) && c.border === '0px');
    log(`${tag} testimonial cards render the Trust card surface: equal ${trustR}px corners, same shadow, no border`, ok, JSON.stringify(visible));
  }
  log(`${tag} logo: nav = canonical SVG (no CSS mark), footer = its generated white variant, no filters`, /kinage-logo\.svg/.test(r.navLogo.src) && /kinage-logo-inverse/.test(r.footer.src) && !r.navLogo.cssMark && r.footer.filter === 'none' && r.navLogo.filter === 'none', `${r.navLogo.src.split('/').pop()} · ${r.footer.src.split('/').pop()}`);
  log(`${tag} favicon links: generated SVG + PNG fallbacks (cache-busted)`, r.favicons.some((h) => /favicon\.svg\?v=/.test(h)) && r.favicons.some((h) => /favicon-32\.png/.test(h)) && r.favicons.some((h) => /apple-touch-icon/.test(h)), r.favicons.join(' '));
  log(`${tag} phone header: one purple shape with the corner cut out (clip-path), no patch over it, square corner (no dark seam)`, r.phoneCorner === '0px' && r.phoneFill.clip && !r.phoneFill.notch, `${r.phoneCorner} ${JSON.stringify(r.phoneFill)}`);
  {
    const t = r.tracking;
    log(`${tag} letter spacing by role: headings 0, titles .005em, text .01em, controls .012em, small .015em, eyebrow 1.5px, phone balance -0.38px`,
      t.h1 === 0 && t.h2 === 0 && t.title === 0.005 && t.text === 0.01 && t.lead === 0.01 && t.control === 0.012 && t.nav === 0.012 && t.small === 0.015 && t.caption === 0.015 && t.footer === 0.015 && t.eyebrow === 1.5 && t.balance === -0.38,
      JSON.stringify(t));
  }
  if (width >= 1200) log(`${tag} Sound Familiar starts below the first screen`, r.eyebrowTop > r.vh, `eyebrow ${Math.round(r.eyebrowTop)} vs viewport ${r.vh}`);
  if (width >= 1200) {
    log(`${tag} phone (Figma 596:1995): panel 489 × 409, phone 217.8 × 445.7, screen 195.8, projects 62.3 above; old desktop demo gone`, near(r.demo.panel[0], 489, 0.6) && near(r.demo.panel[1], 409, 0.6) && near(r.demo.phone[0], 217.8, 0.6) && near(r.demo.phone[1], 445.7, 0.8) && near(r.demo.screen, 195.8, 0.6) && near(r.demo.overlap, 62.3, 0.6) && r.demo.fits && !r.demo.old, JSON.stringify(r.demo));
    log(`${tag} pricing household at x 776, 424 wide, centred on the (taller) band`, near(r.pricing.left, 776) && near(r.pricing.centre, 0, 1.5) && near(r.pricing.w, 424) && r.pricing.copyClear, JSON.stringify(r.pricing));
  } else {
    log(`${tag} phone + pricing fit (phone whole, inside the viewport, over its panel)`, r.demo.fits && r.demo.overlap > 30 && !r.demo.old && r.pricing.copyClear, `${JSON.stringify(r.demo)} ${JSON.stringify(r.pricing)}`);
  }
  log(`${tag} final CTA texture covers the whole section (incl. padding)`, r.ctaCover, String(r.ctaCover));
  log(`${tag} no console errors`, errors.length === 0, errors.join(' | '));
  await ctx.close();
}

/* ------------------------------------------ /advisors page (source content) */
{
  const { ctx, page, errors } = await open(1440);
  await page.click('.nav__link[href="/advisors"]').catch(async () => {
    await page.evaluate(() => document.querySelector('.nav').removeAttribute('data-hidden'));
    await page.click('.nav__link[href="/advisors"]');
  });
  await page.waitForTimeout(900);
  const a = await page.evaluate(() => ({
    path: location.pathname,
    h1: document.querySelector('h1')?.textContent,
    h2: [...document.querySelectorAll('.adv h2')].map((h) => h.textContent),
    cards: document.querySelectorAll('.adv__card.surface-card').length,
    points: document.querySelectorAll('.adv__point').length,
    current: document.querySelector('[aria-current="page"]')?.textContent,
    partner: document.querySelectorAll('.adv [aria-haspopup="dialog"]').length,
    sourceLinks: [...document.querySelectorAll('a')].filter((e) => /kinage-site|file:/.test(e.getAttribute('href') ?? '')).length,
    iframes: document.querySelectorAll('iframe').length,
    trailing: [...document.querySelectorAll('.adv h1, .adv h2, .adv h3')].filter((h) => /\.$/.test(h.textContent.trim())).length,
  }));
  log(
    '/advisors: source headings in order, 6 cards, 4 setup points, Partner CTAs, no source link/iframe, no trailing periods',
    a.path === '/advisors' && a.h1 === 'Fewer surprises across your book, and a record of who did what' && a.h2.join('|') === 'You are accountable for households you cannot see into|Visibility you did not have to assemble|Your client connects an email and an account. That is the whole setup|Built to sit inside how you already work|Bring Kinage to one household first' && a.cards === 6 && a.points === 4 && a.current === 'For Advisors' && a.partner === 2 && a.sourceLinks === 0 && a.iframes === 0 && a.trailing === 0,
    JSON.stringify(a),
  );
  await page.reload({ waitUntil: 'networkidle' });
  const reloaded = await page.evaluate(() => document.querySelector('h1')?.textContent);
  await page.goBack();
  await page.waitForTimeout(1000);
  const backPath = await page.evaluate(() => location.pathname);
  log('/advisors: direct reload works, Back returns to the landing', reloaded === a.h1 && backPath === '/', `${reloaded} · back → ${backPath}`);
  log('/advisors: no console errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

/* ------------------------------ hero CTA settles without a second movement */
for (const hover of [false, true]) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 }, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    window.__cta = [];
    const t0 = performance.now();
    const tick = () => {
      const el = document.querySelector('.hero__cta');
      if (el) window.__cta.push(el.getBoundingClientRect().top);
      if (performance.now() - t0 < 3500) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  if (hover) await page.mouse.move(683, 520);
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(3700);
  const d = await page.evaluate(() => window.__cta);
  const steps = d.slice(1).map((v, i) => v - d[i]);
  const up = steps.filter((x) => x < -0.01);
  const rest = await page.$eval('.hero__cta', (e) => e.getBoundingClientRect().top);
  // One eased rise: no step larger than ~2px, and nothing moves after it lands.
  const lastMove = steps.map((x, i) => (Math.abs(x) > 0.01 ? i : -1)).reduce((m, i) => Math.max(m, i), -1);
  log(
    `hero CTA @1366×768 (${hover ? 'pointer over it' : 'pointer away'}): one eased rise, no jump after the entrance`,
    Math.max(...steps.map(Math.abs)) < 2.2 && up.every((x) => x > -2.2) && Math.abs(d[lastMove + 1] - rest) < 0.2,
    `largest step ${Math.max(...steps.map(Math.abs)).toFixed(2)}px · rest ${rest.toFixed(2)}`,
  );
  await ctx.close();
}

await browser.close();
console.table(rows);
process.exitCode = rows.every((r) => r.ok) ? 0 : 1;
