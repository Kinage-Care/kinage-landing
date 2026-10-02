import { Brand } from '../components/Brand';
import { SmartLink } from '../components/SmartLink';
import { LINKS, SECTIONS, isPending } from '../content/links';
import { FOOTER_COLUMNS, TAGLINE } from '../content/site';
import { withBase } from '../lib/base';
import './Footer.css';

/**
 * 10 — Footer on Paper. Brand and tagline, three link columns. The Privacy
 * Policy and Terms texts are not in this project yet, so they are plain
 * labels rather than links. No street address or phone number: none is
 * confirmed for this site.
 */
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__row">
          <div className="footer__brand" id={SECTIONS.contact}>
            <a href={withBase(`/#${SECTIONS.top}`)} className="footer__logo" aria-label="Kinage home">
              <Brand />
            </a>
            <p className="footer__tagline">{TAGLINE}</p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <nav className="footer__col" key={col.title} aria-label={col.title}>
              <p className="footer__title">{col.title}</p>
              <ul className="footer__links">
                {col.links.map((key) => (
                  <li key={key}>
                    {isPending(key) ? (
                      // No legal text exists in this project yet: a plain label, not a link that goes nowhere.
                      <span className="footer__label">{LINKS[key].label}</span>
                    ) : (
                      <SmartLink to={key} className="footer__link" />
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="footer__copy">© 2026 Kinage. All rights reserved.</p>
      </div>
    </footer>
  );
}
