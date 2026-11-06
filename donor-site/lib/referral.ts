export const REF_COOKIE = "ref_code";
export const REF_CODE_RE = /^[A-Za-z0-9]{8}$/;

/** Read the referral code cookie on the client. */
export function readRefCookie(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp(`(?:^|; )${REF_COOKIE}=([A-Za-z0-9]{8})`));
  return m?.[1] ?? "";
}
