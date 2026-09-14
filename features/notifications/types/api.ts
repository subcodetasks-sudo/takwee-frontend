/**
 * Raw backend DTOs for customer notifications (`/api/v1/notifications`).
 */

export interface ApiNotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  /** API example uses camelCase; snake_case tolerated. */
  isRead?: boolean;
  is_read?: boolean;
  createdAt?: string;
  created_at?: string;
}

export interface ApiPaginatedNotifications {
  data: ApiNotificationItem[];
  meta?: {
    total?: number;
    per_page?: number;
    current_page?: number;
    last_page?: number;
  };
  links?: {
    next?: string | null;
  };
}

export interface ApiUnreadCountData {
  count: number;
}

export interface ApiRegisterDeviceTokenBody {
  device_token: string;
  device_type: "android" | "ios" | "web" | string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
