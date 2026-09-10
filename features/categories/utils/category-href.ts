import { slugify } from "@/features/product/utils/slugify";

/**
 * Legacy name → old hardcoded shop filter (for resolving `/shop/linen` etc.
 * when the URL still uses a preset slug instead of the category's own slug).
 */
export const LEGACY_CATEGORY_TO_FILTER: Record<string, string> = {
  abayas: "abayas",
  linen: "linen",
  "bed linen": "linen",
  casual: "casual",
  formal: "formal",
  travel: "travel",
  dresses: "inners",
  inners: "inners",
  hijabs: "accessories",
  accessories: "accessories",
  bags: "accessories",
  shoes: "accessories",
  sale: "sale",
  "new-in": "new-in",
  "new in": "new-in",
};

/** Stable kebab slug for `/shop/[filter]` from a category name (+ id fallback). */
export function categorySlug(name: string, id?: string | number): string {
  const slug = slugify(name);
  return slug || (id != null ? `category-${id}` : "category");
}

/** Unique category PLP href — one slug per API category (no shared buckets). */
export function categoryHref(
  name: string,
  id?: string | number,
): `/shop/${string}` {
  return `/shop/${categorySlug(name, id)}`;
}
