import { cache } from "react";
import { ApiError, getApiBaseUrl, http } from "@/lib/api-client";
import type { ApiSettingsResponse, AppSettings } from "../types";
import { mapSettings } from "../utils/map-settings";

const SETTINGS_PATH = "/api/v1/settings";

/**
 * Fetch and map public storefront settings.
 * Throws on failure — intended as a React Query `queryFn`.
 */
export async function fetchSettings(): Promise<AppSettings> {
  if (!getApiBaseUrl()) {
    throw new Error(
      "API_BASE_URL / NEXT_PUBLIC_API_BASE_URL is not configured",
    );
  }

  const json = await http.get<ApiSettingsResponse>(SETTINGS_PATH, {
    next: {
      revalidate: 60,
      tags: ["settings"],
    },
  });

  if (!json?.success || !Array.isArray(json.data)) {
    throw new ApiError(
      500,
      "Invalid Payload",
      json,
      json?.message || "Settings response missing data",
    );
  }

  return mapSettings(json.data);
}

/** Soft-fail wrapper for RSC callers (layout / metadata / maintenance gate). Deduped per request. */
export const getSettings = cache(async (): Promise<AppSettings | null> => {
  try {
    return await fetchSettings();
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(
        `[getSettings] ${error.status} ${error.statusText}`,
        error.data,
      );
    } else {
      console.error("[getSettings] request failed", error);
    }
    return null;
  }
});
