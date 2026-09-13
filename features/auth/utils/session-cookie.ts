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

export interface CookieStoreLike {
  get(name: string): { value: string } | undefined;
}

/**
 * Checks whether the cookie store contains a valid authentication token.
 */
export function hasAuthToken(cookies?: CookieStoreLike | null): boolean {
  if (!cookies) return false;
  const sessionToken = cookies.get(SESSION_COOKIE_NAME)?.value;
  const refreshToken = cookies.get(REFRESH_COOKIE_NAME)?.value;
  const genericToken = cookies.get("token")?.value;

  const isValid = (val?: string) =>
    Boolean(val && val.trim() !== "" && val !== "undefined" && val !== "null");

  return isValid(sessionToken) || isValid(refreshToken) || isValid(genericToken);
}

/**
 * Paths that require an authenticated user.
 */
export function isProtectedPath(pathWithoutLocale: string): boolean {
  return (
    pathWithoutLocale === "/checkout" ||
    pathWithoutLocale.startsWith("/checkout/") ||
    pathWithoutLocale === "/me" ||
    pathWithoutLocale.startsWith("/me/")
  );
}

/**
 * Paths reserved for guests (disabled for authenticated users).
 */
export function isGuestOnlyPath(pathWithoutLocale: string): boolean {
  const guestRoutes = [
    "/login",
    "/register",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify",
  ];
  return guestRoutes.some(
    (route) =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`),
  );
}

/**
 * Strips supported locale prefixes (e.g. /en, /tr, /ar) from the pathname.
 */
export function getCleanPathWithoutLocale(
  pathname: string,
  supportedLocales: readonly string[] = ["ar", "en", "tr"],
): string {
  const rawPath = pathname.split("?")[0] || "/";
  const segments = rawPath.split("/").filter(Boolean);
  if (segments.length === 0) return "/";
  const firstSegment = segments[0];
  if (supportedLocales.includes(firstSegment)) {
    return "/" + segments.slice(1).join("/");
  }
  return "/" + segments.join("/");
}

