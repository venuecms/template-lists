import {
  type Event as VenueEvent,
  getLocalizedContent,
} from "@venuecms/sdk-next";
import { useLocale } from "next-intl";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { formatDate } from "@/components/utils";

/**
 * A run of events as one-line tour dates:
 * "12 Mar / Artist / Venue / City / Country". Shared by the home page's
 * featured profiles and event listing blocks in content, so both read the
 * same.
 *
 * `withArtists` adds the artists after the date. Off where the list already
 * sits under an artist's name, as on the home page.
 */
export const EventLines = ({
  events,
  timeZone,
  withArtists = false,
  className,
}: {
  events: VenueEvent[];
  timeZone?: string;
  withArtists?: boolean;
  className?: string;
}) => (
  <ul className={cn("flex flex-col", className)}>
    {events.map((event) => (
      <li key={event.id}>
        <EventLine
          event={event}
          timeZone={timeZone}
          withArtists={withArtists}
        />
      </li>
    ))}
  </ul>
);

/**
 * One event as a single line, linking to its first ticket (or the venue's
 * site) in a new tab. Falls back to the event title when there's no location,
 * so the line is never a bare date.
 */
export const EventLine = ({
  event,
  timeZone,
  withArtists = false,
}: {
  event: VenueEvent;
  timeZone?: string;
  withArtists?: boolean;
}) => {
  const locale = useLocale();

  const date = formatDate({
    date: event.startDate,
    withTime: false,
    timeZone,
    template: "d MMM",
  });
  const location = event.location
    ? [
        getLocalizedContent(event.location.localizedContent, locale).content
          .title,
        event.location.city,
        event.location.country,
      ]
        .filter(Boolean)
        // A venue named after its city would otherwise repeat.
        .filter((part, i, parts) => parts.indexOf(part) === i)
    : [];
  const place = location.length
    ? location
    : [
        getLocalizedContent(event.localizedContent, locale).content.title,
      ].filter(Boolean);

  const artists = withArtists
    ? (event.artists ?? [])
        .map(
          ({ profile }) =>
            profile &&
            getLocalizedContent(profile.localizedContent, locale).content.title,
        )
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <ExternalLink
      href={firstTicketLink(event) ?? event.location?.externalLink}
      className={cn(event.publishState === "CANCELLED" && "line-through")}
    >
      {[date, artists, ...place].filter(Boolean).map((part, i) => (
        <span key={i}>
          {i > 0 ? <Separator /> : null}
          {part}
        </span>
      ))}
    </ExternalLink>
  );
};

/** The first ticket, in display order, that has somewhere to buy it. */
const firstTicketLink = (event: VenueEvent) =>
  [...(event.tickets ?? [])]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .find((ticket) => ticket.externalLink)?.externalLink;

const Separator = () => <span className="px-1.5">/</span>;

/** Opens off-site in a new tab; renders plain text when there is no link. */
const ExternalLink = ({
  href,
  className,
  children,
}: {
  href?: string | null;
  className?: string;
  children: ReactNode;
}) =>
  href ? (
    <a
      className={cn("hover:brightness-125", className)}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ) : (
    <span className={className}>{children}</span>
  );
