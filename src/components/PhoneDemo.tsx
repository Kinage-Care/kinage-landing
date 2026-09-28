import { useLayoutEffect, useRef } from 'react';
import { DEMO_CHAT } from '../content/demo-chat';
import { useProductDemo } from '../motion/useProductDemo';
import iconMenuChevron from '../assets/figma/phone-menu-chevron.svg';
import iconMenuLines from '../assets/figma/phone-menu-lines.svg';
import iconCircleHelp from '../assets/figma/phone-circle-help.svg';
import iconAlert from '../assets/figma/phone-alert-triangle.svg';
import iconFlag from '../assets/figma/phone-flag.svg';
import iconFlag2 from '../assets/figma/phone-flag-2.svg';
import iconChevronRight from '../assets/figma/phone-chevron-right.svg';
import iconSend from '../assets/figma/phone-send.svg';
import headerQuarters from '../assets/figma/phone-header-quarters.svg';
import headerGlow from '../assets/figma/phone-header-glow.svg';
import headerArc from '../assets/figma/phone-header-arc.svg';
import './PhoneDemo.css';

type Card = { tone: 'overdue' | 'flagged'; vendor: string; date: string; amount: string; note: string };

function CardStack({ card, part }: { card: Card; part: string }) {
  return (
    <div className="pm__stack" data-demo={`${part}-stack`}>
      <span className="pm__layer pm__layer--back" data-demo-layer />
      <span className="pm__layer pm__layer--mid" data-demo-layer />
      <div className={`pm__card pm__card--${card.tone}`} data-demo-layer>
        <span className="pm__edge" />
        <div className="pm__status">
          <div className="pm__badges">
            {card.tone === 'overdue' && (
              <span className="pm__badge pm__badge--overdue">
                <img src={iconAlert} alt="" />
                Overdue
              </span>
            )}
            <span className="pm__badge pm__badge--flagged">
              <img src={card.tone === 'overdue' ? iconFlag : iconFlag2} alt="" />
              Was Flagged
            </span>
          </div>
          <img className="pm__chevron" src={iconChevronRight} alt="" />
        </div>
        <div className="pm__summary">
          <span className="pm__vendor">
            {card.vendor} <span className="pm__date">{card.date}</span>
          </span>
          <span className="pm__amount">{card.amount}</span>
        </div>
        <p className="pm__note">{card.note}</p>
      </div>
    </div>
  );
}

function Section({ part, message, card }: { part: string; message: string; card: Card }) {
  return (
    <div className="pm__section" data-demo={part}>
      <p className="pm__message" data-demo={`${part}-message`}>
        {message}
      </p>
      <CardStack card={card} part={part} />
      <p className="pm__see-all" data-demo={`${part}-more`}>
        See full list
      </p>
    </div>
  );
}

/**
 * Family Financial Oversight — the Kinage mobile home screen in a phone
 * (Figma 596:1995 panel, 601:2577 "Kinage homepage V2"), replacing the desktop
 * dashboard on every screen size.
 *
 * The screen is rebuilt in the DOM at 2 × Figma size (391.59 × 847.44) so its
 * cards, chat and composer can move independently, then scaled by one
 * transform. Geometry is in Figma px × --u, where --u = panel width / the
 * panel's Figma width (set from a ResizeObserver): the phone keeps its Figma
 * size, offset and deliberate projection above the lavender panel at any
 * width. Product UI colours are the app's own (scoped here), not landing tokens.
 * Decorative for assistive tech; `DEMO_CHAT.summary` describes it.
 */
export function PhoneDemo() {
  const rootRef = useRef<HTMLDivElement>(null);
  useProductDemo(rootRef);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const set = () => {
      const units = parseFloat(getComputedStyle(root).getPropertyValue('--panel-units')) || 489;
      root.style.setProperty('--u', String(root.clientWidth / units));
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  return (
    <figure className="phone-demo" ref={rootRef}>
      <figcaption className="sr-only">{DEMO_CHAT.summary}</figcaption>
      <div className="phone" data-demo="frame" aria-hidden="true">
        <div className="phone__screen">
          <div className="pm">
            <div className="pm__scroll" data-demo="scroll">
              <div className="pm__header" data-demo="overview">
                <img className="pm__quarters" src={headerQuarters} alt="" />
                <span className="pm__glow">
                  <span>
                    <img src={headerGlow} alt="" />
                  </span>
                </span>
                <span className="pm__arc">
                  <span>
                    <img src={headerArc} alt="" />
                  </span>
                </span>
                <span className="pm__menu-trigger">
                  <img src={iconMenuChevron} alt="" />
                </span>
                <div className="pm__intro">
                  <div className="pm__greeting-row">
                    <div className="pm__greeting">
                      <p className="pm__hello">Good morning!</p>
                      <p className="pm__hello-sub">Martha has 1 overdue bill</p>
                    </div>
                    <span className="pm__menu">
                      <img src={iconMenuLines} alt="" />
                    </span>
                  </div>
                  <div className="pm__balance">
                    <p className="pm__balance-value">$8,420.18</p>
                    <p className="pm__balance-label">
                      Estimated balance in 30 days
                      <img src={iconCircleHelp} alt="" />
                    </p>
                  </div>
                </div>
              </div>

              <div className="pm__feed">
                <Section
                  part="s1"
                  message={DEMO_CHAT.firstAlert}
                  card={{ tone: 'overdue', vendor: 'AT&T Home Internet', date: '18 Apr', amount: '$77.26', note: 'Higher than usual and overdue' }}
                />
                <div className="pm__question" data-demo="question">
                  <p className="pm__bubble">{DEMO_CHAT.question}</p>
                </div>
                <div className="pm__thinking" data-demo="thinking">
                  <span className="pm__dots">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
                <Section
                  part="s2"
                  message={DEMO_CHAT.reply}
                  card={{ tone: 'flagged', vendor: 'AT&T Mobile', date: '23 Apr', amount: '$180.26', note: 'This may not be from the real Verizon' }}
                />
              </div>
            </div>

            <div className="pm__composer">
              <div className="pm__input" data-demo="input">
                <span className="pm__placeholder" data-demo="placeholder">
                  Ask about bills, accounts, or payments...
                </span>
                <span className="pm__typed">
                  <span data-demo="typed" />
                  <span className="pm__caret" data-demo="caret">
                    <span data-demo="caret-blink" />
                  </span>
                </span>
                <span className="pm__send" data-demo="send">
                  <img src={iconSend} alt="" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
