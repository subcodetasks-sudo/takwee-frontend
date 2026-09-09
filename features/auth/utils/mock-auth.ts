import type { AuthSession, AuthSnapshot, AuthUser } from "../types";

/**
 * Local-dev auth switch — flip this until real APIs are wired.
 * `true`  → signed in as the mock user (cookie seeded automatically)
 * `false` → signed out (login button, no session)
 */
export const DEV_MOCK_AUTHENTICATED = true;

/**
 * Demo account used while real auth APIs are not wired.
 * Keep in sync with profile mock identity.
 */
export const MOCK_AUTH_USER: AuthUser = {
  id: "user-demo-1",
  name: "Loai Wael Hassan",
  email: "loaiwael@example.com",
};

export const MOCK_SESSION_TOKEN = "mock-session-token-dev";

/** Fixed far-future expiry so local work is not interrupted by session churn. */
export const MOCK_SESSION: AuthSession = {
  token: MOCK_SESSION_TOKEN,
  userId: MOCK_AUTH_USER.id,
  expiresAt: "2030-12-31T23:59:59.000Z",
};

export function getMockAuthUser(): AuthUser {
  return { ...MOCK_AUTH_USER };
}

export function getMockSession(): AuthSession {
  return { ...MOCK_SESSION };
}

export function getUnauthenticatedSnapshot(): AuthSnapshot {
  return {
    user: null,
    session: null,
    isAuthenticated: false,
  };
}

/** Snapshot driven by {@link DEV_MOCK_AUTHENTICATED}. */
export function getMockAuthSnapshot(): AuthSnapshot {
  if (!DEV_MOCK_AUTHENTICATED) {
    return getUnauthenticatedSnapshot();
  }

  return {
    user: getMockAuthUser(),
    session: getMockSession(),
    isAuthenticated: true,
  };
}
