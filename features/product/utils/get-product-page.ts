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
  const decodedSlug = decodeURIComponent(slug);

  try {
    const list = await fetchProducts(locale);
    const summary = list.find(
      (product) =>
        product.slug === decodedSlug ||
        product.id === decodedSlug ||
        product.slug === slug ||
        product.id === slug,
    );

    if (!summary) {
      // If the slug is numeric, attempt direct fetch by ID
      if (/^\d+$/.test(decodedSlug)) {
        try {
          return await fetchProductById(decodedSlug, locale);
        } catch {
          // not found
        }
      }
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

    if (/^\d+$/.test(decodedSlug)) {
      try {
        return await fetchProductById(decodedSlug, locale);
      } catch {
        // fall through
      }
    }

    const sample = getSampleProductBySlug(decodedSlug);
    return sample ? { product: sample, reviews: [] } : null;
  }
}
