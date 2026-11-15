import { Params } from "@/types";

import { redirect } from "@/lib/i18n";

/**
 * Sends an old index route (/archive, /events, /shop) to the CMS page with the
 * same slug, which now renders that content itself. Kept so existing links and
 * bookmarks still land somewhere.
 */
export const redirectToPage = async (slug: string, params: Promise<Params>) => {
  const { locale } = await params;
  redirect({ href: `/p/${slug}`, locale });
};
