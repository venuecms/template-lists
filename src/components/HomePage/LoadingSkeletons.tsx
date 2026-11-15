import { ColumnLeft, ColumnRight, TwoColumnLayout } from "@/components/layout";
import { Skeleton } from "@/components/ui/Input/Skeleton";

export function FeaturedEventsSkeleton() {
  return (
    <div className="flex flex-col pb-16">
      {/* Desktop layout */}
      <TwoColumnLayout className="hidden">
        <ColumnLeft>
          <Skeleton className="aspect-square" />
        </ColumnLeft>
        <ColumnRight className="max-w-4xl gap-16">
          <Skeleton className="w-48" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton />
            <Skeleton />
            <Skeleton className="w-2/3" />
          </div>
        </ColumnRight>
      </TwoColumnLayout>

      {/* Mobile layout */}
      <div className="flex sm:hidden">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <Skeleton className="w-48" />
            <Skeleton className="w-32" />
          </div>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="aspect-square" />
          <div className="flex flex-col gap-2">
            <Skeleton />
            <Skeleton />
            <Skeleton className="w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturedProfilesSkeleton() {
  return (
    <section className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-3 sm:py-24 lg:gap-36">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col gap-4">
          <Skeleton className="w-32" />
          <div className="flex flex-col gap-2">
            <Skeleton className="w-56" />
            <Skeleton className="w-56" />
            <Skeleton className="w-48" />
          </div>
        </div>
      ))}
    </section>
  );
}

export function ProductsSkeleton() {
  return (
    <section className="py-20">
      <div className="pb-8">
        <Skeleton className="w-16" />
      </div>

      <div className="grid grid-cols-2 gap-8 pb-20 sm:max-w-full sm:grid-cols-4 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="aspect-square" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
