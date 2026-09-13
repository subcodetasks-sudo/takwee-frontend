import { ApiError, getApiBaseUrl, http } from "@/lib/api-client";
import type { ShippingCity } from "../types";
import type { ApiCity, ApiResponse } from "../types/api";
import { mapCities } from "../utils/map-locations";

const CITIES_PATH = "/api/v1/cities";

export async function fetchCities(
  countryId: number,
  locale?: string,
): Promise<ShippingCity[]> {
  if (!getApiBaseUrl()) {
    throw new Error("API_BASE_URL / NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  const json = await http.get<ApiResponse<ApiCity[]>>(CITIES_PATH, {
    params: { country_id: countryId },
    headers: {
      ...(locale ? { "Accept-Language": locale } : {}),
    },
    next: {
      revalidate: 60,
      tags: [
        "cities",
        `cities:${countryId}`,
        locale ? `cities:${locale}:${countryId}` : `cities:default:${countryId}`,
      ],
    },
  });

  if (!json?.success || !Array.isArray(json.data)) {
    throw new ApiError(
      500,
      "Invalid Payload",
      json,
      json?.message || "Cities response missing data",
    );
  }

  return mapCities(json.data);
}
