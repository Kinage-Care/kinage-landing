import { useLayoutEffect, useRef, useState } from 'react';
import { Brand } from './Brand';
import { DEMO_CHAT } from '../content/demo-chat';
import { useProductDemo } from '../motion/useProductDemo';
import iconHome from '../assets/figma/mock-home.svg';
import iconCalendar from '../assets/figma/mock-calendar.svg';
import iconClock from '../assets/figma/mock-clock.svg';
import iconCard from '../assets/figma/mock-credit-card.svg';
import iconMail from '../assets/figma/mock-mail.svg';
import iconTransfers from '../assets/figma/mock-arrow-left-right.svg';
import iconShield from '../assets/figma/mock-shield.svg';
import iconChevronDown from '../assets/figma/mock-chevron-down.svg';
import iconHelp from '../assets/figma/mock-circle-help.svg';
import iconCaret from '../assets/figma/mock-vector.svg';
import iconAlert from '../assets/figma/mock-alert-triangle.svg';
import iconFlag from '../assets/figma/mock-flag.svg';
import iconFlag2 from '../assets/figma/mock-flag-2.svg';
import iconChevronRight from '../assets/figma/mock-chevron-right.svg';
import iconSend from '../assets/figma/mock-send-icon.svg';
import './ProductDemo.css';

/** Native size of the mockup: the Figma dashboard at 1 : 0.2941 (562:3833 × 3.4); 583:606 renders it at 513.451px. */
const MOCK_WIDTH = 1442.26;

const NAV = [
  { label: 'Home', icon: iconHome, active: true },
  { label: 'Upcoming', icon: iconCalendar, badge: '4' },
  { label: 'Past payments', icon: iconClock },
  { label: 'Accounts', icon: iconCard },
  { label: 'Email', icon: iconMail },
  { label: 'Transfers', icon: iconTransfers },
  { label: 'Trust lists', icon: iconShield },
];

function Chip() {
  return (
    <span className="mock__chip">
      <span className="brand__mark mock__chip-mark">
        <span />
        <span />
        <span />
        <span />
      </span>
    </span>
  );
}

type Card = { tone: 'overdue' | 'flagged'; vendor: string; date: string; amount: string; note: string };

function CardStack({ card, part }: { card: Card; part: string }) {
  return (
    <div className="mock__stack" data-demo={`${part}-stack`}>
      <span className="mock__layer mock__layer--back" data-demo-layer />
      <span className="mock__layer mock__layer--mid" data-demo-layer />
      <div className={`mock__card mock__card--${card.tone}`} data-demo-layer>
        <span className="mock__edge" />
        <div className="mock__status">
          <div className="mock__badges">
            {card.tone === 'overdue' && (
              <span className="mock__badge mock__badge--overdue">
                <img src={iconAlert} alt="" />
                Overdue
              </span>
            )}
            <span className="mock__badge mock__badge--flagged">
              <img src={card.tone === 'overdue' ? iconFlag : iconFlag2} alt="" />
              Was Flagged
            </span>
          </div>
          <img className="mock__chevron" src={iconChevronRight} alt="" />
        </div>
        <div className="mock__summary">
          <span className="mock__vendor">
            {card.vendor} <span className="mock__date">{card.date}</span>
          </span>
          <span className="mock__amount">{card.amount}</span>
        </div>
        <p className="mock__note">{card.note}</p>
      </div>
    </div>
  );
}

function AlertSection({ part, message, card }: { part: string; message: string; card: Card }) {
  return (
    <div className="mock__section" data-demo={part}>
      <div className="mock__rail" data-demo={`${part}-rail`}>
        <Chip />
        <span className="mock__rail-line" />
      </div>
      <div className="mock__content">
        <p className="mock__message" data-demo={`${part}-message`}>
          {message}
        </p>
        <CardStack card={card} part={part} />
        <p className="mock__see-all" data-demo={`${part}-more`}>
          See full list
        </p>
      </div>
    </div>
  );
}

/**
 * The Kinage dashboard from Figma, rebuilt in the DOM at native scale so the
 * chat, messages and card stacks can move independently. The local SVG export
 * could not serve as a base: its text is outlined, feed items are not grouped,
 * and its proportions differ from the Figma frame (1440 × 900 vs 1442 × 998).
 *
 * The whole mockup is scaled down with one transform to its Figma size.
 * It is decorative for assistive tech; `DEMO_CHAT.summary` describes it.
 */
export function ProductDemo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(513.451 / MOCK_WIDTH);
  useProductDemo(rootRef);

  useLayoutEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / MOCK_WIDTH));
    ro.observe(vp);
    return () => ro.disconnect();
  }, []);

  return (
    <figure className="demo" ref={rootRef}>
      <figcaption className="sr-only">{DEMO_CHAT.summary}</figcaption>
      <div className="demo__viewport" ref={viewportRef} data-demo="frame" aria-hidden="true">
        <div className="mock" style={{ transform: `scale(${scale})` }}>
          <aside className="mock__sidebar">
            <div className="mock__side-top">
              <span className="mock__active-bg" />
              <Brand />
              <ul className="mock__nav">
                {NAV.map((item) => (
                  <li key={item.label} className={`mock__nav-item${item.active ? ' is-active' : ''}`}>
                    <img src={item.icon} alt="" />
                    <span>{item.label}</span>
                    {item.badge && <span className="mock__nav-badge">{item.badge}</span>}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mock__user">
              <span className="mock__avatar">SW</span>
              <span className="mock__user-meta">
                <span className="mock__user-name">Sarah household</span>
                <span className="mock__user-plan">Family plan</span>
              </span>
              <img className="mock__user-chevron" src={iconChevronDown} alt="" />
            </div>
          </aside>

          <div className="mock__main">
            <div className="mock__overview" data-demo="overview">
              <span className="mock__overview-glow mock__overview-glow--a">
                <span />
              </span>
              <span className="mock__overview-glow mock__overview-glow--b">
                <span />
              </span>
              <div className="mock__greeting">
                <p className="mock__hello">Good morning, Ben!</p>
                <p className="mock__hello-sub">Martha has 1 overdue bill</p>
              </div>
              <div className="mock__balance">
                <span className="mock__balance-label">
                  Estimated balance in 30 days
                  <img src={iconHelp} alt="" />
                </span>
                <span className="mock__balance-row">
                  <span className="mock__balance-value">$13,963</span>
                  <span className="mock__balance-menu">
                    <img src={iconCaret} alt="" />
                  </span>
                </span>
              </div>
            </div>

            <div className="mock__feed">
              <AlertSection
                part="s1"
                message="I found Martha's AT&T bill. It is overdue and higher than usual — plus 3 more overdue bills. Let's take care of these first."
                card={{ tone: 'overdue', vendor: 'AT&T Home Internet', date: '18 Apr', amount: '$77.26', note: 'Higher than usual and overdue' }}
              />

              <div className="mock__question" data-demo="question">
                <p className="mock__bubble">{DEMO_CHAT.question}</p>
              </div>

              <div className="mock__thinking" data-demo="thinking">
                <Chip />
                <span className="mock__dots">
                  <span />
                  <span />
                  <span />
                </span>
              </div>

              <AlertSection
                part="s2"
                message={DEMO_CHAT.reply}
                card={{ tone: 'flagged', vendor: 'AT&T Mobile', date: '23 Apr', amount: '$180.26', note: 'This may not be from the real Verizon' }}
              />
            </div>

            <div className="mock__composer">
              <div className="mock__input" data-demo="input">
                <span className="mock__placeholder" data-demo="placeholder">
                  Ask about bills, accounts, or payments...
                </span>
                <span className="mock__typed">
                  <span data-demo="typed" />
                  <span className="mock__caret" data-demo="caret">
                    <span data-demo="caret-blink" />
                  </span>
                </span>
                <span className="mock__send" data-demo="send">
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
