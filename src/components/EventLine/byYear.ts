import type { Event as VenueEvent } from "@venuecms/sdk-next";

import { formatDate } from "@/components/utils";

/**
 * Whether a list holds only events that are over: each has ended (or, without
 * an end, started) before `now`.
 *
 * Stands in for the block's own "past" setting, which the SDK resolves into
 * its query and does not hand the listing component. An "all" listing whose
 * events are all over reads as past too, which is what it is.
 */
export const isPastEventList = (events: VenueEvent[], now: number) =>
  events.length > 0 &&
  events.every((event) => Date.parse(event.endDate ?? event.startDate) < now);

/**
 * Events split into runs by year, in the site's time zone, keeping the order
 * they came in. A year only starts a new group where it changes, so a list
 * sorted either way reads as one heading per year.
 */
export const groupEventsByYear = (events: VenueEvent[], timeZone?: string) =>
  events.reduce<Array<{ year: string; events: VenueEvent[] }>>(
    (groups, event) => {
      const year = formatDate({
        date: event.startDate,
        withTime: false,
        timeZone,
        template: "yyyy",
      });
      const last = groups[groups.length - 1];

      if (last?.year === year) {
        last.events.push(event);
      } else {
        groups.push({ year, events: [event] });
      }
      return groups;
    },
    [],
  );
