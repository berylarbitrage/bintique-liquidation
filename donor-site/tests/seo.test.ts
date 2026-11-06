import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

describe("SEO", () => {
  it("sitemap excludes private areas", () => {
    const urls = sitemap().map((e) => new URL(e.url).pathname);
    expect(urls).toContain("/egg-donor");
    for (const u of urls) expect(u).not.toMatch(/^\/(admin|portal|login|api|auth)|\/apply\/result/);
  });
  it("robots disallows admin and portal", () => {
    const rules = robots().rules;
    const r = Array.isArray(rules) ? rules[0]! : rules;
    expect(r.disallow).toEqual(expect.arrayContaining(["/admin", "/portal"]));
  });
});
