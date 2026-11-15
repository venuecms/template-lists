import { Product, Site, getLocalizedContent } from "@venuecms/sdk-next";
import { useLocale } from "next-intl";
import { ReactNode } from "react";

import { Link } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import { VenueImage } from "@/components/VenueImage";

export const ListProduct = ({
  product,
  site,
  featured,
  className,
}: {
  product: Product;
  site: Site;
  featured?: boolean;
  className?: string;
}) => {
  const locale = useLocale();

  const { content } = getLocalizedContent(product?.localizedContent, locale);
  const buyLink = firstBuyLink(product);

  return (
    <div
      className={cn(
        "flex break-inside-avoid flex-col gap-8 pb-8 sm:gap-0",
        className,
      )}
    >
      <div className="w-full pb-3 sm:w-auto sm:max-w-full">
        <ProductLink product={product} buyLink={buyLink}>
          <VenueImage
            image={product.image}
            aspect="square"
            className="motion-safe:transition-transform motion-safe:duration-1000 motion-safe:hover:scale-[1.02]"
          />
        </ProductLink>
      </div>
      <div className="flex min-w-0 flex-row flex-wrap gap-x-2 break-words">
        {product.author ? (
          <div className="text-secondary">{product.author}</div>
        ) : null}
        <div className="text-primary">
          <ProductLink product={product} buyLink={buyLink}>
            {content.title}
          </ProductLink>
        </div>
      </div>
    </div>
  );
};

/** The first variant, in display order, that has somewhere to buy it. */
const firstBuyLink = (product: Product) =>
  [...(product.variants ?? [])]
    .sort((a, b) => a.order - b.order)
    .find((variant) => variant.externalLink)?.externalLink;

/**
 * Goes straight to the buy link, off-site in a new tab, so the grid is a way
 * to buy rather than a way to read. A product with nowhere to buy it still
 * opens its own page.
 */
const ProductLink = ({
  product,
  buyLink,
  children,
}: {
  product: Product;
  buyLink?: string | null;
  children: ReactNode;
}) =>
  buyLink ? (
    <a href={buyLink} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <Link href={`/shop/${product.slug}`}>{children}</Link>
  );
