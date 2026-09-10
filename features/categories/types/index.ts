export type {
  ApiCategoriesLinks,
  ApiCategoriesMeta,
  ApiCategoriesPage,
  ApiCategoriesResponse,
  ApiCategory,
} from "./api";

/** Storefront category for header / footer nav chrome + shop PLP. */
export interface StorefrontCategory {
  id: string;
  name: string;
  /** Kebab slug used in `/shop/[filter]`. */
  slug: string;
  image: string | null;
  href: `/shop/${string}`;
  sortOrder: number;
  isHero: boolean;
}
