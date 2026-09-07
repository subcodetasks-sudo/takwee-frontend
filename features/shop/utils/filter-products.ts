import {
  PRODUCT_SWATCH_CLASSES,
  type AbayaSize,
  type Product,
  type ProductBadge,
  type ProductSwatchId,
} from "@/features/product/types";
import type { ShopFilter } from "@/features/product/utils/shop-filters";
import type { ShopFilterState, ShopPriceBounds, ShopSort } from "../types";

export const ABAYA_SIZES: AbayaSize[] = ["52", "54", "56", "58", "60"];

export const PRODUCT_SWATCH_IDS = Object.keys(
  PRODUCT_SWATCH_CLASSES,
) as ProductSwatchId[];

export const PRODUCT_BADGES: ProductBadge[] = ["sale", "new"];

export function createDefaultFilterState(
  bounds: ShopPriceBounds,
): ShopFilterState {
  return {
    sizes: [],
    colors: [],
    badges: [],
    priceRange: [bounds.min, bounds.max],
    inStockOnly: false,
    includesSheila: false,
    sort: "featured",
  };
}

export function countActiveFilters(
  filters: ShopFilterState,
  bounds: ShopPriceBounds,
): number {
  let count = 0;
  if (filters.sizes.length > 0) count += 1;
  if (filters.colors.length > 0) count += 1;
  if (filters.badges.length > 0) count += 1;
  if (
    filters.priceRange[0] > bounds.min ||
    filters.priceRange[1] < bounds.max
  ) {
    count += 1;
  }
  if (filters.inStockOnly) count += 1;
  if (filters.includesSheila) count += 1;
  return count;
}

/** Soft path presets until products carry explicit category fields. */
export function applyShopPathFilter(
  products: Product[],
  pathFilter?: ShopFilter,
): Product[] {
  if (!pathFilter) return products;

  switch (pathFilter) {
    case "new-in":
      return products.filter((product) => product.badge === "new");
    case "sale":
      return products.filter(
        (product) =>
          product.badge === "sale" ||
          (product.compareAtPriceTRY != null &&
            product.compareAtPriceTRY > product.priceTRY),
      );
    case "linen":
      return products.filter((product) =>
        /linen|silk/i.test(`${product.slug} ${product.nameKey}`),
      );
    case "travel":
      return products.filter((product) =>
        /travel|kimono/i.test(`${product.slug} ${product.nameKey}`),
      );
    case "casual":
      return products.filter((product) =>
        /aline|kimono|travel|linen/i.test(`${product.slug} ${product.nameKey}`),
      );
    case "formal":
      return products.filter((product) =>
        /heritage|silk|midnight|jacquard|embroider/i.test(
          `${product.slug} ${product.nameKey}`,
        ),
      );
    case "abayas":
      return products;
    case "inners":
    case "accessories":
      return [];
    default:
      return products;
  }
}

function matchesFilters(product: Product, filters: ShopFilterState): boolean {
  if (
    filters.sizes.length > 0 &&
    !filters.sizes.some((size) => product.sizes.includes(size))
  ) {
    return false;
  }

  if (
    filters.colors.length > 0 &&
    !filters.colors.some((swatch) =>
      product.colors.some((color) => color.swatch === swatch),
    )
  ) {
    return false;
  }

  if (filters.badges.length > 0) {
    const isOnSale =
      product.badge === "sale" ||
      (product.compareAtPriceTRY != null &&
        product.compareAtPriceTRY > product.priceTRY);
    const productBadges: ProductBadge[] = [];
    if (isOnSale) productBadges.push("sale");
    if (product.badge === "new") productBadges.push("new");

    if (!filters.badges.some((badge) => productBadges.includes(badge))) {
      return false;
    }
  }

  const [minPrice, maxPrice] = filters.priceRange;
  if (product.priceTRY < minPrice || product.priceTRY > maxPrice) {
    return false;
  }

  if (filters.inStockOnly && !product.inStock) {
    return false;
  }

  if (filters.includesSheila && !product.includesSheila) {
    return false;
  }

  return true;
}

function sortProducts(products: Product[], sort: ShopSort): Product[] {
  const sorted = [...products];

  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.priceTRY - b.priceTRY);
    case "price-desc":
      return sorted.sort((a, b) => b.priceTRY - a.priceTRY);
    case "newest":
      return sorted.sort((a, b) => {
        const aNew = a.badge === "new" ? 1 : 0;
        const bNew = b.badge === "new" ? 1 : 0;
        return bNew - aNew;
      });
    case "featured":
    default:
      return sorted;
  }
}

export function filterAndSortProducts(
  products: Product[],
  filters: ShopFilterState,
): Product[] {
  const matched = products.filter((product) => matchesFilters(product, filters));
  return sortProducts(matched, filters.sort);
}

export function toggleListValue<T extends string>(
  list: T[],
  value: T,
): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}
