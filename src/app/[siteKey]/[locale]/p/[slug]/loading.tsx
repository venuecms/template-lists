import { ColumnLeft, ColumnRight, TwoColumnLayout } from "@/components/layout";
import { Skeleton } from "@/components/ui/Input/Skeleton";

/**
 * Also the route's Suspense boundary below the shared layout: the page awaits
 * `params`, and without a boundary here a navigation between pages would
 * block on that URL data instead of showing this shell instantly.
 *
 * Shaped like the page layout (title on the left, body on the right), which
 * the listing layouts share closely enough.
 */
export default function Loading() {
  return (
    <TwoColumnLayout>
      <ColumnLeft>
        <Skeleton className="w-32" />
      </ColumnLeft>
      <ColumnRight className="max-w-4xl">
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
