import { ProfilesListSkeleton } from "@/components/ArtistsPage";

/**
 * The route's Suspense boundary below the shared layout, so navigating here
 * shows the grid at once rather than blocking on the URL the page awaits.
 */
export default function Loading() {
  return <ProfilesListSkeleton />;
}
