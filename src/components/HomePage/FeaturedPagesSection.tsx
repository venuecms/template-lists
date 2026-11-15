import { Suspense } from "react";

import { ErrorBoundary } from "@/components/utils/ErrorBoundary";

import { FeaturedPagesContent } from "./FeaturedPagesContent";

// Optional content, so nothing shows while loading or on error.
export function FeaturedPagesSection({ locale }: { locale: string }) {
  return (
    <ErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <FeaturedPagesContent locale={locale} />
      </Suspense>
    </ErrorBoundary>
  );
}
