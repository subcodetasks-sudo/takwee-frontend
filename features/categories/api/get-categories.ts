import { ApiError, getApiBaseUrl, http } from "@/lib/api-client";
import type { ApiCategoriesResponse, StorefrontCategory } from "../types";
import { mapCategories } from "../utils/map-categories";

const CATEGORIES_PATH = "/api/v1/categories";

/**
 * Fetch storefront categories for header / footer nav chrome.
 * Throws on failure — intended as a React Query `queryFn`.
 */
export async function fetchCategories(
  locale?: string,
): Promise<StorefrontCategory[]> {
  if (!getApiBaseUrl()) {
    throw new Error(
      "API_BASE_URL / NEXT_PUBLIC_API_BASE_URL is not configured",
    );
  }

  const json = await http.get<ApiCategoriesResponse>(CATEGORIES_PATH, {
    params: { per_page: 100 },
    headers: {
      ...(locale ? { "Accept-Language": locale } : {}),
    },
    next: {
      revalidate: 60,
      tags: ["categories", locale ? `categories:${locale}` : "categories:default"],
    },
  });

  if (!json?.success || !Array.isArray(json.data?.data)) {
    throw new ApiError(
      500,
      "Invalid Payload",
      json,
      json?.message || "Categories response missing data",
    );
  }

  return mapCategories(json.data.data);
}
