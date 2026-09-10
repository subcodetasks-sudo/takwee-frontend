import type {
  AbayaSize,
  ProductBadge,
  ProductSwatchId,
} from "@/features/product/types";
import type { ShopFilter } from "@/features/product/utils/shop-filters";

export type ShopSort =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "newest";

export interface ShopPriceBounds {
  min: number;
  max: number;
}

export interface ShopFilterState {
  categories: string[];
  sizes: AbayaSize[];
  colors: ProductSwatchId[];
  badges: ProductBadge[];
  priceRange: [number, number];
  inStockOnly: boolean;
  includesSheila: boolean;
  sort: ShopSort;
}

/** Category checkbox options derived from the loaded catalog. */
export interface ShopCategoryOption {
  id: string;
  name: string;
  count: number;
}

export interface ShopViewProps {
  /** Optional path filter from `/shop/[filter]`. */
  pathFilter?: ShopFilter;
}
