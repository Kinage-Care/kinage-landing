import { Brand } from '../components/Brand';
import { EarlyAccessButton } from '../components/EarlyAccess';
import { SmartLink } from '../components/SmartLink';
import { FOOTER_COLUMNS } from '../content/landing';
import { SECTIONS } from '../content/links';
import { withBase } from '../lib/base';
import './Footer.css';

/** 15 — FOOTER (Figma 562:4265). */
export function Footer() {
  return (
    <footer className="footer on-brand">
      <span className="footer__rule" aria-hidden="true" />
      <div className="container footer__inner">
        <div className="footer__row">
          <div className="footer__brand">
            <a href={withBase(`/#${SECTIONS.top}`)} className="footer__logo" aria-label="Kinage home">
              <Brand tone="inverse" />
            </a>
            <address className="footer__address" id={SECTIONS.contact}>
              <span>350 Fifth Avenue, Suite 4120</span>
              <span>New York, NY 10118</span>
              <SmartLink to="email" className="footer__link" />
              <SmartLink to="phone" className="footer__link" />
            </address>
            {/* Reserved 56 × 36 frame — empty in Figma (569:540), kept so the column keeps its height. */}
            <span className="footer__reserved" aria-hidden="true" />
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <nav className="footer__col" key={col.title} aria-label={col.title}>
              <p className="footer__title">{col.title}</p>
              <ul className="footer__links">
                {col.links.map((key) => (
                  <li key={key}>
                    <SmartLink to={key} className="footer__link" />
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="footer__col footer__col--news">
            <p className="footer__title">Stay in the loop</p>
            <p className="footer__note">Be first to know when we launch new features.</p>
            <EarlyAccessButton className="btn btn--primary footer__cta" />
          </div>
        </div>

        <span className="footer__rule footer__rule--inner" aria-hidden="true" />
        <p className="footer__copy">© 2025 Kinage. All rights reserved.</p>
      </div>
    </footer>
  );
}
