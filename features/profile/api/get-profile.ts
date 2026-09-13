import { ApiError, getApiBaseUrl, http } from "@/lib/api-client";
import type { ApiProfileData, ApiResponse, ProfileUser } from "../types";
import { mapProfileUser } from "../utils/map-profile";

const PROFILE_PATH = "/api/v1/auth/profile";

/**
 * Client-side profile fetch (GET /api/v1/auth/profile).
 * Throws on failure — use as React Query queryFn with the session bearer token.
 */
export async function fetchProfile(
  token: string,
  locale?: string,
): Promise<ProfileUser> {
  if (!getApiBaseUrl()) {
    throw new Error("API_BASE_URL / NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  if (!token) {
    throw new Error("Authentication required");
  }

  const json = await http.get<ApiResponse<ApiProfileData>>(PROFILE_PATH, {
    token,
    headers: {
      ...(locale ? { "Accept-Language": locale } : {}),
    },
  });

  if (!json?.success || !json.data) {
    throw new ApiError(
      500,
      "Invalid Payload",
      json,
      json?.message || "Unexpected profile payload",
    );
  }

  return mapProfileUser(json.data);
}
