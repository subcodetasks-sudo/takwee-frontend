import type { AdditionalSection } from "../types";

export function getActiveAdditionalSections(
  sections: AdditionalSection[] = [],
): AdditionalSection[] {
  return sections
    .filter((section) => section.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((section) => ({
      ...section,
      products: section.products.slice(0, 4),
    }));
}
