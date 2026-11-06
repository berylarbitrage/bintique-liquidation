import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { render } from "@react-email/components";
import EligibleEmail from "@/emails/eligible";
import IneligibleEmail from "@/emails/ineligible";
import AdminNewApplicationEmail from "@/emails/admin-new-application";

describe("email templates", () => {
  it("eligible email contains the portal link", async () => {
    const html = await render(
      createElement(EligibleEmail, {
        firstName: "Jane",
        donorType: "egg",
        portalUrl: "https://x.com/auth/confirm?t=1",
      }),
    );
    expect(html).toMatch(/Great news, (<!-- -->)?Jane/);
    expect(html).toContain("https://x.com/auth/confirm?t=1");
  });

  it("ineligible email contains the referral link", async () => {
    const html = await render(
      createElement(IneligibleEmail, { firstName: "Jane", referUrl: "https://x.com/refer" }),
    );
    expect(html).toContain("https://x.com/refer");
  });

  it("admin email contains only name, type, eligibility and admin link", async () => {
    const text = await render(
      createElement(AdminNewApplicationEmail, {
        name: "Jane Doe",
        donorType: "sperm",
        eligible: false,
        adminUrl: "https://x.com/admin/applications/1",
      }),
      { plainText: true },
    );
    expect(text).toContain("Jane Doe");
    expect(text).toContain("sperm");
    expect(text).toMatch(/Pre-qualified:\s*No/);
    expect(text).not.toMatch(
      /\b(bmi|weight|height|smok\w*|cycles?|birth control|date of birth)\b/i,
    );
  });
});
