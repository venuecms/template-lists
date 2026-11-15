import { describe, expect, it } from "vitest";

import {
  productGridColumnClasses,
  productGridConfig,
  productGridItemClasses,
} from "./productGridConfig";

describe("productGridConfig", () => {
  it("defaults to at most two products in at most two columns", () => {
    expect(productGridConfig()).toEqual({ maxCount: 2, maxColumns: 2 });
  });

  it("reads the configured maximums", () => {
    expect(
      productGridConfig({ homeProductCount: 6, homeProductColumns: 6 }),
    ).toEqual({ maxCount: 6, maxColumns: 6 });
  });

  it("allows a count of zero, which hides the grid", () => {
    expect(productGridConfig({ homeProductCount: 0 }).maxCount).toBe(0);
  });

  it.each([-1, 25, 2.5, "4", null])(
    "falls back to the default for a count of %s",
    (value) => {
      expect(productGridConfig({ homeProductCount: value }).maxCount).toBe(2);
    },
  );

  it.each([0, 7, "3"])("falls back to two columns for %s", (value) => {
    expect(productGridConfig({ homeProductColumns: value }).maxColumns).toBe(2);
  });
});

describe("productGridColumnClasses", () => {
  it.each([
    [1, "grid-cols-1"],
    [2, "grid-cols-1 sm:grid-cols-2"],
    [3, "grid-cols-1 sm:grid-cols-3"],
  ])("puts %i columns in one column on phones", (columns, classes) => {
    expect(productGridColumnClasses(columns, 10)).toBe(classes);
  });

  it.each([4, 5, 6])("puts %i columns in two on phones", (columns) => {
    expect(productGridColumnClasses(columns, 10)).toMatch(/^grid-cols-2 /);
  });

  it("uses no more columns than there are products", () => {
    // Four allowed but only three products: three columns, and one on phones.
    expect(productGridColumnClasses(4, 3)).toBe("grid-cols-1 sm:grid-cols-3");
  });

  it("still lays out a grid with no products", () => {
    expect(productGridColumnClasses(4, 0)).toBe("grid-cols-1");
  });
});

describe("productGridItemClasses", () => {
  it("pads products when at most two columns are allowed", () => {
    expect(productGridItemClasses(2)).toBe("sm:px-24");
  });

  it.each([1, 3, 4, 6])("leaves products unpadded at %i columns", (columns) => {
    expect(productGridItemClasses(columns)).toBeUndefined();
  });
});
