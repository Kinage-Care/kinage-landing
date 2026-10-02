import logo from '../../../../design-system/brand/kinage-logo.svg';
import { Icon } from '../../../components/Icon';
import { HOW } from '../../../content/home';
import { useSequence } from '../useSequence';

/**
 * Phases (ms from activation):
 *  0 both cards float in front of the phone, unconnected
 *  1 the pointer travels to Email          2 click
 *  3 Email connected                       4 Email docks into the phone
 *  5 the pointer travels to Financial      6 click
 *  7 Financial account connected           8 it docks; the pointer leaves
 *  9 one banner replaces both cards (then a reading hold until the step ends)
 */
const TIMES = [0, 500, 1450, 1700, 2450, 3050, 4000, 4250, 5000, 5900] as const;

type Status = 'idle' | 'connected';

function ConnectionCard({ id, label, description, status, docked, pressed, hidden }: {
  id: string;
  label: string;
  description: string;
  status: Status;
  docked: boolean;
  pressed: boolean;
  hidden: boolean;
}) {
  return (
    <div
      className="cn-card"
      data-card={id}
      data-status={status}
      data-docked={docked || undefined}
      data-pressed={pressed || undefined}
      data-hidden={hidden || undefined}
    >
      <span className="cn-card__text">
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
      <span className="cn-card__state">
        {status === 'connected' ? <Icon name="check" size={16} strokeWidth={3} className="cn-ok" /> : <Icon name="minus" size={16} strokeWidth={2} />}
        {status === 'connected' ? 'Connected' : 'Not started'}
      </span>
    </div>
  );
}

/**
 * Step 1 — the onboarding connection cards (structure of kinage-web-app
 * OnboardingGate → ConnectionStatusCard on main), in Kinage product styling.
 * A simulation only: no OAuth, no bank, no network requests.
 *
 * The cards and the pointer live in a foreground layer over the phone, so a
 * floating card can extend past the screen; docking moves the same element
 * onto its slot inside the screen (no duplicate, no swap). Under reduced
 * motion the finished banner is shown at once, without the pointer.
 */
export function ConnectSlide({ active, reduced }: { active: boolean; reduced: boolean }) {
  const phase = useSequence(active, TIMES, reduced);
  const c = HOW.connect;
  const done = phase >= 9;
  const pointer = reduced || done || phase >= 8 ? 'gone' : phase >= 5 ? 'bank' : phase >= 1 ? 'email' : 'rest';
  const clicking = phase === 2 || phase === 6;

  return (
    <div className="connect" data-phase={phase}>
      <div className="phone">
        <div className="phone__screen p-ui">
          <div className="ob-top">
            <img src={logo} alt="" width={84} height={19} />
          </div>
          <p className="cn-title">{c.title}</p>
          {/* Slots the cards dock into, and the banner that replaces them. */}
          <div className="cn-dock" />
          <div className="cn-done" data-shown={done || undefined}>
            <p className="cn-done__title">
              <Icon name="checkCircle" size={22} className="cn-ok" />
              {c.done.title}
            </p>
            <p className="cn-done__body">{c.done.body}</p>
            <ul>
              {c.done.items.map((i) => (
                <li key={i}>
                  <Icon name="check" size={15} strokeWidth={3} className="cn-ok" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <p className="cn-note">{c.note}</p>
        </div>
      </div>

      <div className="cn-layer p-ui">
        <ConnectionCard
          id="email"
          label={c.status[0].label}
          description={c.status[0].description}
          status={phase >= 3 ? 'connected' : 'idle'}
          docked={phase >= 4}
          pressed={phase === 2}
          hidden={done}
        />
        <ConnectionCard
          id="bank"
          label={c.status[1].label}
          description={c.status[1].description}
          status={phase >= 7 ? 'connected' : 'idle'}
          docked={phase >= 8}
          pressed={phase === 6}
          hidden={done}
        />
        {/* Position on the wrapper, the press on the arrow: the two never compound. */}
        <span className="cn-pointer" data-at={pointer} data-click={clicking || undefined} aria-hidden="true">
          <svg viewBox="0 0 24 28" width={24} height={28}>
            <path d="M3 2.5v19.2l5-4.6 3.3 7.6 3.4-1.5-3.3-7.4h6.9z" />
          </svg>
        </span>
      </div>
    </div>
  );
}
