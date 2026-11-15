import type { Event as VenueEvent } from "@venuecms/sdk-next";
import { describe, expect, it } from "vitest";

import { groupEventsByYear, isPastEventList } from "./byYear";

const event = (id: string, startDate: string, endDate?: string) =>
  ({ id, startDate, endDate }) as unknown as VenueEvent;

const NOW = Date.parse("2026-11-15T12:00:00Z");

describe("isPastEventList", () => {
  it("is past when every event is over", () => {
    expect(
      isPastEventList(
        [
          event("a", "2025-03-01T20:00:00Z"),
          event("b", "2026-01-01T20:00:00Z"),
        ],
        NOW,
      ),
    ).toBe(true);
  });

  it("is not past when any event is still to come", () => {
    expect(
      isPastEventList(
        [
          event("a", "2025-03-01T20:00:00Z"),
          event("b", "2026-12-02T20:00:00Z"),
        ],
        NOW,
      ),
    ).toBe(false);
  });

  it("counts an event still running as not over", () => {
    expect(
      isPastEventList(
        [event("a", "2026-11-01T10:00:00Z", "2026-11-30T10:00:00Z")],
        NOW,
      ),
    ).toBe(false);
  });

  it("is not past when empty", () => {
    expect(isPastEventList([], NOW)).toBe(false);
  });
});

describe("groupEventsByYear", () => {
  it("groups runs of the same year, keeping order", () => {
    const groups = groupEventsByYear(
      [
        event("a", "2026-03-10T20:00:00Z"),
        event("b", "2026-02-22T20:00:00Z"),
        event("c", "2025-12-01T20:00:00Z"),
      ],
      "UTC",
    );

    expect(
      groups.map(({ year, events }) => [year, events.map(({ id }) => id)]),
    ).toEqual([
      ["2026", ["a", "b"]],
      ["2025", ["c"]],
    ]);
  });

  it("takes the year in the site's time zone", () => {
    // 23:30 on New Year's Eve in UTC is already the new year in Stockholm.
    const [group] = groupEventsByYear(
      [event("a", "2025-12-31T23:30:00Z")],
      "Europe/Stockholm",
    );

    expect(group.year).toBe("2026");
  });
});
