/** Parse a strict YYYY-MM-DD string into a UTC date, or null. */
export function parseIsoDate(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d) {
    return null;
  }
  return date;
}

/** Age in whole years on `now` for a YYYY-MM-DD birth date. Returns NaN if invalid. */
export function ageOn(dateOfBirth: string, now: Date): number {
  const dob = parseIsoDate(dateOfBirth);
  if (!dob) return NaN;
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  let age = y - dob.getUTCFullYear();
  if (m < dob.getUTCMonth() || (m === dob.getUTCMonth() && d < dob.getUTCDate())) age -= 1;
  return age;
}
