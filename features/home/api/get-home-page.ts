import { ApiError, getApiBaseUrl, http } from "@/lib/api-client";
import type { ApiHomePageResponse, HomePageData } from "../types";
import { mapHomePageData } from "../utils/map-home-page";

const HOME_PATH = "/api/v1/home";

/**
 * Fetch and map the storefront home page payload.
 * Throws `ApiError` (or a plain Error) on failure — intended as a React Query `queryFn`.
 */
export async function fetchHomePage(locale?: string): Promise<HomePageData> {
  if (!getApiBaseUrl()) {
    throw new Error(
      "API_BASE_URL / NEXT_PUBLIC_API_BASE_URL is not configured",
    );
  }

  const json = await http.get<ApiHomePageResponse>(HOME_PATH, {
    headers: {
      ...(locale ? { "Accept-Language": locale } : {}),
    },
    next: {
      revalidate: 60,
      tags: ["home", locale ? `home:${locale}` : "home:default"],
    },
  });

  if (!json?.success || !json.data) {
    throw new ApiError(
      500,
      "Invalid Payload",
      json,
      json?.message || "Home page response missing data",
    );
  }

  return mapHomePageData(json.data);
}

/** @deprecated Prefer `fetchHomePage` + React Query. Soft-fail wrapper for RSC callers. */
export async function getHomePage(
  locale?: string,
): Promise<HomePageData | null> {
  try {
    return await fetchHomePage(locale);
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(
        `[getHomePage] ${error.status} ${error.statusText}`,
        error.data,
      );
    } else {
      console.error("[getHomePage] request failed", error);
    }
    return null;
  }
}
