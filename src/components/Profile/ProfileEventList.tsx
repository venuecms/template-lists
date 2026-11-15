import { getProfileEvents, getSite } from "@venuecms/sdk-next";
import { connection } from "next/server";

import { EventsList, ListEvent } from "@/components/EventList";
import { Skeleton } from "@/components/ui/Input/Skeleton";

export const ProfileEventList = async ({
  header,
  slug,
  filter,
}: {
  header: string;
  slug: string;
  /**
   * `past` lists events that started before now. It is a flag rather than a
   * timestamp the caller passes, because the time can only be read after
   * `connection()` below: read during prerender, it would freeze into the
   * shell.
   */
  filter?: { upcoming?: boolean; past?: boolean; dir?: "asc" | "desc" };
}) => {
  await connection();

  const { past, ...rest } = filter ?? {};
  const query = past ? { ...rest, lt: Date.now() } : rest;

  const [{ data: events }, { data: site }] = await Promise.all([
    getProfileEvents({ slug, limit: 60, ...query }),
    getSite(),
  ]);

  if (!site) {
    return null;
  }

  return events?.records.length ? (
    <div className="flex flex-col gap-6">
      <h2 className="m-0 py-0 text-sm text-primary">{header}</h2>
      <EventsList>
        {events.records.map((event) => (
          <ListEvent key={event.id} event={event} site={site} />
        ))}
      </EventsList>
    </div>
  ) : null;
};

export const ProfileEventListSkeleton = ({
  numElements = 2,
}: {
  numElements?: number;
}) => {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="w-1/4" />
      <EventsList>
        {Array.from({ length: numElements }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-[90%]" />
        ))}
      </EventsList>
    </div>
  );
};
