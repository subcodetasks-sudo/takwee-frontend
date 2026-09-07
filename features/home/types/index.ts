import type { Product } from "@/features/product";

export interface HeroSlide {
  id: string;
  image: string;
  tagKey: "slide1Tag" | "slide2Tag" | "slide3Tag";
  titleKey: "slide1Title" | "slide2Title" | "slide3Title";
  descriptionKey: "slide1Description" | "slide2Description" | "slide3Description";
  ctaKey: "slide1Cta" | "slide2Cta" | "slide3Cta";
  href: string;
}

export interface CategoryItem {
  id: string;
  image: string;
  titleKey: string;
  href: string;
}

/** Curated home blocks managed from the dashboard later. */
export interface AdditionalSection {
  id: string;
  /** URL segment for the section page (`/collections/[slug]` later). */
  slug: string;
  /** Message key under `AdditionalSections.sections.<key>`. */
  messageKey: string;
  /** Optional hero banner; omit when the section has no image. */
  bannerImage?: string;
  /** Brand blend tone for the banner overlay. Defaults to primary. */
  bannerTone?: "primary" | "secondary";
  /** Destination for the collection / "View more" CTA. */
  href: string;
  /** Up to 4 products shown in the section grid. */
  products: Product[];
  sortOrder: number;
  isActive: boolean;
}
