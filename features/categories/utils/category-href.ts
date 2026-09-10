import { slugify } from "@/features/product/utils/slugify";


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
