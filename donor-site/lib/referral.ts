export const REF_COOKIE = "ref_code";
export const REF_CODE_RE = /^[A-Za-z0-9]{8}$/;

/** Read the referral code cookie on the client. */
export function readRefCookie(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp(`(?:^|; )${REF_COOKIE}=([A-Za-z0-9]{8})`));
  return m?.[1] ?? "";
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"; // no look-alikes

/** Cryptographically random 8-character referral code. */
export function generateRefCode(length = 8): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  // 256 % 56 != 0 introduces negligible bias; acceptable for referral codes.
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

export function referralLinks(code: string, base: string) {
  return {
    egg: `${base}/egg-donor?ref=${code}`,
    sperm: `${base}/sperm-donor?ref=${code}`,
  };
}
