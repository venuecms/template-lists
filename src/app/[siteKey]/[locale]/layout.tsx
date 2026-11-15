import { Params } from "@/types";
import { getPages } from "@venuecms/sdk-next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Suspense } from "react";

import { QueryProvider } from "@/lib/providers/QueryProvider";
import { VenueProvider } from "@/lib/utils/VenueProvider";

import { NavigationProgress } from "@/components/NavigationProgress";
import { PageTypesProvider } from "@/components/PageTypes";
import { SearchProvider } from "@/components/Search/provider";
import { SearchResultsLayout } from "@/components/SearchResults";
import { SiteHeader } from "@/components/SiteHeader";
import { ThemedBody } from "@/components/ThemedBody";
import { setupSSR } from "@/components/utils";

import "../../globals.css";
import Loading from "./loading";

const LayoutContent = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) => {
  const { locale, siteKey } = await params;
  await setupSSR({ params });
  // The pages read is the one the nav makes, so this shares its request.
  const [messages, { data: pages }] = await Promise.all([
    getMessages(),
    getPages(),
  ]);
  // Slug to type, for the /p loading state to draw the right skeleton.
  const pageTypes = Object.fromEntries(
    (pages?.records ?? []).map(({ slug, type }) => [slug, type]),
  );

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryProvider>
        <VenueProvider siteKey={siteKey}>
          <PageTypesProvider types={pageTypes}>
            <SearchProvider>
              <Suspense fallback={null}>
                <NavigationProgress />
              </Suspense>
              <Suspense fallback={<Loading />}>
                <ThemedBody>
                  <SiteHeader />
                  <SearchResultsLayout>{children}</SearchResultsLayout>
                </ThemedBody>
              </Suspense>
            </SearchProvider>
          </PageTypesProvider>
        </VenueProvider>
      </QueryProvider>
    </NextIntlClientProvider>
  );
};

const RootLayout = ({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<Params>;
}>) => {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="m-auto bg-background px-6 font-regular text-primary antialiased sm:max-w-[96rem] sm:px-12">
        <Suspense fallback={<Loading />}>
          <LayoutContent params={params}>{children}</LayoutContent>
        </Suspense>
      </body>
    </html>
  );
};

export default RootLayout;
