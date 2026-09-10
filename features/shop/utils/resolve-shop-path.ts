import type { StorefrontCategory } from "@/features/categories/types";
import {
  isShopFilter,
  type ShopFilter,
} from "@/features/product/utils/shop-filters";

export type ResolvedShopPath =
  | { kind: "all" }
  | { kind: "category"; category: StorefrontCategory }
  | { kind: "promo"; filter: ShopFilter };

/**
 * Map `/shop/[filter]` to an API category, a legacy promo filter, or all products.
 * Returns `null` when the slug is unknown (caller should `notFound()`).
 */
export function resolveShopPath(
  pathFilter: string | undefined,
  categories: StorefrontCategory[],
): ResolvedShopPath | null {
  if (!pathFilter) return { kind: "all" };

  const bySlug = categories.find((category) => category.slug === pathFilter);
  if (bySlug) {
    return { kind: "category", category: bySlug };
  }

  if (isShopFilter(pathFilter)) {
    return { kind: "promo", filter: pathFilter };
  }

  return null;
}

/** Find the category for a path filter (client ShopHero / hooks). */
export function findCategoryForFilter(
  pathFilter: string | undefined,
  categories: StorefrontCategory[],
): StorefrontCategory | undefined {
  const resolved = resolveShopPath(pathFilter, categories);
  return resolved?.kind === "category" ? resolved.category : undefined;
}
