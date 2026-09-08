"use server";

import { cookies } from "next/headers";
import type { AuthSnapshot } from "../types";
import {
  DEV_MOCK_AUTHENTICATED,
  getMockAuthSnapshot,
  getMockAuthUser,
  getMockSession,
  getUnauthenticatedSnapshot,
  MOCK_SESSION_TOKEN,
} from "../utils/mock-auth";
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
} from "../utils/session-cookie";

/**
 * Resolves the current auth snapshot.
 * While APIs are pending, behavior is controlled by `DEV_MOCK_AUTHENTICATED`
 * in `utils/mock-auth.ts` — flip that flag to preview signed-in vs signed-out.
 */
export async function getSession(): Promise<AuthSnapshot> {
  if (!DEV_MOCK_AUTHENTICATED) {
    return getUnauthenticatedSnapshot();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return getMockAuthSnapshot();
  }

  const session = { ...getMockSession(), token };
  return {
    user: getMockAuthUser(),
    session,
    isAuthenticated: true,
  };
}

/**
 * Keeps local session state aligned with `DEV_MOCK_AUTHENTICATED`.
 * Seeds the cookie when signed-in; clears it when signed-out.
 */
export async function ensureMockSession(): Promise<AuthSnapshot> {
  const cookieStore = await cookies();

  if (!DEV_MOCK_AUTHENTICATED) {
    if (cookieStore.get(SESSION_COOKIE_NAME)?.value) {
      cookieStore.delete(SESSION_COOKIE_NAME);
    }
    return getUnauthenticatedSnapshot();
  }

  const existing = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!existing) {
    cookieStore.set(
      SESSION_COOKIE_NAME,
      MOCK_SESSION_TOKEN,
      SESSION_COOKIE_OPTIONS
    );
  }

  return getSession();
}

/** Clears the session cookie and returns a signed-out snapshot. */
export async function clearSession(): Promise<AuthSnapshot> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return getUnauthenticatedSnapshot();
}
