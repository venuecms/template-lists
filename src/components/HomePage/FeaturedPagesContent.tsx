import {
  VenueContent,
  type Page as VenuePage,
  getLocalizedContent,
  getPages,
} from "@venuecms/sdk-next";
import { connection } from "next/server";

import { renderedStyles } from "@/components/utils/styles";
import { hasTag } from "@/components/utils/tags";

import { FullBleedOnView } from "./FullBleedOnView";

/**
 * Featured, unexpired pages in nav order. Filtered here because the API
 * ignores the `featured` query on the pages endpoint and returns every page.
 */
const featuredPages = (pages: VenuePage[], now: number) =>
  pages
    .filter(
      (page) =>
        page.featured &&
        !(
          typeof page.featuredExpiration === "string" &&
          Date.parse(page.featuredExpiration) < now
        ),
    )
    .sort((a, b) => a.order - b.order);

export async function FeaturedPagesContent({ locale }: { locale: string }) {
  await connection();

  // Same call as the nav, so the request is shared.
  const { data: pages } = await getPages();
  const featured = featuredPages(pages?.records ?? [], Date.now());

  if (!featured.length) return null;

  const isVideo = (page: VenuePage) => hasTag(page, "video");
  // This is the last section on the page, so with a video last the page ends
  // flush with the bottom of the player: scrolled to the bottom, the expanded
  // video fills the screen exactly.
  const endsWithVideo = isVideo(featured[featured.length - 1]);

  return (
    <section
      className={`flex flex-col gap-16 pt-20 ${endsWithVideo ? "" : "pb-20"}`}
    >
      {featured.map((page) => {
        const { content } = getLocalizedContent(page.localizedContent, locale);
        // Plain `renderedStyles`: the home page takes no searchParams, so a
        // listing block in a page body couldn't be paged here.
        const body = (
          <VenueContent
            // Empty paragraphs (often left after an embed) would add gaps,
            // and space below a video at the end of the page.
            className="flex flex-col gap-6 [&>p:empty]:hidden"
            content={content}
            contentStyles={renderedStyles}
          />
        );

        return (
          // Labelled by the hidden title, so the section still has a name for
          // screen readers.
          <article key={page.id} aria-label={content.title ?? undefined}>
            {isVideo(page) ? <FullBleedOnView>{body}</FullBleedOnView> : body}
          </article>
        );
      })}
    </section>
  );
}
