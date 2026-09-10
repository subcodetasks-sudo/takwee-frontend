export type NotificationKind = "order" | "promo" | "system";

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  /** i18n key under Notifications.items.* */
  titleKey: string;
  bodyKey: string;
  href?: string;
  createdAt: string;
  read: boolean;
}
