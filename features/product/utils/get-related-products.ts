import type { Product } from "../types";
import { SAMPLE_PRODUCTS } from "./sample-products";

const DEFAULT_LIMIT = 8;

/** Returns other catalog products to surface on the PDP (excludes the current item). */
export function getRelatedProducts(
  productId: string,
  limit = DEFAULT_LIMIT,
): Product[] {
  return SAMPLE_PRODUCTS.filter((product) => product.id !== productId).slice(
    0,
    limit,
  );
}
