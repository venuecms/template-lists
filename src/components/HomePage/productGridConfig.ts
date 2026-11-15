/**
 * The home page product grid's size, read from the site's template config
 * (`homeProductCount`, `homeProductColumns` in public/_venue/config.schema.json).
 *
 * Both are maximums: the grid shows up to that many products, in up to that
 * many columns, and never more columns than it has products to fill.
 *
 * The config is stored JSON an editor typed, so anything missing, non-integer
 * or out of range falls back to the default rather than breaking the grid.
 */

export const PRODUCT_COUNT = { default: 2, min: 0, max: 24 };
export const PRODUCT_COLUMNS = { default: 2, min: 1, max: 6 };

/**
 * Whole class strings, so Tailwind sees each one. Below four columns phones
 * get one; from four up, two, so a long run of products isn't a single
 * endless column. Five and six step through three on mid-size screens, where
 * that many squares across would be too small.
 */
const COLUMN_CLASSES: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
};

const readInt = (
  value: unknown,
  { default: fallback, min, max }: typeof PRODUCT_COUNT,
) =>
  typeof value === "number" &&
  Number.isInteger(value) &&
  value >= min &&
  value <= max
    ? value
    : fallback;

export const productGridConfig = (config: Record<string, unknown> = {}) => ({
  maxCount: readInt(config.homeProductCount, PRODUCT_COUNT),
  maxColumns: readInt(config.homeProductColumns, PRODUCT_COLUMNS),
});

/** Grid classes for `itemCount` products in at most `maxColumns` columns. */
export const productGridColumnClasses = (
  maxColumns: number,
  itemCount: number,
) =>
  COLUMN_CLASSES[
    Math.min(Math.max(Math.min(maxColumns, itemCount), 1), PRODUCT_COLUMNS.max)
  ];

/**
 * Padding on each product at a two-column maximum, where two squares would
 * otherwise fill the page edge to edge. From `sm` only: phones are one column
 * there, and the padding would just shrink the image.
 */
export const productGridItemClasses = (maxColumns: number) =>
  maxColumns === 2 ? "sm:px-24" : undefined;
