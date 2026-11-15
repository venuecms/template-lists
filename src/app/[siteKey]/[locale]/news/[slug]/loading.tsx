import { NewsArticleSkeleton } from "@/components/PageSkeletons";

/**
 * The route's Suspense boundary below the shared layout, so navigating
 * between articles shows this at once rather than blocking on the URL the
 * page awaits.
 */
export default function Loading() {
  return <NewsArticleSkeleton />;
}
