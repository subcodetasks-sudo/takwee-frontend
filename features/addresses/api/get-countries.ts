import { ApiError, getApiBaseUrl, http } from "@/lib/api-client";
import type { ShippingCountry } from "../types";
import type { ApiCountry, ApiResponse } from "../types/api";
import { mapCountries } from "../utils/map-locations";

const COUNTRIES_PATH = "/api/v1/countries";

export async function fetchCountries(locale?: string): Promise<ShippingCountry[]> {
  if (!getApiBaseUrl()) {
    throw new Error("API_BASE_URL / NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  const json = await http.get<ApiResponse<ApiCountry[]>>(COUNTRIES_PATH, {
    headers: {
      ...(locale ? { "Accept-Language": locale } : {}),
    },
    next: {
      revalidate: 60,
      tags: ["countries", locale ? `countries:${locale}` : "countries:default"],
    },
  });

  if (!json?.success || !Array.isArray(json.data)) {
    throw new ApiError(
      500,
      "Invalid Payload",
      json,
      json?.message || "Countries response missing data",
    );
  }

  return mapCountries(json.data);
}
