import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  USER_COOKIE_NAME,
} from "@/features/auth/utils/session-cookie";

/**
 * Route handler to clear all authentication and session cookies.
 * Called automatically on 401/402 responses or explicit logout.
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    cookieStore.delete(REFRESH_COOKIE_NAME);
    cookieStore.delete(USER_COOKIE_NAME);
    cookieStore.delete("token");

    return NextResponse.json(
      { success: true, cleared: true },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    );
  } catch (error) {
    console.error("[clear-session] Failed to delete session cookies:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear session" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return POST();
}
