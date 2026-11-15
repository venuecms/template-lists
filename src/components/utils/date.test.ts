import { describe, expect, it } from "vitest";

import { formatDateRange } from "./date";

const range = (start: string, end?: string | null) =>
  formatDateRange({
    start,
    end,
    timeZone: "Europe/Stockholm",
    withTime: false,
    template: "d MMM",
  });

describe("formatDateRange", () => {
  it("uses the template for a single day", () => {
    expect(range("2025-12-05T19:00:00Z", "2025-12-05T22:00:00Z")).toBe("5 Dec");
  });

  it("treats a missing end as a single day", () => {
    expect(range("2025-12-05T19:00:00Z", null)).toBe("5 Dec");
    expect(range("2025-12-05T19:00:00Z")).toBe("5 Dec");
  });

  it("collapses days in the same month", () => {
    expect(range("2025-12-05T19:00:00Z", "2025-12-07T22:00:00Z")).toBe(
      "5—7 Dec 2025",
    );
  });

  it("names both months across months", () => {
    expect(range("2025-09-03T19:00:00Z", "2025-10-04T20:00:00Z")).toBe(
      "3 Sep — 4 Oct 2025",
    );
  });

  it("names both years across years", () => {
    expect(range("2025-12-03T19:00:00Z", "2026-01-04T22:00:00Z")).toBe(
      "3 Dec 2025 — 4 Jan 2026",
    );
  });

  it("compares calendar dates, not weekdays", () => {
    // Monday to Monday: same weekday, a week apart.
    expect(range("2025-12-01T19:00:00Z", "2025-12-08T19:00:00Z")).toBe(
      "1—8 Dec 2025",
    );
  });

  it("reads the days in the venue's zone", () => {
    // 23:30 UTC on the 6th is already the 7th in Stockholm.
    expect(range("2025-12-05T19:00:00Z", "2025-12-06T23:30:00Z")).toBe(
      "5—7 Dec 2025",
    );
  });
});
