import { ColumnLeft, ColumnRight, TwoColumnLayout } from "@/components/layout";
import { Skeleton } from "@/components/ui/Input/Skeleton";

/**
 * The artist grid's placeholder: the /artists listing's Suspense fallback, its
 * route loading state, and the loading state of a page typed as an artist
 * listing. Kept apart from the listing so client loading states can import it.
 */
export function ProfilesListSkeleton() {
  return (
    <TwoColumnLayout>
      <ColumnLeft className="text-sm text-secondary">
        <div className="pb-8">
          <Skeleton className="w-32" />
        </div>
      </ColumnLeft>
      <ColumnRight>
        <div className="grid max-w-fit gap-24 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-6">
              <Skeleton className="aspect-video w-full sm:w-80" />
              <Skeleton className="w-32" />
              <Skeleton className="w-48" />
            </div>
          ))}
        </div>
      </ColumnRight>
    </TwoColumnLayout>
  );
}
