import {
  type SearchParams,
  VenueContent,
  type Page as VenuePage,
  getLocalizedContent,
} from "@venuecms/sdk-next";
import { useLocale } from "next-intl";
import { ReactNode } from "react";

import { PageWithParent } from "@/lib/utils/tree";

import { contentComponents, pageBodyStyles } from "@/components/ListingBlock";
import { VenueImage } from "@/components/VenueImage";

import { PageTree } from "../PageTree";
import { ProfileCompact } from "../ProfileCompact";
import {
  ColumnLeft,
  ColumnRight,
  TwoColumnLayout,
  TwoSubColumnLayout,
  stickyColumnTitle,
} from "../layout";

export const Page = ({
  page,
  pages,
  searchParams,
}: {
  page: VenuePage;
  pages: Array<PageWithParent>;
  /**
   * The route's search params, for the pagers on any listing blocks in this
   * content. Only a route segment can read them, so they are passed down.
   *
   * Required rather than optional: a caller that forgets it costs every listing
   * in this content its pager, and does so silently — the records still render.
   * A surface that genuinely has no URL to page by passes `{}` and says so.
   */
  searchParams: SearchParams;
}) => {
  return (
    <>
      <PageSection
        page={page}
        aside={<PageTree pages={pages} />}
        searchParams={searchParams}
      />
      <SubPages page={page} pages={pages} searchParams={searchParams} />
    </>
  );
};

/**
 * A page's direct sub-pages, in nav order, each drawn in the page layout
 * below it. Used after both the page layout and the listing layouts, so a
 * listing page's sub-pages show too. Links have no body of their own to show.
 */
export const SubPages = ({
  page,
  pages,
  searchParams,
}: {
  page: VenuePage;
  pages: Array<PageWithParent>;
  searchParams: SearchParams;
}) =>
  pages
    .filter((child) => child.parentId === page.id && child.type !== "LINK")
    .sort((a, b) => a.order - b.order)
    .map((subPage) => (
      <PageSection
        key={subPage.id}
        page={subPage}
        searchParams={searchParams}
        // The section above already pads its bottom; padding this top as
        // well doubled the gap between them.
        className="pt-0 lg:pt-0"
      />
    ));

/**
 * One page in the page layout: title, image and `aside` on the left, body and
 * artists on the right. The parent and each of its sub-pages are drawn the
 * same way, stacked down the page.
 */
const PageSection = ({
  page,
  aside,
  searchParams,
  className,
}: {
  page: VenuePage;
  aside?: ReactNode;
  searchParams: SearchParams;
  className?: string;
}) => {
  const locale = useLocale();

  const { artists = [] } = page;
  const { content } = getLocalizedContent(page?.localizedContent, locale);

  return (
    <TwoColumnLayout className={className}>
      {/* Title a direct child of the column, so it can stick for the
          section's full height. */}
      <ColumnLeft className="gap-12">
        <div className={stickyColumnTitle}>{content.title}</div>
        <VenueImage image={page.image} />
        {aside}
      </ColumnLeft>

      <ColumnRight>
        <VenueContent
          className={pageBodyStyles}
          content={content}
          contentStyles={contentComponents}
          searchParams={searchParams}
        />
        <TwoSubColumnLayout>
          {artists.map(({ profile }) => (
            <ProfileCompact key={profile.slug} profile={profile} />
          ))}
        </TwoSubColumnLayout>
      </ColumnRight>
    </TwoColumnLayout>
  );
};
