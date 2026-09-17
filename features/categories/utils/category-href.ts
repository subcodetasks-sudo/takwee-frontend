import { slugify } from "@/features/product/utils/slugify";

/**
 * Locale-stable kebab slug for `/shop/[filter]`.
 * Always prefers `category-{id}` so AR/EN/TR and panel WhatsApp links share
 * one path (name-only slugs diverge when Accept-Language changes).
 */
export function categorySlug(name: string, id?: string | number): string {
  if (id != null && String(id).trim() !== "") {
    return `category-${id}`;
  }
  return slugify(name) || "category";
}

/** Unique category PLP href — one slug per API category (no shared buckets). */
export function categoryHref(
  name: string,
  id?: string | number,
): `/shop/${string}` {
  return `/shop/${categorySlug(name, id)}`;
}
