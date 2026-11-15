/**
 * Loading placeholders for the page layouts, one per shape a page can take.
 * Plain components with no server dependencies, so both route loading files
 * and the client-side /p loading state can render them.
 */
import { ColumnLeft, ColumnRight, TwoColumnLayout } from "@/components/layout";
import { Skeleton } from "@/components/ui/Input/Skeleton";

const TextLines = () => (
  <div className="flex flex-col gap-6">
    <Skeleton />
    <Skeleton />
    <Skeleton className="w-3/4" />
    <Skeleton />
    <Skeleton className="w-5/6" />
  </div>
);

/** A content page: title on the left, body on the right. */
export function PageSkeleton() {
  return (
    <TwoColumnLayout>
      <ColumnLeft>
        <Skeleton className="w-32" />
      </ColumnLeft>
      <ColumnRight className="max-w-4xl">
        <TextLines />
      </ColumnRight>
    </TwoColumnLayout>
  );
}

/**
 * An event listing page: title on the left, one-line tour dates on the right
 * (EventLines), each a bar centred in a line of text.
 */
export function EventListSkeleton() {
  return (
    <TwoColumnLayout>
      <ColumnLeft>
        <Skeleton className="w-32" />
      </ColumnLeft>
      <ColumnRight>
        <div className="flex flex-col">
          {["w-2/3", "w-1/2", "w-3/4", "w-2/5", "w-3/5", "w-1/2", "w-2/3"].map(
            (width, i) => (
              <div key={i} className="flex h-6 items-center">
                <Skeleton className={`h-3 ${width}`} />
              </div>
            ),
          )}
        </div>
      </ColumnRight>
    </TwoColumnLayout>
  );
}

/**
 * A product listing page: the full-width grid of the products layout
 * (PageListing) and ProductListingBlock, each a square over a title line.
 */
export function ProductGridSkeleton() {
  return (
    <section className="pb-20 pt-6">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col gap-8 pb-8 sm:gap-0">
            <div className="pb-3">
              <Skeleton className="aspect-square" />
            </div>
            <div className="flex h-6 items-center">
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * A news article or news page: sidebar list left (below on mobile), title,
 * date, image and body right.
 */
export function NewsArticleSkeleton() {
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
        <TextLines />
      </ColumnRight>
    </TwoColumnLayout>
  );
}
