import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type FormEvent,
  type ReactNode,
} from 'react';
import { LINKS } from '../content/links';
import { isContactConfigured, submitContact, type ContactKind } from '../lib/early-access';
import { lockScroll } from '../motion/smoothScroll';
import './EarlyAccess.css';

/**
 * The shared contact dialog. One component, three modes:
 *  - 'early-access' — every "Get early access" control (nav, hero, final CTA,
 *    Our Story);
 *  - 'plans'        — "Ask about plans" (final CTA);
 *  - 'partner'      — "Partner with Kinage" (/advisors).
 *
 * Local prototype: no endpoint is configured, so a valid submission ends in
 * an honest "nothing was sent" state (status 'local') — never a fake
 * confirmation. The dialog says so before submitting, too.
 * Same fields, validation, focus handling, scroll lock and submission
 * integration (src/lib/early-access.ts); only copy, the message field's
 * label/requirement and the request `kind` differ.
 */
export type ContactMode = 'early-access' | 'plans' | 'partner';

type ModeCopy = {
  kind: ContactKind;
  title: string;
  intro: string;
  messageLabel: string;
  messageRequired: boolean;
  messageError: string;
  messagePlaceholder?: string;
  submit: string;
  doneText: (email: string) => string;
};

const MODES: Record<ContactMode, ModeCopy> = {
  'early-access': {
    kind: 'early-access',
    title: 'Get early access',
    intro: 'Tell us who you are and we will let you know as soon as Kinage opens for your family.',
    messageLabel: 'Message',
    messageRequired: false,
    messageError: '',
    submit: 'Request early access',
    doneText: (email) => `We have your request. We will email ${email} as soon as early access opens for your family.`,
  },
  plans: {
    kind: 'plans-inquiry',
    title: 'Ask about plans',
    intro: 'Kinage is a monthly subscription for families. Send us your question and we’ll share the current options.',
    messageLabel: 'Your question',
    messageRequired: true,
    messageError: 'Please enter your question.',
    submit: 'Send question',
    doneText: (email) => `We have your question and will reply to ${email}.`,
  },
  partner: {
    kind: 'partnership-inquiry',
    title: 'Partner with Kinage',
    intro: 'Tell us how you’d like to work together.',
    messageLabel: 'Message',
    messageRequired: false,
    messageError: '',
    messagePlaceholder: 'I’d like to learn more about partnering with Kinage.',
    submit: 'Send inquiry',
    doneText: (email) => `We have your inquiry and will reply to ${email}.`,
  },
};

type OpenFn = (opener?: HTMLElement | null, mode?: ContactMode) => void;
const EarlyAccessContext = createContext<OpenFn | null>(null);

export function EarlyAccessProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ContactMode>('early-access');
  const opener = useRef<HTMLElement | null>(null);
  const show = useCallback<OpenFn>((el, m = 'early-access') => {
    opener.current = el ?? (document.activeElement as HTMLElement | null);
    setMode(m);
    setOpen(true);
  }, []);
  const hide = useCallback(() => {
    setOpen(false);
    // Focus goes back to the control that opened the dialog — or, if that one
    // is gone from view (e.g. the collapsed nav menu closed), to the element
    // marked data-focus-return (the menu toggle).
    const el = opener.current;
    opener.current = null;
    requestAnimationFrame(() => {
      const visible = el?.isConnected && (el.checkVisibility?.({ visibilityProperty: true }) ?? true);
      const target = visible ? el : document.querySelector<HTMLElement>('[data-focus-return]');
      target?.focus({ preventScroll: true });
    });
  }, []);

  return (
    <EarlyAccessContext.Provider value={show}>
      {children}
      <ContactDialog open={open} mode={mode} onClose={hide} />
    </EarlyAccessContext.Provider>
  );
}

export function useEarlyAccess(): OpenFn {
  const ctx = useContext(EarlyAccessContext);
  if (!ctx) throw new Error('useEarlyAccess must be used inside <EarlyAccessProvider>');
  return ctx;
}

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & { children?: ReactNode; mode?: ContactMode };

/** A button (it opens the dialog, it does not navigate) styled by the caller's classes. */
export function EarlyAccessButton({ children, onClick, mode = 'early-access', ...rest }: ButtonProps) {
  const open = useEarlyAccess();
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        open(e.currentTarget, mode);
      }}
    >
      {children ?? LINKS.earlyAccess.label}
    </button>
  );
}

/* ------------------------------------------------------------------ dialog */

type Field = 'firstName' | 'lastName' | 'email' | 'message';
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;
type Status = 'idle' | 'sending' | 'sent' | 'failed' | 'local';

const EMPTY: Values = { firstName: '', lastName: '', email: '', message: '' };
const MESSAGE_MAX = 500;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ORDER: Field[] = ['firstName', 'lastName', 'email', 'message'];

function validate(v: Values, copy: ModeCopy): Errors {
  const e: Errors = {};
  if (!v.firstName.trim()) e.firstName = 'Please enter your first name.';
  if (!v.lastName.trim()) e.lastName = 'Please enter your last name.';
  if (!v.email.trim()) e.email = 'Please enter your email address.';
  else if (!EMAIL.test(v.email.trim())) e.email = 'Please enter a valid email address, like name@example.com.';
  if (copy.messageRequired && !v.message.trim()) e.message = copy.messageError;
  else if (v.message.length > MESSAGE_MAX) e.message = `Please keep your message under ${MESSAGE_MAX} characters.`;
  return e;
}

function ContactDialog({ open, mode, onClose }: { open: boolean; mode: ContactMode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const abort = useRef<AbortController | null>(null);
  const id = useId();
  const copy = MODES[mode];
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [shownMode, setShownMode] = useState<ContactMode>(mode);

  // Switching entry points: the mode-specific message, errors and result never
  // carry over (name and email are the same person and may stay).
  if (open && shownMode !== mode) {
    setShownMode(mode);
    setValues((v) => ({ ...v, message: '' }));
    setErrors({});
    setSubmitted(false);
    setStatus('idle');
  }

  // Open/close the native modal dialog (top layer, inert page, Esc = cancel).
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      const release = lockScroll();
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>('input')?.focus());
      return () => {
        release();
        if (dialog.open) dialog.close();
      };
    }
  }, [open]);

  useEffect(() => {
    if (status === 'sent' || status === 'local') doneRef.current?.focus();
  }, [status]);

  const close = () => {
    abort.current?.abort();
    if (status === 'sent' || status === 'local') {
      setValues(EMPTY);
      setSubmitted(false);
      setErrors({});
    }
    if (status !== 'sending') setStatus('idle');
    onClose();
  };

  const update = (field: Field, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (submitted) setErrors(validate(next, copy));
    if (status === 'failed') setStatus('idle');
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setSubmitted(true);
    const found = validate(values, copy);
    setErrors(found);
    const first = ORDER.find((f) => found[f]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus('sending');
    abort.current = new AbortController();
    const result = await submitContact(
      {
        kind: copy.kind,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        ...(values.message.trim() ? { message: values.message.trim() } : {}),
      },
      abort.current.signal,
    );
    if (abort.current?.signal.aborted) return;
    setStatus(result.ok ? 'sent' : result.reason === 'not-configured' ? 'local' : 'failed');
  };

  const fieldProps = (field: Field) => ({
    id: `${id}-${field}`,
    name: field,
    value: values[field],
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `${id}-${field}-error` : undefined,
    onChange: (e: { target: { value: string } }) => update(field, e.target.value),
  });

  const error = (field: Field) =>
    errors[field] ? (
      <p className="ea__error" id={`${id}-${field}-error`}>
        {errors[field]}
      </p>
    ) : null;

  return (
    <dialog
      ref={ref}
      className="ea"
      data-mode={mode}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-intro`}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        // A click on the backdrop (the dialog box itself, outside the panel) closes.
        if (e.target === ref.current) close();
      }}
    >
      <div className="ea__panel">
        <button type="button" className="ea__close" onClick={close} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>

        {status === 'local' ? (
          <div className="ea__done">
            <h2 className="ea__title" id={`${id}-title`} tabIndex={-1} ref={doneRef}>
              Nothing was sent
            </h2>
            <p className="ea__intro" id={`${id}-intro`}>
              This is a local prototype and isn’t connected to a sign-up service yet. Your details were checked in the browser only. They
              weren’t stored or shared.
            </p>
            <button type="button" className="btn btn--outline ea__submit" onClick={close}>
              Close
            </button>
          </div>
        ) : status === 'sent' ? (
          <div className="ea__done">
            <h2 className="ea__title" id={`${id}-title`} tabIndex={-1} ref={doneRef}>
              Thanks, {values.firstName.trim()}
            </h2>
            <p className="ea__intro" id={`${id}-intro`}>
              {copy.doneText(values.email.trim())}
            </p>
            <button type="button" className="btn btn--outline ea__submit" onClick={close}>
              Close
            </button>
          </div>
        ) : (
          <form ref={formRef} className="ea__form" noValidate onSubmit={onSubmit}>
            <h2 className="ea__title" id={`${id}-title`}>
              {copy.title}
            </h2>
            <p className="ea__intro" id={`${id}-intro`}>
              {copy.intro}
            </p>

            <div className="ea__row">
              <div className="ea__field">
                <label htmlFor={`${id}-firstName`}>First name</label>
                <input {...fieldProps('firstName')} type="text" autoComplete="given-name" required />
                {error('firstName')}
              </div>
              <div className="ea__field">
                <label htmlFor={`${id}-lastName`}>Last name</label>
                <input {...fieldProps('lastName')} type="text" autoComplete="family-name" required />
                {error('lastName')}
              </div>
            </div>

            <div className="ea__field">
              <label htmlFor={`${id}-email`}>Email address</label>
              <input {...fieldProps('email')} type="email" autoComplete="email" inputMode="email" required />
              {error('email')}
            </div>

            <div className="ea__field">
              <label htmlFor={`${id}-message`}>
                {copy.messageLabel} {!copy.messageRequired && <span className="ea__optional">Optional</span>}
              </label>
              <textarea
                {...fieldProps('message')}
                rows={copy.messageRequired ? 4 : 3}
                maxLength={MESSAGE_MAX + 50}
                required={copy.messageRequired}
                placeholder={copy.messagePlaceholder}
              />
              {error('message')}
            </div>

            {status === 'failed' && (
              <p className="ea__alert" role="alert">
                We couldn’t send your {copy.kind === 'plans-inquiry' ? 'question' : copy.kind === 'partnership-inquiry' ? 'inquiry' : 'request'} just now. Please try again in a moment,
                or email us at <a href={LINKS.email.href!}>{LINKS.email.label}</a>.
              </p>
            )}

            {!isContactConfigured() && (
              <p className="ea__local">Local prototype: submitting checks the form but sends nothing.</p>
            )}

            <button type="submit" className="btn btn--primary ea__submit" aria-disabled={status === 'sending' || undefined}>
              {status === 'sending' ? 'Sending…' : copy.submit}
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
