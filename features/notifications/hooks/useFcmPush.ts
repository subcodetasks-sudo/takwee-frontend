"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ORDERS_QUERY_KEY } from "@/features/orders/hooks/useOrders";
import {
  FCM_BROADCAST_CHANNEL,
  FCM_CLIENT_MESSAGE_TYPE,
  getFcmDeviceToken,
  getFirebaseMessaging,
  notificationCopyFromPayload,
  registerFirebaseMessagingSw,
  subscribeToForegroundMessages,
  type FcmClientPushMessage,
} from "@/lib/firebase-messaging";
import { registerDeviceToken } from "../api/get-notifications";
import { shouldShowRealtimeToast } from "../utils/realtime-toast-guard";
import { NOTIFICATIONS_QUERY_KEY } from "./useNotifications";

/**
 * Registers the browser FCM token with the API when the user is signed in,
 * and on every push immediately refreshes notifications + orders (no polling).
 */
export function useFcmPush() {
  const t = useTranslations("Notifications");
  const queryClient = useQueryClient();
  const { session, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const authToken = session?.token;
  const lastRegisteredFcmToken = useRef<string | null>(null);
  const fallbackTitleRef = useRef(t("title"));
  fallbackTitleRef.current = t("title");

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated || !authToken) {
      lastRegisteredFcmToken.current = null;
      return;
    }

    if (typeof window === "undefined" || !("Notification" in window)) {
      return;
    }

    let cancelled = false;
    let unsubscribeForeground: (() => void) | undefined;
    let broadcast: BroadcastChannel | null = null;

    const refreshRealtimeQueries = () => {
      void queryClient.invalidateQueries({
        queryKey: NOTIFICATIONS_QUERY_KEY,
      });
      void queryClient.invalidateQueries({
        queryKey: ORDERS_QUERY_KEY,
      });
      void queryClient.refetchQueries({
        queryKey: NOTIFICATIONS_QUERY_KEY,
        type: "active",
      });
      void queryClient.refetchQueries({
        queryKey: ORDERS_QUERY_KEY,
        type: "active",
      });
    };

    const showPushToast = (title?: string, body?: string) => {
      if (shouldShowRealtimeToast()) {
        gooeyToast.info(title?.trim() || fallbackTitleRef.current, {
          description: body?.trim() || undefined,
        });
      }
      refreshRealtimeQueries();
    };

    const onPushMessage = (data: FcmClientPushMessage | null | undefined) => {
      if (!data || data.type !== FCM_CLIENT_MESSAGE_TYPE) return;
      console.log("[FCM] push received", data);
      showPushToast(data.title, data.body);
    };

    const onServiceWorkerMessage = (
      event: MessageEvent<FcmClientPushMessage>,
    ) => {
      onPushMessage(event.data);
    };

    navigator.serviceWorker?.addEventListener(
      "message",
      onServiceWorkerMessage,
    );

    try {
      broadcast = new BroadcastChannel(FCM_BROADCAST_CHANNEL);
      broadcast.onmessage = (event: MessageEvent<FcmClientPushMessage>) => {
        onPushMessage(event.data);
      };
    } catch {
      // BroadcastChannel unsupported — SW postMessage still works.
    }

    // When the tab becomes visible again, pull latest without waiting for a push.
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        refreshRealtimeQueries();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    async function setup() {
      try {
        const messaging = await getFirebaseMessaging();
        if (!messaging || cancelled) {
          if (!messaging) {
            console.warn("[FCM] Messaging unsupported in this browser.");
          }
          return;
        }

        let permission = Notification.permission;
        if (permission === "default") {
          permission = await Notification.requestPermission();
        }
        if (permission !== "granted" || cancelled) {
          console.warn(
            "[FCM] Notification permission not granted:",
            permission,
          );
          return;
        }

        const registration = await registerFirebaseMessagingSw();
        if (!registration || cancelled) return;

        unsubscribeForeground = subscribeToForegroundMessages(
          messaging,
          (payload) => {
            console.log("[FCM] foreground message", payload);
            const { title, body } = notificationCopyFromPayload(payload);
            showPushToast(title, body);
          },
        );

        const fcmToken = await getFcmDeviceToken(messaging, registration);
        if (!fcmToken || cancelled) {
          console.warn("[FCM] No device token returned from getToken().");
          return;
        }

        console.log("[FCM] token:", fcmToken);

        // Always upsert with the API so a lost/stale backend token is repaired.
        try {
          await registerDeviceToken(authToken!, {
            device_token: fcmToken,
            device_type: "web",
          });
          lastRegisteredFcmToken.current = fcmToken;
          console.log("[FCM] Device token registered with API.");
        } catch (error) {
          console.error(
            "[FCM] Failed to register device token with API:",
            error,
          );
        }
      } catch (error) {
        console.error("[FCM] Failed to set up web push:", error);
      }
    }

    void setup();

    return () => {
      cancelled = true;
      unsubscribeForeground?.();
      navigator.serviceWorker?.removeEventListener(
        "message",
        onServiceWorkerMessage,
      );
      document.removeEventListener("visibilitychange", onVisibility);
      broadcast?.close();
    };
  }, [authToken, isAuthLoading, isAuthenticated, queryClient]);
}
