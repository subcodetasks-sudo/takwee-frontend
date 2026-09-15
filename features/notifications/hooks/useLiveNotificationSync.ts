"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ORDERS_QUERY_KEY } from "@/features/orders/hooks/useOrders";
import { fetchNotifications } from "../api/get-notifications";
import {
  NOTIFICATIONS_QUERY_KEY,
  notificationsQueryKey,
  unreadCountQueryKey,
  useNotifications,
} from "./useNotifications";
import { shouldShowRealtimeToast } from "../utils/realtime-toast-guard";

/**
 * Watches unread-count live updates and:
 * - toasts the newest notification when the count rises
 * - refreshes order queries (tracker / list) in the same beat
 *
 * Works even when the backend does not deliver FCM web pushes.
 * FCM (useFcmPush) still short-circuits the same refresh path when a push arrives.
 */
export function useLiveNotificationSync() {
  const t = useTranslations("Notifications");
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { session, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications({ loadList: false });
  const prevUnreadRef = useRef<number | null>(null);
  const token = session?.token;

  useEffect(() => {
    if (!isAuthenticated || !token) {
      prevUnreadRef.current = null;
      return;
    }

    if (typeof unreadCount !== "number") return;

    const prev = prevUnreadRef.current;
    prevUnreadRef.current = unreadCount;

    // First observation — seed only, don't toast historical unread.
    if (prev === null) return;
    if (unreadCount <= prev) return;

    let cancelled = false;

    void (async () => {
      try {
        const list = await fetchNotifications(token, locale);
        if (cancelled) return;

        queryClient.setQueryData(notificationsQueryKey(locale), list);
        queryClient.setQueryData(unreadCountQueryKey(locale), unreadCount);

        const newest = list.find((n) => !n.read) ?? list[0];
        if (newest && shouldShowRealtimeToast()) {
          gooeyToast.info(newest.title?.trim() || t("title"), {
            description: newest.body?.trim() || undefined,
          });
        }

        void queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
        void queryClient.refetchQueries({
          queryKey: ORDERS_QUERY_KEY,
          type: "active",
        });
      } catch (error) {
        console.error("[LiveSync] Failed to refresh after unread bump:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    isAuthenticated,
    locale,
    queryClient,
    t,
    token,
    unreadCount,
  ]);
}
