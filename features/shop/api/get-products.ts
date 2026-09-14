import { ApiError, getApiBaseUrl, http } from "@/lib/api-client";
import type { Product } from "@/features/product";
import type { ApiProductsResponse } from "@/features/product/types/api";
import { mapProducts } from "@/features/product/utils/map-product";

const PRODUCTS_PATH = "/api/v1/products";

export interface FetchProductsOptions {
  /** Optional search term to filter products by title/keyword. */
  search?: string;
  /** Number of products per page (default: 100). */
  perPage?: number;
}

/**
 * Fetch catalog products for the shop PLP or search popup.
 * Throws on failure — intended as a React Query `queryFn` or RSC await.
 */
export async function fetchProducts(
  locale?: string,
  options?: FetchProductsOptions,
): Promise<Product[]> {
  if (!getApiBaseUrl()) {
    throw new Error(
      "API_BASE_URL / NEXT_PUBLIC_API_BASE_URL is not configured",
    );
  }

  const queryParams: Record<string, string | number> = {
    per_page: options?.perPage ?? 100,
  };

  const trimmedSearch = options?.search?.trim();
  if (trimmedSearch) {
    queryParams.search = trimmedSearch;
  }

  const json = await http.get<ApiProductsResponse>(PRODUCTS_PATH, {
    params: queryParams,
    headers: {
      ...(locale ? { "Accept-Language": locale } : {}),
    },
  });

  if (!json?.success || !Array.isArray(json.data?.data)) {
    throw new ApiError(
      500,
      "Invalid Payload",
      json,
      json?.message || "Products response missing data",
    );
  }

  return mapProducts(json.data.data);
}
