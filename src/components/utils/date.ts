import { TZDate } from "@date-fns/tz";
import { format } from "date-fns";

/**
 * Formats a record date in the venue's zone. `timeZone` is optional because
 * the SDK types it as nullable on Site; TZDate falls back to the runtime zone
 * when it is absent, which is the best available guess.
 */
export const formatDate = ({
  date,
  withTime = true,
  timeZone,
  template,
}: {
  date: string;
  withTime?: boolean;
  timeZone?: string;
  template: string;
}) => {
  if (withTime) {
    return format(new TZDate(date, timeZone), `${template} • h.mmaaa`)
      .split(".00")
      .join("");
  }
  return format(new TZDate(date, timeZone), template);
};

/**
 * An event's date, in the venue's zone. A single day uses `template` (and the
 * time, with `withTime`). Several days collapse what they share:
 *
 *   same month:       5—7 Dec 2025
 *   different months: 3 Sep — 4 Oct 2025
 *   different years:  3 Dec 2025 — 4 Jan 2026
 *
 * Days are compared as calendar dates in `timeZone`, so an event ending after
 * midnight UTC still reads as the day it was in the venue.
 */
export const formatDateRange = ({
  start,
  end,
  timeZone,
  withTime,
  template = "EEEE d MMMM yyyy",
}: {
  start: string;
  end?: string | null;
  timeZone?: string;
  withTime?: boolean;
  template?: string;
}) => {
  const startDate = new TZDate(start, timeZone);
  // No end means a single day; TZDate would otherwise read it as now.
  const endDate = end ? new TZDate(end, timeZone) : startDate;

  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const sameMonth = sameYear && startDate.getMonth() === endDate.getMonth();
  const sameDay = sameMonth && startDate.getDate() === endDate.getDate();

  if (sameDay) {
    return formatDate({ date: start, withTime, template, timeZone });
  }

  const endText = format(endDate, "d MMM yyyy");

  if (sameMonth) {
    return `${format(startDate, "d")}—${endText}`;
  }
  if (sameYear) {
    return `${format(startDate, "d MMM")} — ${endText}`;
  }
  return `${format(startDate, "d MMM yyyy")} — ${endText}`;
};
