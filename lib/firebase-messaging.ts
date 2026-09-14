import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type MessagePayload,
  type Messaging,
  type Unsubscribe,
} from "firebase/messaging";
import {
  getFirebaseApp,
  getFirebaseWebConfig,
  type FirebaseWebConfig,
} from "@/lib/firebase";

export const FCM_CLIENT_MESSAGE_TYPE = "LINEN_FCM_PUSH" as const;
export const FCM_BROADCAST_CHANNEL = "linen-fcm-push" as const;

const FCM_SW_PATH = "/firebase-messaging-sw.js";
const FCM_SW_READY_TYPE = "LINEN_FCM_SW_PING" as const;

/**
 * Browser-only Messaging instance. Returns null when unsupported (SSR, Safari
 * without push, insecure origins, etc.).
 */
export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (typeof window === "undefined") {
    return null;
  }

  const supported = await isSupported();
  if (!supported) {
    return null;
  }

  return getMessaging(await getFirebaseApp());
}

function buildSwUrl(config: FirebaseWebConfig): string {
  const params = new URLSearchParams({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
  });
  if (config.measurementId) {
    params.set("measurementId", config.measurementId);
  }
  return `${FCM_SW_PATH}?${params.toString()}`;
}

function waitForWorkerState(
  worker: ServiceWorker,
  state: ServiceWorkerState,
): Promise<void> {
  if (worker.state === state) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const onChange = () => {
      if (worker.state === state) {
        worker.removeEventListener("statechange", onChange);
        resolve();
      } else if (worker.state === "redundant") {
        worker.removeEventListener("statechange", onChange);
        reject(new Error("Service worker became redundant before activating."));
      }
    };
    worker.addEventListener("statechange", onChange);
  });
}

async function ensureServiceWorkerActivated(
  registration: ServiceWorkerRegistration,
): Promise<ServiceWorkerRegistration> {
  const incoming = registration.installing || registration.waiting;
  if (incoming) {
    // Move waiting worker into active as soon as possible.
    incoming.postMessage({ type: "SKIP_WAITING" });
    await waitForWorkerState(incoming, "activated");
  } else if (registration.active && registration.active.state !== "activated") {
    await waitForWorkerState(registration.active, "activated");
  }

  await navigator.serviceWorker.ready;

  // After skipWaiting, claim may leave controller null until next navigation —
  // still fine when we pass `serviceWorkerRegistration` into getToken.
  return registration;
}

async function waitForMessagingSwReady(
  registration: ServiceWorkerRegistration,
  timeoutMs = 12_000,
): Promise<void> {
  const worker =
    registration.active || registration.waiting || registration.installing;
  if (!worker) {
    throw new Error("No service worker available to ping.");
  }

  await new Promise<void>((resolve, reject) => {
    const channel = new MessageChannel();
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("Timed out waiting for FCM service worker ready."));
    }, timeoutMs);

    const cleanup = () => {
      window.clearTimeout(timer);
      channel.port1.onmessage = null;
    };

    channel.port1.onmessage = (event: MessageEvent<{ ok?: boolean; error?: string }>) => {
      cleanup();
      if (event.data?.ok) {
        resolve();
        return;
      }
      reject(
        new Error(
          event.data?.error || "FCM service worker reported not ready.",
        ),
      );
    };

    worker.postMessage({ type: FCM_SW_READY_TYPE }, [channel.port2]);
  });
}

export async function registerFirebaseMessagingSw(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  const config = await getFirebaseWebConfig();
  const registration = await navigator.serviceWorker.register(
    buildSwUrl(config),
    {
      scope: "/",
      updateViaCache: "none",
    },
  );

  await registration.update().catch(() => undefined);
  await ensureServiceWorkerActivated(registration);
  await waitForMessagingSwReady(registration);

  return registration;
}

export async function getFcmDeviceToken(
  messaging: Messaging,
  serviceWorkerRegistration: ServiceWorkerRegistration,
): Promise<string | null> {
  const config = await getFirebaseWebConfig();
  const vapidKey = config.vapidKey?.trim() ?? "";
  if (!vapidKey) {
    console.warn(
      "Missing NEXT_PUBLIC_FIREBASE_VAPID_KEY — cannot register FCM web push.",
    );
    return null;
  }

  if (!/^B[A-Za-z0-9_-]{80,}$/.test(vapidKey)) {
    console.warn(
      "[FCM] VAPID key shape looks invalid. Use the Web Push certificate key pair from Firebase Console → Cloud Messaging.",
    );
  }

  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration,
  });

  return token || null;
}

/**
 * Best-effort FCM web token for login / device registration.
 * Returns null when unsupported, denied, or misconfigured — never throws.
 */
export async function requestFcmWebToken(): Promise<string | null> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return null;
  }

  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    let permission = Notification.permission;
    if (permission === "default") {
      permission = await Notification.requestPermission();
    }
    if (permission !== "granted") return null;

    const registration = await registerFirebaseMessagingSw();
    if (!registration) return null;

    const token = await getFcmDeviceToken(messaging, registration);
    if (token) {
      console.log("[FCM] token:", token);
    }
    return token;
  } catch (error) {
    console.error("[FCM] Failed to request web token:", error);
    return null;
  }
}

export function subscribeToForegroundMessages(
  messaging: Messaging,
  handler: (payload: MessagePayload) => void,
): Unsubscribe {
  return onMessage(messaging, handler);
}

export function notificationCopyFromPayload(payload: MessagePayload): {
  title: string;
  body: string;
} {
  const title =
    payload.notification?.title?.trim() ||
    payload.data?.title?.trim() ||
    "";
  const body =
    payload.notification?.body?.trim() ||
    payload.data?.body?.trim() ||
    payload.data?.message?.trim() ||
    "";

  return { title, body };
}

export type FcmClientPushMessage = {
  type: typeof FCM_CLIENT_MESSAGE_TYPE;
  title?: string;
  body?: string;
  /** Optional order id when the push is order/tracking related */
  orderId?: string;
};
