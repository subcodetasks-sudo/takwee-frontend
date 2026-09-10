import { ApiError } from "@/lib/api-client";
import { fetchProducts } from "@/features/shop/api/get-products";
import { fetchProductById } from "../api/get-product-by-id";
import type { Product, ProductReview } from "../types";
import { getProductBySlug as getSampleProductBySlug } from "./get-product";

export interface ProductPageData {
  product: Product;
  reviews: ProductReview[];
}

/**
 * Resolve a PDP by SEO slug: match against the products list, then load
 * detail (with ratings) by id. Falls back to sample catalog only when the
 * API is unavailable and a mock slug matches.
 */
export async function getProductPageBySlug(
  slug: string,
  locale?: string,
): Promise<ProductPageData | null> {
  try {
    const list = await fetchProducts(locale);
    const summary = list.find(
      (product) => product.slug === slug || product.id === slug,
    );

    if (!summary) {
      return null;
    }

    try {
      return await fetchProductById(summary.id, locale);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(
          `[getProductPageBySlug] detail ${error.status} ${error.statusText}`,
          error.data,
        );
      } else {
        console.error("[getProductPageBySlug] detail failed", error);
      }
      return { product: summary, reviews: [] };
    }
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(
        `[getProductPageBySlug] list ${error.status} ${error.statusText}`,
        error.data,
      );
    } else {
      console.error("[getProductPageBySlug] list failed", error);
    }

    const sample = getSampleProductBySlug(slug);
    return sample ? { product: sample, reviews: [] } : null;
  }
}
