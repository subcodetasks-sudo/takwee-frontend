import type { StorefrontCategory } from "@/features/categories/types";
import { slugify } from "@/features/product/utils/slugify";
import {
  isShopFilter,
  type ShopFilter,
} from "@/features/product/utils/shop-filters";

export type ResolvedShopPath =
  | { kind: "all" }
  | { kind: "category"; category: StorefrontCategory }
  | { kind: "promo"; filter: ShopFilter };

/** Match panel / WhatsApp deep links: `5` or `category-5`. */
export function parseCategoryIdAlias(pathFilter: string): string | null {
  const decoded = decodeURIComponent(pathFilter).trim();
  if (/^\d+$/.test(decoded)) return decoded;
  const match = /^category-(\d+)$/i.exec(decoded);
  return match?.[1] ?? null;
}

/**
 * Map `/shop/[filter]` to an API category, a legacy promo filter, or all products.
 * Returns `null` when the slug is unknown (caller should `notFound()`).
 *
 * Accepts:
 * - Canonical `category-{id}` slugs
 * - Legacy name slugs (e.g. `/shop/bags` from older EN links)
 * - Bare numeric category ids
 */
export function resolveShopPath(
  pathFilter: string | undefined,
  categories: StorefrontCategory[],
): ResolvedShopPath | null {
  if (!pathFilter) return { kind: "all" };

  const decoded = decodeURIComponent(pathFilter);

  const bySlug = categories.find(
    (category) => category.slug === pathFilter || category.slug === decoded,
  );
  if (bySlug) {
    return { kind: "category", category: bySlug };
  }

  const idAlias = parseCategoryIdAlias(pathFilter);
  if (idAlias) {
    const byId = categories.find((category) => category.id === idAlias);
    if (byId) {
      return { kind: "category", category: byId };
    }
  }

  // Legacy name-based paths (pre–id-stable slugs), e.g. `/shop/bags`.
  const byLegacyName = categories.find((category) => {
    const nameSlug = slugify(category.name);
    return Boolean(nameSlug) && (nameSlug === pathFilter || nameSlug === decoded);
  });
  if (byLegacyName) {
    return { kind: "category", category: byLegacyName };
  }

  if (isShopFilter(pathFilter) || isShopFilter(decoded)) {
    return {
      kind: "promo",
      filter: (isShopFilter(pathFilter) ? pathFilter : decoded) as ShopFilter,
    };
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
