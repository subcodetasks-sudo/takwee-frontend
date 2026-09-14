import type { ApiProduct, Product } from "@/features/product/types";
import type { ApiHomeProduct } from "../types";
import { mapProduct } from "@/features/product/utils/map-product";

/** Map a home-API product into the storefront `Product` model. */
export function mapHomeProduct(product: ApiHomeProduct): Product {
  return mapProduct(product as ApiProduct);
}
