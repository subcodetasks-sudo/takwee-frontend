/* Takween — Firebase Cloud Messaging service worker */
/* global firebase, clients, importScripts, self */

importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js",
);

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

function configFromRegistrationUrl() {
  try {
    const url = new URL(self.location.href);
    const apiKey = url.searchParams.get("apiKey") || "";
    const authDomain = url.searchParams.get("authDomain") || "";
    const projectId = url.searchParams.get("projectId") || "";
    const storageBucket = url.searchParams.get("storageBucket") || "";
    const messagingSenderId = url.searchParams.get("messagingSenderId") || "";
    const appId = url.searchParams.get("appId") || "";
    const measurementId = url.searchParams.get("measurementId") || "";

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
    };
  } catch {
    return null;
  }
}

function loadConfig() {
  const fromUrl = configFromRegistrationUrl();
  if (fromUrl) {
    return Promise.resolve(fromUrl);
  }

  return fetch("/api/firebase-config", { cache: "no-store" }).then(
    (response) => {
      if (!response.ok) {
        throw new Error("Failed to load /api/firebase-config");
      }
      return response.json();
    },
  );
}

/**
 * Load public Firebase web config (URL params preferred), then attach FCM handlers.
 */
let messagingInstance = null;
let messagingInitError = null;

const messagingReady = loadConfig()
  .then((config) => {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId,
        measurementId: config.measurementId,
      });
    }
    messagingInstance = firebase.messaging();
    return messagingInstance;
  })
  .catch((error) => {
    messagingInitError =
      (error && error.message) || "FCM service worker init failed";
    console.error("[FCM SW] Init failed:", error);
    return null;
  });

function payloadCopy(payload) {
  const title =
    (payload.notification && payload.notification.title) ||
    (payload.data && payload.data.title) ||
    "Takween";
  const body =
    (payload.notification && payload.notification.body) ||
    (payload.data && (payload.data.body || payload.data.message)) ||
    "";
  const link =
    (payload.data &&
      (payload.data.href || payload.data.link || payload.data.url)) ||
    "/";
  const orderId =
    (payload.data &&
      (payload.data.order_id ||
        payload.data.orderId ||
        payload.data.orderID)) ||
    undefined;
  return { title, body, link, orderId };
}

function notifyOpenClients(title, body, orderId) {
  const message = {
    type: "LINEN_FCM_PUSH",
    title,
    body,
    orderId,
  };

  try {
    const channel = new BroadcastChannel("linen-fcm-push");
    channel.postMessage(message);
    channel.close();
  } catch {
    // BroadcastChannel may be unavailable in some SW environments.
  }

  return self.clients
    .matchAll({ type: "window", includeUncontrolled: true })
    .then((windowClients) => {
      for (const client of windowClients) {
        client.postMessage(message);
      }
    });
}

messagingReady.then((messaging) => {
  if (!messaging) return;

  messaging.onBackgroundMessage((payload) => {
    const { title, body, link, orderId } = payloadCopy(payload);

    // Update badge/toast/orders in any open tab, even when the page is not focused.
    void notifyOpenClients(title, body, orderId);

    return self.registration.showNotification(title, {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      data: { url: link, orderId },
    });
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url =
    (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if ("focus" in client) {
            client.focus();
            if ("navigate" in client && url) {
              return client.navigate(url);
            }
            return undefined;
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
        return undefined;
      }),
  );
});

// Allow the page to ask the SW to claim clients / confirm messaging is alive.
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }
  if (event.data && event.data.type === "LINEN_FCM_SW_PING") {
    const port = event.ports && event.ports[0];
    if (!port) return;

    void messagingReady.then((messaging) => {
      if (messaging && messagingInstance) {
        port.postMessage({ ok: true });
      } else {
        port.postMessage({
          ok: false,
          error: messagingInitError || "FCM messaging is not initialized.",
        });
      }
    });
  }
});
