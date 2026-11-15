import { ColumnLeft, ColumnRight, TwoColumnLayout } from "@/components/layout";
import { Skeleton } from "@/components/ui/Input/Skeleton";

/**
 * The route's Suspense boundary below the shared layout, so navigating
 * between articles shows this at once rather than blocking on the URL the
 * page awaits. Shaped like the article: sidebar list left (below on mobile),
 * title, date, image and body right.
 */
export default function Loading() {
  return (
    <TwoColumnLayout>
      <ColumnLeft className="order-last lg:order-none">
        <div className="flex flex-col gap-3">
          <Skeleton className="w-32" />
          <Skeleton className="w-48" />
          <Skeleton className="w-40" />
          <Skeleton className="w-44" />
        </div>
      </ColumnLeft>
      <ColumnRight className="gap-6">
        <Skeleton className="w-64" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="aspect-video" />
        <div className="flex flex-col gap-6">
          <Skeleton />
          <Skeleton />
          <Skeleton className="w-3/4" />
          <Skeleton className="w-5/6" />
        </div>
      </ColumnRight>
    </TwoColumnLayout>
  );
}
