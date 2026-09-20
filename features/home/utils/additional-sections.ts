import { asArray } from "@/lib/as-array";
import type { Product } from "@/features/product";
import type { AdditionalSection } from "../types";

export function getActiveAdditionalSections(
  sections: AdditionalSection[] = [],
): AdditionalSection[] {
  return asArray<AdditionalSection>(sections)
    .filter((section) => section.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((section) => ({
      ...section,
      products: asArray<Product>(section.products).slice(0, 4),
    }));
}
