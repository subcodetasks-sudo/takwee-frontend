import { ApiError, getApiBaseUrl, http } from "@/lib/api-client";
import type { NotificationItem } from "../types";
import type {
  ApiNotificationItem,
  ApiPaginatedNotifications,
  ApiRegisterDeviceTokenBody,
  ApiResponse,
  ApiUnreadCountData,
} from "../types/api";
import { mapNotifications } from "../utils/map-notification";

const NOTIFICATIONS_PATH = "/api/v1/notifications";
const LIST_PER_PAGE = 100;

function requireApiAndToken(token: string) {
  if (!getApiBaseUrl()) {
    throw new Error("API_BASE_URL / NEXT_PUBLIC_API_BASE_URL is not configured");
  }
  if (!token) {
    throw new Error("Authentication required");
  }
}

function localeHeaders(locale?: string): Record<string, string> {
  return locale ? { "Accept-Language": locale } : {};
}

function unwrapNotificationsPage(
  res: ApiResponse<ApiPaginatedNotifications | ApiNotificationItem[]>,
): { items: ApiNotificationItem[]; lastPage: number } {
  if (Array.isArray(res.data)) {
    return { items: res.data, lastPage: 1 };
  }

  const page = res.data;
  const items = Array.isArray(page?.data) ? page.data : [];
  const lastPage = page?.meta?.last_page ?? 1;
  return { items, lastPage };
}

async function fetchNotificationsPage(
  token: string,
  page: number,
  locale?: string,
): Promise<ApiResponse<ApiPaginatedNotifications | ApiNotificationItem[]>> {
  return http.get<ApiResponse<ApiPaginatedNotifications | ApiNotificationItem[]>>(
    NOTIFICATIONS_PATH,
    {
      token,
      params: {
        per_page: LIST_PER_PAGE,
        page,
      },
      headers: localeHeaders(locale),
    },
  );
}

/**
 * Client-side notifications list (GET /api/v1/notifications).
 * Walks paginated results. Throws on failure — use as React Query queryFn.
 */
export async function fetchNotifications(
  token: string,
  locale?: string,
): Promise<NotificationItem[]> {
  requireApiAndToken(token);

  const first = await fetchNotificationsPage(token, 1, locale);

  if (!first?.success || first.data == null) {
    throw new ApiError(
      500,
      "Invalid Payload",
      first,
      first?.message || "Failed to load notifications",
    );
  }

  const { items, lastPage } = unwrapNotificationsPage(first);
  const collected = [...items];

  for (let page = 2; page <= lastPage; page += 1) {
    const next = await fetchNotificationsPage(token, page, locale);
    if (next?.success && next.data != null) {
      collected.push(...unwrapNotificationsPage(next).items);
    }
  }

  return mapNotifications(collected);
}

/**
 * Unread badge count (GET /api/v1/notifications/unread-count).
 */
export async function fetchUnreadCount(
  token: string,
  locale?: string,
): Promise<number> {
  requireApiAndToken(token);

  const res = await http.get<ApiResponse<ApiUnreadCountData>>(
    `${NOTIFICATIONS_PATH}/unread-count`,
    {
      token,
      headers: localeHeaders(locale),
    },
  );

  if (!res?.success || res.data == null) {
    throw new ApiError(
      500,
      "Invalid Payload",
      res,
      res?.message || "Failed to load unread count",
    );
  }

  return Number(res.data.count) || 0;
}

/**
 * Mark one notification as read (PUT /api/v1/notifications/{id}/read).
 */
export async function markNotificationRead(
  token: string,
  notificationId: string,
  locale?: string,
): Promise<void> {
  requireApiAndToken(token);

  const res = await http.put<ApiResponse<null>>(
    `${NOTIFICATIONS_PATH}/${notificationId}/read`,
    undefined,
    {
      token,
      headers: localeHeaders(locale),
    },
  );

  if (!res?.success) {
    throw new ApiError(
      400,
      "Mark Read Failed",
      res,
      res?.message || "Failed to mark notification as read",
    );
  }
}

/**
 * Mark all notifications as read (PUT /api/v1/notifications/read-all).
 */
export async function markAllNotificationsRead(
  token: string,
  locale?: string,
): Promise<void> {
  requireApiAndToken(token);

  const res = await http.put<ApiResponse<null>>(
    `${NOTIFICATIONS_PATH}/read-all`,
    undefined,
    {
      token,
      headers: localeHeaders(locale),
    },
  );

  if (!res?.success) {
    throw new ApiError(
      400,
      "Mark All Read Failed",
      res,
      res?.message || "Failed to mark all notifications as read",
    );
  }
}

/**
 * Delete a notification (DELETE /api/v1/notifications/{id}).
 */
export async function deleteNotification(
  token: string,
  notificationId: string,
  locale?: string,
): Promise<void> {
  requireApiAndToken(token);

  const res = await http.delete<ApiResponse<null>>(
    `${NOTIFICATIONS_PATH}/${notificationId}`,
    {
      token,
      headers: localeHeaders(locale),
    },
  );

  if (!res?.success) {
    throw new ApiError(
      400,
      "Delete Failed",
      res,
      res?.message || "Failed to delete notification",
    );
  }
}

/**
 * Register a push device token (POST /api/v1/notifications/token).
 */
export async function registerDeviceToken(
  token: string,
  body: ApiRegisterDeviceTokenBody,
  locale?: string,
): Promise<void> {
  requireApiAndToken(token);

  const res = await http.post<ApiResponse<null>>(
    `${NOTIFICATIONS_PATH}/token`,
    body,
    {
      token,
      headers: localeHeaders(locale),
    },
  );

  if (!res?.success) {
    throw new ApiError(
      400,
      "Register Token Failed",
      res,
      res?.message || "Failed to register device token",
    );
  }
}
