import { NextResponse } from "next/server";

/**
 * Public Firebase web config for the client SDK / service worker.
 * Values are NEXT_PUBLIC_* (safe to expose in the browser).
 */
export function GET() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "",
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? "",
  };

  const required = [
    config.apiKey,
    config.authDomain,
    config.projectId,
    config.storageBucket,
    config.messagingSenderId,
    config.appId,
  ];

  if (required.some((value) => !value.trim())) {
    return NextResponse.json(
      { error: "Firebase env is not configured on the server." },
      { status: 500 },
    );
  }

  return NextResponse.json(config, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
