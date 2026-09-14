import type {
  Product,
  ProductBadge,
} from "@/features/product/types";
import type { ShopFilter } from "@/features/product/utils/shop-filters";
import type {
  ShopCategoryOption,
  ShopColorOption,
  ShopFilterState,
  ShopPriceBounds,
  ShopSort,
} from "../types";

export function createDefaultFilterState(
  bounds: ShopPriceBounds,
): ShopFilterState {
  return {
    categories: [],
    sizes: [],
    colors: [],
    badges: [],
    priceRange: [bounds.min, bounds.max],
    inStockOnly: false,
    sort: "featured",
  };
}

export function countActiveFilters(
  filters: ShopFilterState,
  bounds: ShopPriceBounds,
): number {
  let count = 0;
  if (filters.categories.length > 0) count += 1;
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
  return count;
}

/** Build unique category options (with counts) from the loaded product list. */
export function getCategoryOptions(products: Product[]): ShopCategoryOption[] {
  const counts = new Map<string, ShopCategoryOption>();

  for (const product of products) {
    const id = product.categoryId?.trim();
    const name = product.categoryName?.trim();
    if (!id || !name) continue;

    const existing = counts.get(id);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(id, { id, name, count: 1 });
    }
  }

  return [...counts.values()].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );
}

/** Derive unique available sizes from the loaded product list. */
export function getSizeOptions(products: Product[]): string[] {
  const sizes = new Set<string>();

  for (const product of products) {
    if (Array.isArray(product.sizes)) {
      for (const size of product.sizes) {
        const name = size?.name?.trim();
        if (name) sizes.add(name);
      }
    }
  }

  return [...sizes].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
  );
}

/** Derive unique available colors from the loaded product list. */
export function getColorOptions(products: Product[]): ShopColorOption[] {
  const map = new Map<string, ShopColorOption>();

  for (const product of products) {
    if (Array.isArray(product.colors)) {
      for (const color of product.colors) {
        const name = color.nameKey?.trim() || "";
        const hex = color.hex?.trim() || "";
        // Group by normalized name if available, otherwise by normalized hex, otherwise by swatch
        const groupKey = (name || hex || color.swatch || "").toLowerCase();
        if (!groupKey) continue;

        const existing = map.get(groupKey);
        if (!existing) {
          map.set(groupKey, {
            id: groupKey,
            name: name || hex || groupKey,
            swatch: color.swatch,
            hex: color.hex,
          });
        } else if (!existing.hex && color.hex) {
          existing.hex = color.hex;
        }
      }
    }
  }

  return [...map.values()].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );
}

/** Derive available badges from the loaded product list. */
export function getBadgeOptions(products: Product[]): ProductBadge[] {
  const badges = new Set<ProductBadge>();

  for (const product of products) {
    const isOnSale =
      product.badge === "sale" ||
      (product.compareAtPriceTRY != null &&
        product.compareAtPriceTRY > product.priceTRY);
    if (isOnSale) badges.add("sale");
    if (product.badge === "new") badges.add("new");
  }

  return [...badges];
}

/** Filter products for promo routes (/shop/new-in, /shop/sale). */
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
    default:
      return products;
  }
}

function matchesFilters(product: Product, filters: ShopFilterState): boolean {
  if (
    filters.categories.length > 0 &&
    (!product.categoryId ||
      !filters.categories.includes(product.categoryId))
  ) {
    return false;
  }

  if (
    filters.sizes.length > 0 &&
    !filters.sizes.some((size) =>
      product.sizes.some((option) => option.name === size),
    )
  ) {
    return false;
  }

  if (
    filters.colors.length > 0 &&
    !filters.colors.some((filterColorKey) =>
      product.colors.some((color) => {
        const name = (color.nameKey || "").trim().toLowerCase();
        const hex = (color.hex || "").trim().toLowerCase();
        const swatch = (color.swatch || "").trim().toLowerCase();
        const id = (color.id || "").trim().toLowerCase();
        const filter = filterColorKey.trim().toLowerCase();

        return (
          name === filter ||
          hex === filter ||
          swatch === filter ||
          id === filter
        );
      }),
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
