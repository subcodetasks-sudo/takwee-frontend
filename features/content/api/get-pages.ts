import { ApiError, getApiBaseUrl, http } from "@/lib/api-client";
import type { ApiPageResponse, ApiPagesResponse, StorefrontPageLink } from "../types";
import { mapPageToLink } from "../utils/map-pages";

const PAGES_PATH = "/api/v1/pages";

/**
 * Fetch storefront CMS pages for footer / nav chrome.
 * Throws on failure — intended as a React Query `queryFn`.
 */
export async function fetchPages(locale?: string): Promise<StorefrontPageLink[]> {
  if (!getApiBaseUrl()) {
    throw new Error(
      "API_BASE_URL / NEXT_PUBLIC_API_BASE_URL is not configured",
    );
  }

  const json = await http.get<ApiPagesResponse>(PAGES_PATH, {
    headers: {
      ...(locale ? { "Accept-Language": locale } : {}),
    },
    next: {
      revalidate: 60,
      tags: ["pages", locale ? `pages:${locale}` : "pages:default"],
    },
  });

  if (!json?.success || !Array.isArray(json.data)) {
    throw new ApiError(
      500,
      "Invalid Payload",
      json,
      json?.message || "Pages response missing data",
    );
  }

  return json.data.map(mapPageToLink);
}

/**
 * Fetch a single CMS page by slug.
 * Returns `null` on HTTP 404 so callers can `notFound()`.
 */
export async function fetchPageBySlug(
  slug: string,
  locale?: string,
): Promise<ApiPageResponse["data"] | null> {
  if (!getApiBaseUrl()) {
    throw new Error(
      "API_BASE_URL / NEXT_PUBLIC_API_BASE_URL is not configured",
    );
  }

  try {
    const json = await http.get<ApiPageResponse>(
      `${PAGES_PATH}/${encodeURIComponent(slug)}`,
      {
        headers: {
          ...(locale ? { "Accept-Language": locale } : {}),
        },
        next: {
          revalidate: 60,
          tags: [
            "pages",
            `pages:${slug}`,
            locale ? `pages:${slug}:${locale}` : `pages:${slug}:default`,
          ],
        },
      },
    );

    if (!json?.success || !json.data) {
      throw new ApiError(
        500,
        "Invalid Payload",
        json,
        json?.message || "Page response missing data",
      );
    }

    return json.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
