import { describe, expect, it } from "vitest";
import { csvCell, toCsv } from "@/lib/csv";
import { EXPORT_HEADERS, EXPORT_SELECT, exportRow } from "@/lib/admin/export";
import { parseFilters, sanitizeSearch, applyFilters } from "@/lib/admin/filters";

describe("CSV", () => {
  it("escapes quotes, commas and newlines", () => {
    expect(csvCell('a "b", c')).toBe('"a ""b"", c"');
    expect(csvCell("x\ny")).toBe('"x\ny"');
  });
  it("neutralises spreadsheet formulas", () => {
    expect(csvCell("=HYPERLINK(1)")).toBe("'=HYPERLINK(1)");
    expect(csvCell("+1")).toBe("'+1");
    expect(csvCell("@cmd")).toBe("'@cmd");
  });
  it("builds rows", () => {
    expect(toCsv(["a", "b"], [[1, null]])).toBe("a,b\r\n1,\r\n");
  });
});

describe("export columns", () => {
  it("never include medical history or health answers", () => {
    const cols = EXPORT_SELECT.split(",");
    for (const banned of [
      "sections",
      "smoker",
      "regular_cycles",
      "birth_control",
      "previous_donation",
      "height_in",
      "weight_lb",
      "fail_reasons",
      "storage_path",
    ]) {
      expect(cols).not.toContain(banned);
    }
    expect(EXPORT_HEADERS.join(" ")).not.toMatch(/medical|history|photo|smok|cycle/i);
  });
  it("maps a row in header order", () => {
    const row = exportRow(
      {
        id: "1",
        created_at: "2026-01-01",
        first_name: "A",
        last_name: "B",
        email: "a@b.c",
        phone: "3125550199",
        sms_consent: true,
        donor_type: "egg",
        state: "IL",
        zip: "60601",
        date_of_birth: "2000-01-01",
        education: "Graduate",
        how_heard: "Google",
        bmi: 21.5,
        eligible: true,
        status: "new",
        referral_code: null,
      },
      new Date(2026, 5, 1),
    );
    expect(row).toHaveLength(EXPORT_HEADERS.length);
    expect(row[9]).toBe(26);
  });
});

describe("admin filters", () => {
  it("parses valid params and drops invalid ones", () => {
    expect(
      parseFilters({ type: "egg", status: "bogus", eligible: "yes", state: "ZZ", page: "2" }),
    ).toEqual({
      type: "egg",
      eligible: "yes",
      page: 2,
    });
  });
  it("sanitizes search terms against filter injection", () => {
    expect(sanitizeSearch("a,b.or(id.eq.1)%_")).toBe("a b or id eq 1");
  });
  it("applies filters to a query builder", () => {
    const calls: string[] = [];
    const q = {
      eq(c: string, v: unknown) {
        calls.push(`eq:${c}=${v}`);
        return q;
      },
      or(f: string) {
        calls.push(`or:${f}`);
        return q;
      },
    };
    applyFilters(q, { type: "sperm", eligible: "no", q: "jane" });
    expect(calls).toEqual([
      "eq:donor_type=sperm",
      "eq:eligible=false",
      "or:first_name.ilike.%jane%,last_name.ilike.%jane%,email.ilike.%jane%",
    ]);
  });
});
