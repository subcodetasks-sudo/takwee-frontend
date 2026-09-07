import type { Product } from "@/features/product/types";
import { SAMPLE_PRODUCTS } from "@/features/product/utils/sample-products";
import type { ShopFilter } from "@/features/product/utils/shop-filters";
import { applyShopPathFilter } from "./filter-products";

export function getShopProducts(pathFilter?: ShopFilter): Product[] {
  return applyShopPathFilter(SAMPLE_PRODUCTS, pathFilter);
}
