import { Suspense } from "react";

import { ColumnLeft, ColumnRight, TwoColumnLayout } from "@/components/layout";
import { ErrorBoundary } from "@/components/utils/ErrorBoundary";

import { ProfilesListContent } from "./ProfilesListContent";
import { ProfilesListSkeleton } from "./ProfilesListSkeleton";

function ProfilesListError() {
  return (
    <TwoColumnLayout>
      <ColumnLeft className="text-sm text-secondary" />
      <ColumnRight>
        <p className="text-secondary">
          Unable to load artists. Please try refreshing the page.
        </p>
      </ColumnRight>
    </TwoColumnLayout>
  );
}

/** The artist grid behind /artists, with its skeleton and error states. */
export function ProfilesListSection({
  locale,
  currentPage,
}: {
  locale: string;
  currentPage: number;
}) {
  return (
    <ErrorBoundary fallback={<ProfilesListError />}>
      <Suspense fallback={<ProfilesListSkeleton />}>
        <ProfilesListContent locale={locale} currentPage={currentPage} />
      </Suspense>
    </ErrorBoundary>
  );
}
