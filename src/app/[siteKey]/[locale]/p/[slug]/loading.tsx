"use client";

import { useLayoutEffect, useState } from "react";

import { ProfilesListSkeleton } from "@/components/ArtistsPage/ProfilesListSkeleton";
import {
  EventListSkeleton,
  NewsArticleSkeleton,
  PageSkeleton,
  ProductGridSkeleton,
} from "@/components/PageSkeletons";
import { usePageTypes } from "@/components/PageTypes";
import {
  type PageListingLayout,
  resolvePageListingLayout,
} from "@/components/utils/pageLayout";

const SKELETONS: Record<PageListingLayout | "page", () => React.ReactNode> = {
  page: PageSkeleton,
  events: EventListSkeleton,
  products: ProductGridSkeleton,
  profiles: ProfilesListSkeleton,
  news: NewsArticleSkeleton,
};

/**
 * Also the route's Suspense boundary below the shared layout: the page awaits
 * `params`, and without a boundary here a navigation between pages would
 * block on that URL data instead of showing this at once.
 *
 * Shaped like the page being opened: a product listing gets the product grid,
 * an event listing tour-date lines, and so on.
 *
 * The slug comes from the browser's address, not useParams(): reading params
 * here would make this shell depend on the URL, which is what an instant
 * navigation can't wait on. It is read in a layout effect, after Next has
 * pushed the new address and before the browser paints, so the right shape is
 * the first one seen. A server render, which has no address to read, draws
 * the content page.
 */
export default function Loading() {
  const types = usePageTypes();
  const [layout, setLayout] = useState<PageListingLayout | "page">("page");

  useLayoutEffect(() => {
    const slug = decodeURIComponent(
      window.location.pathname.replace(/\/+$/, "").split("/").pop() ?? "",
    );
    setLayout(resolvePageListingLayout(types[slug] ?? "") ?? "page");
  }, [types]);

  const Skeleton = SKELETONS[layout];
  return <Skeleton />;
}
