"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  deleteNotification,
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
  registerDeviceToken,
} from "../api/get-notifications";
import type { NotificationItem } from "../types";
import type { ApiRegisterDeviceTokenBody } from "../types/api";

export const NOTIFICATIONS_QUERY_KEY = ["user-notifications"] as const;

export const notificationsQueryKey = (locale: string) =>
  [...NOTIFICATIONS_QUERY_KEY, locale, "list"] as const;

export const unreadCountQueryKey = (locale: string) =>
  [...NOTIFICATIONS_QUERY_KEY, locale, "unread-count"] as const;

export function useNotifications() {
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { session, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const token = session?.token;
  const listKey = notificationsQueryKey(locale);
  const unreadKey = unreadCountQueryKey(locale);

  const listQuery = useQuery<NotificationItem[]>({
    queryKey: listKey,
    queryFn: () => fetchNotifications(token!, locale),
    enabled: isAuthenticated && Boolean(token),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
  });

  const unreadQuery = useQuery<number>({
    queryKey: unreadKey,
    queryFn: () => fetchUnreadCount(token!, locale),
    enabled: isAuthenticated && Boolean(token),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  });

  const invalidateAll = () =>
    queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationRead(token!, id, locale),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      await queryClient.cancelQueries({ queryKey: unreadKey });

      const prevList = queryClient.getQueryData<NotificationItem[]>(listKey);
      const prevUnread = queryClient.getQueryData<number>(unreadKey);

      queryClient.setQueryData<NotificationItem[]>(listKey, (prev) =>
        (prev ?? []).map((n) => (n.id === id ? { ...n, read: true } : n)),
      );

      if (prevList) {
        const wasUnread = prevList.some((n) => n.id === id && !n.read);
        if (wasUnread) {
          queryClient.setQueryData<number>(unreadKey, (c) =>
            Math.max(0, (c ?? 1) - 1),
          );
        }
      }

      return { prevList, prevUnread };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prevList) queryClient.setQueryData(listKey, ctx.prevList);
      if (ctx?.prevUnread !== undefined) {
        queryClient.setQueryData(unreadKey, ctx.prevUnread);
      }
    },
    onSettled: () => {
      void invalidateAll();
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => markAllNotificationsRead(token!, locale),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: listKey });
      await queryClient.cancelQueries({ queryKey: unreadKey });

      const prevList = queryClient.getQueryData<NotificationItem[]>(listKey);
      const prevUnread = queryClient.getQueryData<number>(unreadKey);

      queryClient.setQueryData<NotificationItem[]>(listKey, (prev) =>
        (prev ?? []).map((n) => ({ ...n, read: true })),
      );
      queryClient.setQueryData<number>(unreadKey, 0);

      return { prevList, prevUnread };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prevList) queryClient.setQueryData(listKey, ctx.prevList);
      if (ctx?.prevUnread !== undefined) {
        queryClient.setQueryData(unreadKey, ctx.prevUnread);
      }
    },
    onSettled: () => {
      void invalidateAll();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNotification(token!, id, locale),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      await queryClient.cancelQueries({ queryKey: unreadKey });

      const prevList = queryClient.getQueryData<NotificationItem[]>(listKey);
      const prevUnread = queryClient.getQueryData<number>(unreadKey);

      const removed = prevList?.find((n) => n.id === id);
      queryClient.setQueryData<NotificationItem[]>(listKey, (prev) =>
        (prev ?? []).filter((n) => n.id !== id),
      );
      if (removed && !removed.read) {
        queryClient.setQueryData<number>(unreadKey, (c) =>
          Math.max(0, (c ?? 1) - 1),
        );
      }

      return { prevList, prevUnread };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prevList) queryClient.setQueryData(listKey, ctx.prevList);
      if (ctx?.prevUnread !== undefined) {
        queryClient.setQueryData(unreadKey, ctx.prevUnread);
      }
    },
    onSettled: () => {
      void invalidateAll();
    },
  });

  const registerTokenMutation = useMutation({
    mutationFn: (body: ApiRegisterDeviceTokenBody) =>
      registerDeviceToken(token!, body, locale),
  });

  const notifications = listQuery.data ?? [];
  const unreadFromList = notifications.filter((n) => !n.read).length;
  const unreadCount =
    unreadQuery.data !== undefined ? unreadQuery.data : unreadFromList;

  return {
    notifications,
    unreadCount,
    isLoading:
      isAuthLoading ||
      (isAuthenticated && (listQuery.isLoading || unreadQuery.isLoading)),
    isError: listQuery.isError || unreadQuery.isError,
    isAuthenticated,
    refetch: async () => {
      await Promise.all([listQuery.refetch(), unreadQuery.refetch()]);
    },
    markAsRead: (id: string) => markReadMutation.mutateAsync(id),
    markAllAsRead: () => markAllReadMutation.mutateAsync(),
    deleteNotification: (id: string) => deleteMutation.mutateAsync(id),
    registerDeviceToken: (body: ApiRegisterDeviceTokenBody) =>
      registerTokenMutation.mutateAsync(body),
    isMarkingRead: markReadMutation.isPending,
    isMarkingAllRead: markAllReadMutation.isPending,
  };
}
