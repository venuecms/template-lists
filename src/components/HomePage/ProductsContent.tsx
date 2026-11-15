import { getProducts, getSite } from "@venuecms/sdk-next";
import { getTranslations } from "next-intl/server";
import { connection } from "next/server";

import { cn } from "@/lib/utils";

import { ListProduct } from "@/components/ListProduct";

import { HERO_FADE_TRIGGER } from "./heroFade";
import {
  productGridColumnClasses,
  productGridConfig,
  productGridItemClasses,
} from "./productGridConfig";

export async function ProductsContent() {
  await connection();

  // The site first, since its config sets how many products to fetch. The
  // layout has already read it, so this is the shared request, not a new one.
  const [{ data: site }, t] = await Promise.all([
    getSite(),
    getTranslations("shop"),
  ]);

  if (!site) return null;

  // At most how many products and columns, set per site in the template
  // config; the rest are on the shop page.
  const { maxCount, maxColumns } = productGridConfig(
    site.settings?.publicSite?.template?.config,
  );
  if (!maxCount) return null;

  const { data: products } = await getProducts({ limit: maxCount });
  const topProducts = products?.records.slice(0, maxCount);
  const columnClasses = productGridColumnClasses(
    maxColumns,
    topProducts?.length ?? 0,
  );
  const itemClasses = productGridItemClasses(maxColumns);

  return (
    <section className="py-20">
      <div
        className={cn("grid gap-8 sm:max-w-full", columnClasses)}
        // Fades the home page hero out as the first row scrolls into view.
        {...{ [HERO_FADE_TRIGGER]: "" }}
      >
        {topProducts?.length
          ? topProducts.map((product) => (
              <ListProduct
                key={product.slug}
                featured={true}
                className={itemClasses}
                product={product}
                site={site}
              />
            ))
          : t("no_products_found")}
      </div>
    </section>
  );
}
