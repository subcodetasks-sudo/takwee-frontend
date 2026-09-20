import { asArray } from "@/lib/as-array";
import { resolveImageUrl } from "@/lib/images";
import type { ApiCategory, StorefrontCategory } from "../types";
import { categoryHref, categorySlug } from "./category-href";

export function mapCategory(category: ApiCategory): StorefrontCategory {
  const imageSrc = category.image?.trim() || null;
  const slug = categorySlug(category.name, category.id);

  return {
    id: String(category.id),
    name: category.name,
    slug,
    image: imageSrc ? resolveImageUrl(imageSrc) || imageSrc : null,
    href: categoryHref(category.name, category.id),
    sortOrder: category.sort_order,
    isHero: category.is_hero,
  };
}

/** Active categories only, sorted by `sort_order` then id. */
export function mapCategories(categories: ApiCategory[]): StorefrontCategory[] {
  return asArray<ApiCategory>(categories)
    .filter((category) => category.status === "active")
    .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
    .map(mapCategory);
}
