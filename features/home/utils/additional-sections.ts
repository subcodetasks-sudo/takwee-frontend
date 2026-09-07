import { SAMPLE_PRODUCTS } from "@/features/product";
import type { AdditionalSection } from "../types";

/**
 * Placeholder additional sections until the dashboard API supplies them.
 * Keep each `products` array at most 4 items — that is the home display cap.
 */
export const HOME_ADDITIONAL_SECTIONS: AdditionalSection[] = [
  {
    id: "new-arrivals",
    slug: "new-arrivals",
    messageKey: "newArrivals",
    bannerImage: "/imgs/hero-slide-1.jpg",
    bannerTone: "primary",
    href: "/collections/new-arrivals",
    products: SAMPLE_PRODUCTS.slice(0, 4),
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "linen-edit",
    slug: "linen-edit",
    messageKey: "linenEdit",
    // No banner — header text is centered in the section.
    href: "/collections/linen-edit",
    products: [
      SAMPLE_PRODUCTS[0],
      SAMPLE_PRODUCTS[2],
      SAMPLE_PRODUCTS[1],
      SAMPLE_PRODUCTS[3],
    ],
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "evening-edit",
    slug: "evening-edit",
    messageKey: "eveningEdit",
    bannerImage: "/imgs/hero-slide-3.jpg",
    bannerTone: "secondary",
    href: "/collections/evening-edit",
    products: [
      SAMPLE_PRODUCTS[2],
      SAMPLE_PRODUCTS[1],
      SAMPLE_PRODUCTS[0],
      SAMPLE_PRODUCTS[3],
    ],
    sortOrder: 3,
    isActive: true,
  },
];

export function getActiveAdditionalSections(
  sections: AdditionalSection[] = HOME_ADDITIONAL_SECTIONS,
): AdditionalSection[] {
  return sections
    .filter((section) => section.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((section) => ({
      ...section,
      products: section.products.slice(0, 4),
    }));
}
