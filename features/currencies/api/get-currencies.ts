import { cache } from "react";
import { ApiError, getApiBaseUrl, http } from "@/lib/api-client";
import type { ApiCurrenciesResponse, Currency } from "../types";
import { mapCurrencies } from "../utils/map-currencies";

const CURRENCIES_PATH = "/api/v1/currencies";

/**
 * Fetch and map public storefront currencies from `GET /api/v1/currencies`.
 * Throws on failure — intended as a React Query `queryFn`.
 */
export async function fetchCurrencies(locale?: string): Promise<Currency[]> {
  if (!getApiBaseUrl()) {
    throw new Error(
      "API_BASE_URL / NEXT_PUBLIC_API_BASE_URL is not configured",
    );
  }

  const json = await http.get<ApiCurrenciesResponse>(CURRENCIES_PATH, {
    headers: {
      ...(locale ? { "Accept-Language": locale } : {}),
    },
    next: {
      revalidate: 60,
      tags: ["currencies", locale ? `currencies:${locale}` : "currencies:default"],
    },
  });

  if (!json?.success || !Array.isArray(json.data)) {
    throw new ApiError(
      500,
      "Invalid Payload",
      json,
      json?.message || "Currencies response missing data",
    );
  }

  return mapCurrencies(json.data);
}

/** Soft-fail wrapper for RSC callers. Deduped per request. */
export const getCurrencies = cache(
  async (locale?: string): Promise<Currency[]> => {
    try {
      return await fetchCurrencies(locale);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(
          `[getCurrencies] ${error.status} ${error.statusText}`,
          error.data,
        );
      } else {
        console.error("[getCurrencies] request failed", error);
      }
      return [];
    }
  },
);
