import type { Product } from "@/features/product";

export type {
  ApiAdvertisementTape,
  ApiHomeCategory,
  ApiHomeHero,
  ApiHomePageData,
  ApiHomePageResponse,
  ApiHomeProduct,
  ApiHomeProductCategory,
} from "./api";

export interface AdvertisementTape {
  id: string;
  text: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  description: string;
  /** Optional badge above the title. */
  tag?: string;
  href: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  image: string | null;
  href: string;
}

/** Curated home blocks — from API category + product groupings or mocks. */
export interface AdditionalSection {
  id: string;
  /** URL segment for the section page (`/shop/...` or collections later). */
  slug: string;
  /** Display title from the API (preferred over `messageKey`). */
  title?: string;
  /** Display description from the API (preferred over `messageKey`). */
  description?: string;
  /** Message key under `AdditionalSections.sections.<key>` for mock/i18n fallback. */
  messageKey?: string;
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

export interface HomePageData {
  heroes: HeroSlide[];
  advertisementTapes: AdvertisementTape[];
  categories: CategoryItem[];
  sections: AdditionalSection[];
  products: Product[];
}
