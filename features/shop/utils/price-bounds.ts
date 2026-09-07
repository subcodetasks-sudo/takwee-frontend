import type { Product } from "@/features/product/types";
import type { ShopPriceBounds } from "../types";

/** Derive a rounded TRY price range from a product list. */
export function getPriceBounds(products: Product[]): ShopPriceBounds {
  if (products.length === 0) {
    return { min: 0, max: 0 };
  }

  const prices = products.map((product) => product.priceTRY);
  const rawMin = Math.min(...prices);
  const rawMax = Math.max(...prices);

  const step = 50;
  const min = Math.floor(rawMin / step) * step;
  const max = Math.ceil(rawMax / step) * step;

  return {
    min,
    max: max === min ? min + step : max,
  };
}
