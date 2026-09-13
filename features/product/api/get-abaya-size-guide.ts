import { ApiError, getApiBaseUrl, http } from "@/lib/api-client";
import type { ApiAbayaSizeGuide, ApiAbayaSizeGuideResponse } from "../types";

const SIZE_GUIDE_PATH = "/api/v1/abaya-size-guide";

/**
 * Fetch abaya size guide from the backend.
 * Uses Accept-Language header for localization (default 'ar').
 */
export async function fetchAbayaSizeGuide(
  locale: string = "ar",
): Promise<ApiAbayaSizeGuide> {
  if (!getApiBaseUrl()) {
    throw new Error(
      "API_BASE_URL / NEXT_PUBLIC_API_BASE_URL is not configured",
    );
  }

  const json = await http.get<ApiAbayaSizeGuideResponse>(SIZE_GUIDE_PATH, {
    headers: {
      "Accept-Language": locale || "ar",
    },
    next: {
      revalidate: 300,
      tags: [
        "abaya-size-guide",
        locale ? `abaya-size-guide:${locale}` : "abaya-size-guide:default",
      ],
    },
  });

  if (!json?.success || !json.data) {
    throw new ApiError(
      500,
      "Invalid Payload",
      json,
      json?.message || "Abaya size guide response missing data",
    );
  }

  return json.data;
}
