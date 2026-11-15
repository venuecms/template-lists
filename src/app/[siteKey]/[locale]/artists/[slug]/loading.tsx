import { ColumnLeft, ColumnRight, TwoColumnLayout } from "@/components/layout";
import { Skeleton } from "@/components/ui/Input/Skeleton";

/**
 * The route's Suspense boundary below the shared layout, so navigating
 * between artists shows this at once rather than blocking on the URL the page
 * awaits. Shaped like the profile: name and image left, bio right.
 */
export default function Loading() {
  return (
    <TwoColumnLayout>
      <ColumnLeft>
        <div className="flex flex-col gap-12">
          <Skeleton className="w-40" />
          <Skeleton className="aspect-square" />
        </div>
      </ColumnLeft>
      <ColumnRight className="max-w-5xl">
        <div className="flex flex-col gap-6">
          <Skeleton />
          <Skeleton />
          <Skeleton className="w-3/4" />
          <Skeleton />
          <Skeleton className="w-5/6" />
        </div>
      </ColumnRight>
    </TwoColumnLayout>
  );
}
