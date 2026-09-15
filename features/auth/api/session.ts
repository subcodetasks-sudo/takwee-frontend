"use server";

import { cookies } from "next/headers";
import { apiRequest } from "@/lib/api-client";
import { getUnauthenticatedSnapshot, type AuthSession, type AuthSnapshot, type AuthUser } from "../types";
import type { ApiResponse, ApiUser, ApiLoginData } from "../types/api";
import {
  DEFAULT_ACCESS_MAX_AGE,
  REFRESH_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  USER_COOKIE_NAME,
} from "../utils/session-cookie";

export interface SaveSessionParams {
  accessToken: string;
  refreshToken?: string;
  user?: AuthUser | ApiUser;
  accessExpiresIn?: number;
  refreshExpiresIn?: number;
  rememberMe?: boolean;
}

/**
 * Persists session tokens and cached user data in secure HttpOnly cookies.
 */
export async function saveSessionCookies(
  params: SaveSessionParams,
): Promise<void> {
  const cookieStore = await cookies();
  const {
    accessToken,
    refreshToken,
    user,
    accessExpiresIn = DEFAULT_ACCESS_MAX_AGE,
    refreshExpiresIn = SESSION_COOKIE_MAX_AGE,
    rememberMe = false,
  } = params;

  // Access token cookie (expires according to API expiresIn or 30 days if rememberMe)
  const accessMaxAge = rememberMe ? SESSION_COOKIE_MAX_AGE : accessExpiresIn;
  cookieStore.set(SESSION_COOKIE_NAME, accessToken, {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: accessMaxAge,
  });

  // Refresh token cookie
  if (refreshToken) {
    cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
      ...SESSION_COOKIE_OPTIONS,
      maxAge: refreshExpiresIn,
    });
  }

  // Cached user info for SSR hydration
  if (user) {
    const serializedUser: AuthUser = {
      id: String(user.id),
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      avatarUrl: ("image" in user ? user.image : user.avatarUrl) || undefined,
      active: "active" in user ? user.active : true,
      roles: "roles" in user ? user.roles : [],
    };
    cookieStore.set(USER_COOKIE_NAME, JSON.stringify(serializedUser), {
      ...SESSION_COOKIE_OPTIONS,
      maxAge: rememberMe ? SESSION_COOKIE_MAX_AGE : accessExpiresIn,
    });
  }
}

/**
 * Clears all session cookies.
 */
export async function clearSessionCookies(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    cookieStore.delete(REFRESH_COOKIE_NAME);
    cookieStore.delete(USER_COOKIE_NAME);
    cookieStore.delete("token");
  } catch {
    // Suppress error if called in read-only RSC render context
  }
}

/**
 * Resolves the current auth snapshot from live cookies.
 * Verifies with profile endpoint or cached session, and refreshes token if needed.
 */
export async function getSession(): Promise<AuthSnapshot> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

  // If no access token but refresh token exists, attempt silent refresh
  if (!token && refreshToken) {
    const refreshed = await attemptRefreshToken(refreshToken);
    if (refreshed) {
      return refreshed;
    }
  }

  if (!token) {
    return getUnauthenticatedSnapshot();
  }

  // Check cached user cookie first
  const userCookie = cookieStore.get(USER_COOKIE_NAME)?.value;
  if (userCookie) {
    try {
      const user: AuthUser = JSON.parse(userCookie);
      const session: AuthSession = {
        token,
        userId: user.id,
        expiresAt: new Date(
          Date.now() + DEFAULT_ACCESS_MAX_AGE * 1000,
        ).toISOString(),
      };
      return {
        user,
        session,
        isAuthenticated: true,
      };
    } catch {
      // JSON parse error, fall through to profile fetch
    }
  }

  // Verify token and load profile from backend
  try {
    const profileRes = await apiRequest<ApiResponse<ApiUser>>(
      "/api/v1/auth/profile",
      {
        method: "GET",
        token,
      },
    );

    if (profileRes?.success && profileRes.data) {
      const apiUser = profileRes.data;
      const user: AuthUser = {
        id: String(apiUser.id),
        name: apiUser.name,
        email: apiUser.email,
        mobile: apiUser.mobile,
        avatarUrl: apiUser.image || undefined,
        active: apiUser.active,
        roles: apiUser.roles,
      };

      const session: AuthSession = {
        token,
        userId: user.id,
        expiresAt: new Date(
          Date.now() + DEFAULT_ACCESS_MAX_AGE * 1000,
        ).toISOString(),
      };

      // Save user cookie for subsequent fast requests
      cookieStore.set(USER_COOKIE_NAME, JSON.stringify(user), {
        ...SESSION_COOKIE_OPTIONS,
        maxAge: DEFAULT_ACCESS_MAX_AGE,
      });

      return {
        user,
        session,
        isAuthenticated: true,
      };
    }
  } catch (error: unknown) {
    // If 401 unauthorized, attempt silent refresh
    if (refreshToken) {
      const refreshed = await attemptRefreshToken(refreshToken);
      if (refreshed) {
        return refreshed;
      }
    }
  }

  // Token invalid and could not refresh
  await clearSessionCookies();
  return getUnauthenticatedSnapshot();
}

/**
 * Helper to refresh expired token using refresh token cookie.
 */
async function attemptRefreshToken(
  refreshToken: string,
): Promise<AuthSnapshot | null> {
  try {
    const res = await apiRequest<ApiResponse<ApiLoginData>>(
      "/api/v1/auth/refresh-token",
      {
        method: "POST",
        body: { refresh_token: refreshToken },
      },
    );

    if (res?.success && res.data?.accessToken) {
      const {
        user: apiUser,
        accessToken,
        accessExpiresIn,
        refreshExpiresIn,
      } = res.data;
      const user: AuthUser = {
        id: String(apiUser.id),
        name: apiUser.name,
        email: apiUser.email,
        mobile: apiUser.mobile,
        avatarUrl: apiUser.image || undefined,
        active: apiUser.active,
        roles: apiUser.roles,
      };

      await saveSessionCookies({
        accessToken,
        refreshToken: res.data.refreshToken || refreshToken,
        user,
        accessExpiresIn,
        refreshExpiresIn,
      });

      return {
        user,
        session: {
          token: accessToken,
          userId: user.id,
          expiresAt: new Date(
            Date.now() + accessExpiresIn * 1000,
          ).toISOString(),
        },
        isAuthenticated: true,
      };
    }
  } catch {
    // Refresh failed
  }
  return null;
}

/**
 * Backward-compatible helper. Only checks real session.
 */
export async function ensureMockSession(): Promise<AuthSnapshot> {
  return getSession();
}

/** Clears the session cookie and returns a signed-out snapshot. */
export async function clearSession(): Promise<AuthSnapshot> {
  await clearSessionCookies();
  return getUnauthenticatedSnapshot();
}
