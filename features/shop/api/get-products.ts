import { ApiError, getApiBaseUrl, http } from "@/lib/api-client";
import type { Product } from "@/features/product";
import type { ApiProductsResponse } from "@/features/product/types/api";
import { mapProducts } from "@/features/product/utils/map-product";

const PRODUCTS_PATH = "/api/v1/products";

/**
 * Fetch catalog products for the shop PLP.
 * Throws on failure — intended as a React Query `queryFn` or RSC await.
 */
export async function fetchProducts(locale?: string): Promise<Product[]> {
  if (!getApiBaseUrl()) {
    throw new Error(
      "API_BASE_URL / NEXT_PUBLIC_API_BASE_URL is not configured",
    );
  }

  const json = await http.get<ApiProductsResponse>(PRODUCTS_PATH, {
    params: { per_page: 100 },
    headers: {
      ...(locale ? { "Accept-Language": locale } : {}),
    },
    next: {
      revalidate: 60,
      tags: ["products", locale ? `products:${locale}` : "products:default"],
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
