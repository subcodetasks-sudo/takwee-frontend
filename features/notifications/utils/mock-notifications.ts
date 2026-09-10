import type { NotificationItem } from "../types";

/** Mock boutique notifications — swap for API later. */
export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    kind: "order",
    titleKey: "orderShippedTitle",
    bodyKey: "orderShippedBody",
    href: "/me/orders",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    read: false,
  },
  {
    id: "n2",
    kind: "promo",
    titleKey: "linenEditTitle",
    bodyKey: "linenEditBody",
    href: "/shop/linen",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: false,
  },
  {
    id: "n3",
    kind: "order",
    titleKey: "orderDeliveredTitle",
    bodyKey: "orderDeliveredBody",
    href: "/me/orders",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    read: true,
  },
  {
    id: "n4",
    kind: "system",
    titleKey: "wishlistReminderTitle",
    bodyKey: "wishlistReminderBody",
    href: "/wishlist",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    read: true,
  },
];
