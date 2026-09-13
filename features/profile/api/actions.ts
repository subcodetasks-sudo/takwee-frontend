"use server";

import { cookies } from "next/headers";
import { safeServerAction, serverFetch, type ActionState } from "@/lib/api-server";
import {
  DEFAULT_ACCESS_MAX_AGE,
  SESSION_COOKIE_OPTIONS,
  USER_COOKIE_NAME,
} from "@/features/auth/utils/session-cookie";
import type { AuthUser } from "@/features/auth/types";
import type {
  ApiPreferencesData,
  ApiProfileData,
  ApiResponse,
  ApiUpdatePasswordInput,
  ApiUpdateProfileInput,
  ProfilePreferencesData,
  ProfileUser,
} from "../types";
import { mapProfileUser } from "../utils/map-profile";
import { mapPreferences, mapPreferencesToApi } from "../utils/map-preferences";

/** Helper to format Laravel validation errors if present. */
function extractFieldErrors(data: unknown): Record<string, string[]> | undefined {
  if (typeof data !== "object" || data === null) return undefined;
  const d = data as { errors?: Record<string, string[]>; data?: Record<string, string[]> };
  return d.errors || (d.data && typeof d.data === "object" && !Array.isArray(d.data) ? d.data : undefined);
}

/**
 * Persists the updated user profile into the SSR hydration cookie so the header and auth session stay in sync.
 */
async function syncUserCookie(user: ProfileUser) {
  try {
    const cookieStore = await cookies();
    const serializedUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      avatarUrl: user.avatarUrl,
      active: user.active,
      roles: user.roles,
    };
    cookieStore.set(USER_COOKIE_NAME, JSON.stringify(serializedUser), {
      ...SESSION_COOKIE_OPTIONS,
      maxAge: DEFAULT_ACCESS_MAX_AGE,
    });
  } catch {
    // Outside active request context or cookies unavailable
  }
}

// ---------------------------------------------------------------------------
// 1. Update Profile Action (POST /api/v1/auth/profile)
// ---------------------------------------------------------------------------

export async function updateProfileAction(
  input: ApiUpdateProfileInput,
): Promise<ActionState<ProfileUser>> {
  return safeServerAction(async () => {
    const res = await serverFetch<ApiResponse<ApiProfileData>>("/api/v1/auth/profile", {
      method: "POST",
      body: input,
      autoAuth: true,
    });

    if (!res?.success || !res.data) {
      throw new Error(res?.message || "Failed to update profile");
    }

    const user = mapProfileUser(res.data);
    await syncUserCookie(user);
    return user;
  }).then((state) => {
    if (!state.success && state.data) {
      state.fieldErrors = extractFieldErrors(state.data);
    }
    return state;
  });
}

// ---------------------------------------------------------------------------
// 2. Upload Avatar Action (POST /api/v1/auth/profile/avatar)
// ---------------------------------------------------------------------------

export async function uploadAvatarAction(
  formData: FormData,
): Promise<ActionState<ProfileUser>> {
  return safeServerAction(async () => {
    const res = await serverFetch<ApiResponse<ApiProfileData>>(
      "/api/v1/auth/profile/avatar",
      {
        method: "POST",
        body: formData,
        autoAuth: true,
      },
    );

    if (!res?.success || !res.data) {
      throw new Error(res?.message || "Failed to upload avatar");
    }

    const user = mapProfileUser(res.data);
    await syncUserCookie(user);
    return user;
  }).then((state) => {
    if (!state.success && state.data) {
      state.fieldErrors = extractFieldErrors(state.data);
    }
    return state;
  });
}

// ---------------------------------------------------------------------------
// 3. Delete Avatar Action (DELETE /api/v1/auth/profile/avatar)
// ---------------------------------------------------------------------------

export async function deleteAvatarAction(): Promise<ActionState<ProfileUser>> {
  return safeServerAction(async () => {
    const res = await serverFetch<ApiResponse<ApiProfileData>>(
      "/api/v1/auth/profile/avatar",
      {
        method: "DELETE",
        autoAuth: true,
      },
    );

    if (!res?.success || !res.data) {
      throw new Error(res?.message || "Failed to delete avatar");
    }

    const user = mapProfileUser(res.data);
    await syncUserCookie(user);
    return user;
  });
}

// ---------------------------------------------------------------------------
// 4. Update Password Action (POST /api/v1/auth/profile/password)
// ---------------------------------------------------------------------------

export async function updatePasswordAction(
  input: ApiUpdatePasswordInput,
): Promise<ActionState<boolean>> {
  return safeServerAction(async () => {
    const res = await serverFetch<ApiResponse<ApiProfileData>>(
      "/api/v1/auth/profile/password",
      {
        method: "POST",
        body: input,
        autoAuth: true,
      },
    );

    if (!res?.success) {
      throw new Error(res?.message || "Failed to update password");
    }

    return true;
  }).then((state) => {
    if (!state.success && state.data) {
      state.fieldErrors = extractFieldErrors(state.data);
    }
    return state;
  });
}

// ---------------------------------------------------------------------------
// 5. Get Preferences Action (GET /api/v1/auth/profile/preferences)
// ---------------------------------------------------------------------------

export async function getPreferencesAction(): Promise<ActionState<ProfilePreferencesData>> {
  return safeServerAction(async () => {
    const res = await serverFetch<ApiResponse<ApiPreferencesData>>(
      "/api/v1/auth/profile/preferences",
      {
        method: "GET",
        autoAuth: true,
      },
    );

    if (!res?.success || !res.data) {
      throw new Error(res?.message || "Failed to load preferences");
    }

    return mapPreferences(res.data);
  });
}

// ---------------------------------------------------------------------------
// 6. Update Preferences Action (POST /api/v1/auth/profile/preferences)
// ---------------------------------------------------------------------------

export async function updatePreferencesAction(
  preferences: ProfilePreferencesData,
): Promise<ActionState<ProfilePreferencesData>> {
  return safeServerAction(async () => {
    const payload = mapPreferencesToApi(preferences);
    const res = await serverFetch<ApiResponse<ApiPreferencesData>>(
      "/api/v1/auth/profile/preferences",
      {
        method: "POST",
        body: payload,
        autoAuth: true,
      },
    );

    if (!res?.success || !res.data) {
      throw new Error(res?.message || "Failed to update preferences");
    }

    return mapPreferences(res.data);
  }).then((state) => {
    if (!state.success && state.data) {
      state.fieldErrors = extractFieldErrors(state.data);
    }
    return state;
  });
}
