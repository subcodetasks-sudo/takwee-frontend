import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

export type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
  vapidKey?: string;
};

function envFirebaseConfig(): FirebaseWebConfig | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() ?? "";
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() ?? "";
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ?? "";
  const storageBucket =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() ?? "";
  const messagingSenderId =
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() ?? "";
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() ?? "";
  const measurementId =
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim() ?? "";
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY?.trim() ?? "";

  if (
    !apiKey ||
    !authDomain ||
    !projectId ||
    !storageBucket ||
    !messagingSenderId ||
    !appId
  ) {
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId: measurementId || undefined,
    vapidKey: vapidKey || undefined,
  };
}

let cachedConfig: FirebaseWebConfig | null | undefined;
let appPromise: Promise<FirebaseApp> | null = null;

/**
 * Resolves Firebase web config. Prefers statically inlined NEXT_PUBLIC_* env;
 * on the client, falls back to `/api/firebase-config` when Turbopack/dev has not
 * inlined env yet (common until `next dev` is restarted after editing .env.local).
 */
export async function getFirebaseWebConfig(): Promise<FirebaseWebConfig> {
  if (cachedConfig) {
    return cachedConfig;
  }

  const fromEnv = envFirebaseConfig();
  if (fromEnv) {
    cachedConfig = fromEnv;
    return fromEnv;
  }

  if (typeof window !== "undefined") {
    const res = await fetch("/api/firebase-config", { cache: "no-store" });
    if (!res.ok) {
      throw new Error(
        "Missing Firebase env. Copy values from .env.example into .env.local and restart next dev.",
      );
    }
    const json = (await res.json()) as FirebaseWebConfig;
    cachedConfig = json;
    return json;
  }

  throw new Error(
    "Missing Firebase env. Copy values from .env.example into .env.local and restart next dev.",
  );
}

/**
 * Shared Firebase app singleton (safe to call from client or server).
 */
export async function getFirebaseApp(): Promise<FirebaseApp> {
  if (getApps().length > 0) {
    return getApp();
  }

  if (!appPromise) {
    appPromise = getFirebaseWebConfig().then((config) => {
      if (getApps().length > 0) {
        return getApp();
      }
      const { vapidKey, ...firebaseConfig } = config;
      void vapidKey;
      return initializeApp(firebaseConfig);
    });
  }

  return appPromise;
}

/**
 * Analytics only runs in the browser and when the environment supports it.
 */
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") {
    return null;
  }

  const supported = await isSupported();
  if (!supported) {
    return null;
  }

  return getAnalytics(await getFirebaseApp());
}
