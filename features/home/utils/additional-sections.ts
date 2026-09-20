import { asArray } from "@/lib/as-array";
import type { AdditionalSection } from "../types";

export function getActiveAdditionalSections(
  sections: AdditionalSection[] = [],
): AdditionalSection[] {
  return asArray<AdditionalSection>(sections)
    .filter((section) => section.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((section) => ({
      ...section,
      products: asArray(section.products).slice(0, 4),
    }));
}
