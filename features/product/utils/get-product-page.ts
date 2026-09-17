import { ApiError } from "@/lib/api-client";
import { fetchProducts } from "@/features/shop/api/get-products";
import { fetchProductById } from "../api/get-product-by-id";
import type { Product, ProductReview } from "../types";

export interface ProductPageData {
  product: Product;
  reviews: ProductReview[];
}

/** Match panel / WhatsApp deep links: `18` or `product-18`. */
export function parseProductIdAlias(slug: string): string | null {
  const decoded = decodeURIComponent(slug).trim();
  if (/^\d+$/.test(decoded)) return decoded;
  const match = /^product-(\d+)$/i.exec(decoded);
  return match?.[1] ?? null;
}

function productMatchesSlug(product: Product, slug: string): boolean {
  const decoded = decodeURIComponent(slug);
  if (
    product.slug === decoded ||
    product.id === decoded ||
    product.slug === slug ||
    product.id === slug
  ) {
    return true;
  }
  const idAlias = parseProductIdAlias(slug);
  return idAlias != null && product.id === idAlias;
}

/**
 * Resolve a PDP by SEO slug: match against the products list, then load
 * detail (with ratings) by id. Also accepts panel deep links (`product-18`,
 * bare numeric id).
 */
export async function getProductPageBySlug(
  slug: string,
  locale?: string,
): Promise<ProductPageData | null> {
  const decodedSlug = decodeURIComponent(slug);
  const idAlias = parseProductIdAlias(slug);

  try {
    const list = await fetchProducts(locale);
    const summary = list.find((product) => productMatchesSlug(product, slug));

    if (!summary) {
      if (idAlias) {
        try {
          return await fetchProductById(idAlias, locale);
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

    if (idAlias) {
      try {
        return await fetchProductById(idAlias, locale);
      } catch {
        // fall through
      }
    }

    return null;
  }
}
