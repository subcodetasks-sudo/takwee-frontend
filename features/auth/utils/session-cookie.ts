/** HttpOnly session cookie name used by the auth feature. */
export const SESSION_COOKIE_NAME = "ll_session";

/** 30 days in seconds. */
export const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_COOKIE_MAX_AGE,
  secure: process.env.NODE_ENV === "production",
};
