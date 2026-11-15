import { Suspense } from "react";

import { ErrorBoundary } from "@/components/utils/ErrorBoundary";

import { FeaturedProfilesError } from "./ErrorFallbacks";
import { FeaturedProfilesContent } from "./FeaturedProfilesContent";
import { FeaturedProfilesSkeleton } from "./LoadingSkeletons";

export function FeaturedProfilesSection({ locale }: { locale: string }) {
  return (
    <ErrorBoundary fallback={<FeaturedProfilesError />}>
      <Suspense fallback={<FeaturedProfilesSkeleton />}>
        <FeaturedProfilesContent locale={locale} />
      </Suspense>
    </ErrorBoundary>
  );
}
