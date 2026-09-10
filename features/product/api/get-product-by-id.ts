import { ApiError, getApiBaseUrl, http } from "@/lib/api-client";
import type { ApiProductDetailResponse } from "../types/api";
import {
  mapProductDetail,
  type MappedProductDetail,
} from "../utils/map-product";

const PRODUCTS_PATH = "/api/v1/products";

/**
 * Fetch a single product (including `ratings[]`) by API id.
 * Throws on failure — intended as a React Query `queryFn` or RSC await.
 */
export async function fetchProductById(
  id: string,
  locale?: string,
): Promise<MappedProductDetail> {
  if (!getApiBaseUrl()) {
    throw new Error(
      "API_BASE_URL / NEXT_PUBLIC_API_BASE_URL is not configured",
    );
  }

  const json = await http.get<ApiProductDetailResponse>(
    `${PRODUCTS_PATH}/${encodeURIComponent(id)}`,
    {
      headers: {
        ...(locale ? { "Accept-Language": locale } : {}),
      },
      next: {
        revalidate: 60,
        tags: [
          "products",
          `product:${id}`,
          locale ? `product:${id}:${locale}` : `product:${id}:default`,
        ],
      },
    },
  );

  if (!json?.success || !json.data) {
    throw new ApiError(
      500,
      "Invalid Payload",
      json,
      json?.message || "Product response missing data",
    );
  }

  return mapProductDetail(json.data, locale);
}
