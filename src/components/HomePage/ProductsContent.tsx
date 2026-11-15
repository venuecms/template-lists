import { getProducts, getSite } from "@venuecms/sdk-next";
import { getTranslations } from "next-intl/server";
import { connection } from "next/server";

import { Link } from "@/lib/i18n";

import { ListProduct } from "@/components/ListProduct";

import { HERO_FADE_TRIGGER } from "./heroFade";

/** Products shown on the home page; the rest are on the shop page. */
const PRODUCT_LIMIT = 4;

export async function ProductsContent() {
  await connection();

  const [{ data: products }, { data: site }, t] = await Promise.all([
    getProducts({ limit: PRODUCT_LIMIT }),
    getSite(),
    getTranslations("shop"),
  ]);

  if (!site) return null;

  const topProducts = products?.records.slice(0, PRODUCT_LIMIT);

  return (
    <section className="py-20">
      <div
        className="grid grid-cols-2 gap-8 pb-20 sm:max-w-full sm:grid-cols-4 xl:grid-cols-4"
        // Fades the home page hero out as the first row scrolls into view.
        {...{ [HERO_FADE_TRIGGER]: "" }}
      >
        {topProducts?.length
          ? topProducts.map((product) => (
              <ListProduct
                key={product.slug}
                featured={true}
                product={product}
                site={site}
              />
            ))
          : t("no_products_found")}
      </div>
      <div className="w-full grid-cols-3 sm:grid">
        <span></span>
        <span></span>
        <Link className="flex w-full sm:relative sm:flex-row" href="/shop">
          {t("see_all")}
        </Link>
      </div>
    </section>
  );
}
