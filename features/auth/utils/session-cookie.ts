/** HttpOnly session access token cookie name used by the auth feature. */
export const SESSION_COOKIE_NAME = "ll_session";

/** HttpOnly refresh token cookie name. */
export const REFRESH_COOKIE_NAME = "ll_refresh_token";

/** Cookie storing cached user details for fast hydration. */
export const USER_COOKIE_NAME = "ll_user";

/** Default access token expiry: 2 hours (7200s), fallback 30 days if remember me. */
export const DEFAULT_ACCESS_MAX_AGE = 7200;

/** Default refresh token expiry: 30 days in seconds. */
export const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_COOKIE_MAX_AGE,
  secure: process.env.NODE_ENV === "production",
};
