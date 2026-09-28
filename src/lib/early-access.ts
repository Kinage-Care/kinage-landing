/**
 * Contact submission — the one integration point for the shared contact
 * dialog (early-access requests, plan questions and partnership inquiries).
 *
 * The destination is configured, not hard-coded: set VITE_EARLY_ACCESS_ENDPOINT
 * (e.g. in `.env.local`) to a URL that accepts a JSON POST and answers 2xx when
 * it has stored the request. `kind` tells the requests apart. Until an
 * endpoint is set, every submission resolves to `{ ok: false, reason:
 * 'not-configured' }` and the dialog says it could not send — it never reports
 * a delivery that did not happen.
 */
export type ContactKind = 'early-access' | 'plans-inquiry' | 'partnership-inquiry';

export type ContactRequest = {
  kind: ContactKind;
  firstName: string;
  lastName: string;
  email: string;
  /** Optional note (early access, partnership) or the question itself (plans inquiry). */
  message?: string;
};

export type SubmitResult = { ok: true } | { ok: false; reason: 'not-configured' | 'rejected' | 'network' };

const ENDPOINT: string | undefined = import.meta.env.VITE_EARLY_ACCESS_ENDPOINT || undefined;

export const isContactConfigured = (): boolean => Boolean(ENDPOINT);

export async function submitContact(request: ContactRequest, signal?: AbortSignal): Promise<SubmitResult> {
  if (!ENDPOINT) {
    if (import.meta.env.DEV) console.info(`[kinage] ${request.kind}: VITE_EARLY_ACCESS_ENDPOINT is not set; nothing was sent.`);
    return { ok: false, reason: 'not-configured' };
  }
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...request, source: 'kinage-landing' }),
      signal,
    });
    return res.ok ? { ok: true } : { ok: false, reason: 'rejected' };
  } catch {
    return { ok: false, reason: 'network' };
  }
}
