import { describe, expect, it } from "vitest";
import { generateRefCode, REF_CODE_RE, referralLinks } from "@/lib/referral";

describe("referral codes", () => {
  it("generates 8-char alphanumeric codes accepted by the validator", () => {
    const codes = new Set(Array.from({ length: 2000 }, () => generateRefCode()));
    expect(codes.size).toBe(2000);
    for (const c of codes) expect(REF_CODE_RE.test(c)).toBe(true);
  });
  it("builds landing page links", () => {
    expect(referralLinks("Ab3dEf7h", "https://x.com")).toEqual({
      egg: "https://x.com/egg-donor?ref=Ab3dEf7h",
      sperm: "https://x.com/sperm-donor?ref=Ab3dEf7h",
    });
  });
});
