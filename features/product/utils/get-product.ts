import type { Product } from "../types";
import { SAMPLE_PRODUCTS } from "./sample-products";

export function getProductBySlug(slug: string): Product | undefined {
  return SAMPLE_PRODUCTS.find((product) => product.slug === slug);
}

export function getAllProductSlugs(): string[] {
  return SAMPLE_PRODUCTS.map((product) => product.slug);
}
