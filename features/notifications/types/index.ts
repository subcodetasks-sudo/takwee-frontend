export type NotificationKind = "order" | "promo" | "system";

export interface NotificationItem {
  id: string;
  /** Raw API `type` (e.g. `order_shipped`). */
  type: string;
  kind: NotificationKind;
  title: string;
  body: string;
  href?: string;
  createdAt: string;
  read: boolean;
}

export type {
  ApiNotificationItem,
  ApiPaginatedNotifications,
  ApiRegisterDeviceTokenBody,
  ApiResponse,
  ApiUnreadCountData,
} from "./api";
