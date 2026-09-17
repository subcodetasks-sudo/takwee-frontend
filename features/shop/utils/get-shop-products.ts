import { ApiError } from "@/lib/api-client";
import type { Product } from "@/features/product/types";
import type { StorefrontCategory } from "@/features/categories/types";
import { getCategories } from "@/features/categories/utils/get-categories";
import { fetchProducts } from "../api/get-products";
import { applyShopPathFilter } from "./filter-products";
import { resolveShopPath } from "./resolve-shop-path";

export interface ShopProductsResult {
  products: Product[];
  /** Matched API category when `/shop/[filter]` resolves to one. */
  category: StorefrontCategory | null;
}

/**
 * Load shop catalog products from `GET /api/v1/products`, then scope to the
 * category (or promo filter) for `/shop/[filter]` routes, or filter by search query.
 */
export async function getShopProducts(
  pathFilter?: string,
  locale?: string,
  searchQuery?: string,
): Promise<ShopProductsResult> {
  try {
    const [products, categories] = await Promise.all([
      fetchProducts(locale, { search: searchQuery }),
      getCategories(locale),
    ]);

    const resolved = resolveShopPath(pathFilter, categories);

    // Unknown filter: return empty rather than the full catalog.
    if (!resolved) {
      return { products: [], category: null };
    }

    if (resolved.kind === "all") {
      return { products, category: null };
    }

    if (resolved.kind === "category") {
      return {
        products: products.filter(
          (product) => product.categoryId === resolved.category.id,
        ),
        category: resolved.category,
      };
    }

    return {
      products: applyShopPathFilter(products, resolved.filter),
      category: null,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(
        `[getShopProducts] ${error.status} ${error.statusText}`,
        error.data,
      );
    } else {
      console.error("[getShopProducts] request failed", error);
    }
    return { products: [], category: null };
  }
}
