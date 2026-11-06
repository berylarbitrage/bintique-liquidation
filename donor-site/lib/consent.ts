/** Cookie consent helpers (client-side). Only "necessary" cookies are set before consent. */
export type Consent = "granted" | "denied";
export const CONSENT_COOKIE = "cookie_consent";
export const CONSENT_EVENT = "consent-change";
export const OPEN_CONSENT_EVENT = "open-cookie-settings";

export function readConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=(granted|denied)`));
  return (m?.[1] as Consent) ?? null;
}

export function writeConsent(value: Consent) {
  const maxAge = 60 * 60 * 24 * 180; // 180 days
  document.cookie = `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}
