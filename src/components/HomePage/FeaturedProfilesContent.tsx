import {
  type ContentStyles,
  VenueContent,
  type Event as VenueEvent,
  type Profile as VenueProfile,
  getLocalizedContent,
  getProfileEvents,
  getProfiles,
  getSite,
} from "@venuecms/sdk-next";
import { connection } from "next/server";

import { Link } from "@/lib/i18n";

import { EventLines } from "@/components/EventLine";
import { renderedStyles } from "@/components/utils/styles";
import { hasTag } from "@/components/utils/tags";

// The API ignores the `tags` filter on the profiles endpoint, so profiles are
// filtered by tag here.
const isFeatured = (profile: VenueProfile) => hasTag(profile, "featured");

export async function FeaturedProfilesContent({ locale }: { locale: string }) {
  await connection();

  const [{ data: profiles }, { data: site }] = await Promise.all([
    getProfiles({ limit: 100 }),
    getSite(),
  ]);

  if (!site) return null;

  const featured = (profiles?.records ?? []).filter(isFeatured);
  const withEvents = await Promise.all(
    featured.map(async (profile) => {
      const { data } = await getProfileEvents({
        slug: profile.slug,
        upcoming: true,
        dir: "asc",
        limit: 60,
      });
      // Sorted here too, so soonest-first doesn't rest on the API's default
      // sort field.
      const events = [...(data?.records ?? [])].sort(
        (a, b) => Date.parse(a.startDate) - Date.parse(b.startDate),
      );
      return { profile, events };
    }),
  );
  const columns = withEvents.filter(({ events }) => events.length);

  if (!columns.length) return null;

  return (
    <section className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-3 sm:py-24 lg:gap-36">
      {columns.map(({ profile, events }) => (
        <ProfileEvents
          key={profile.slug}
          profile={profile}
          events={events}
          locale={locale}
          timeZone={site.timeZone ?? undefined}
        />
      ))}
    </section>
  );
}

const ProfileEvents = ({
  profile,
  events,
  locale,
  timeZone,
}: {
  profile: VenueProfile;
  events: VenueEvent[];
  locale: string;
  timeZone?: string;
}) => {
  const { content } = getLocalizedContent(profile.localizedContent, locale);

  return (
    <div className="flex flex-col gap-4">
      <Link
        className="text-secondary hover:brightness-125"
        href={`/artists/${profile.slug}`}
      >
        {content.title}
      </Link>
      <EventLines events={events} timeZone={timeZone} />
      {/*
        Plain `renderedStyles`, as in ProfileCompact: the home page no longer
        takes searchParams, so listing blocks in a bio couldn't be paged.
      */}
      <VenueContent
        className="flex flex-col gap-6"
        content={firstParagraphOnly(content)}
        contentStyles={descriptionStyles}
      />
    </div>
  );
};

// The shared paragraph style sets text-primary, so the colour is overridden
// on the paragraph itself rather than on the wrapper.
const descriptionStyles: ContentStyles = {
  ...renderedStyles,
  p: "text-secondary text-sm max-w-[72ch]",
};

type Content = ReturnType<typeof getLocalizedContent>["content"];
type ContentNode = { type?: string; content?: unknown[] };

/**
 * Cuts a description down to its first non-empty paragraph. VenueContent
 * renders the `contentJSON` document and only falls back to the Markdown
 * `content`, so both are trimmed.
 */
const firstParagraphOnly = (content: Content): Content => {
  const doc = content.contentJSON as ContentNode | undefined;
  const paragraph = doc?.content?.find(
    (node): node is ContentNode =>
      (node as ContentNode)?.type === "paragraph" &&
      !!(node as ContentNode).content?.length,
  );

  return {
    ...content,
    content:
      content.content
        ?.split(/\n\s*\n/)
        .map((block) => block.trim())
        .find((block) => block && !block.startsWith("#")) ?? "",
    contentJSON: doc
      ? ({
          ...doc,
          content: paragraph ? [paragraph] : [],
        } as Content["contentJSON"])
      : doc,
  };
};
