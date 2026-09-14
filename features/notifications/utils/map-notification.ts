import type { NotificationItem, NotificationKind } from "../types";
import type { ApiNotificationItem } from "../types/api";

function mapKind(type: string): NotificationKind {
  const t = type.toLowerCase();
  if (t.startsWith("order") || t.includes("shipment") || t.includes("delivery")) {
    return "order";
  }
  if (
    t.startsWith("promo") ||
    t.startsWith("sale") ||
    t.includes("offer") ||
    t.includes("coupon")
  ) {
    return "promo";
  }
  return "system";
}

function mapHref(type: string): string | undefined {
  const t = type.toLowerCase();
  if (t.startsWith("order") || t.includes("shipment") || t.includes("delivery")) {
    return "/me/orders";
  }
  if (t.includes("wishlist")) {
    return "/wishlist";
  }
  if (
    t.startsWith("promo") ||
    t.startsWith("sale") ||
    t.includes("offer") ||
    t.includes("coupon")
  ) {
    return "/shop";
  }
  return undefined;
}

/** Normalize API datetime strings (`YYYY-MM-DD HH:mm:ss` → ISO-ish). */
function normalizeCreatedAt(raw?: string): string {
  if (!raw) return new Date().toISOString();
  const trimmed = raw.trim();
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(trimmed)) {
    return trimmed.replace(" ", "T");
  }
  return trimmed;
}

export function mapNotification(item: ApiNotificationItem): NotificationItem {
  const type = item.type || "system";
  const read = Boolean(item.isRead ?? item.is_read);

  return {
    id: String(item.id),
    type,
    kind: mapKind(type),
    title: item.title || "",
    body: item.body || "",
    href: mapHref(type),
    createdAt: normalizeCreatedAt(item.createdAt || item.created_at),
    read,
  };
}

export function mapNotifications(
  items: ApiNotificationItem[],
): NotificationItem[] {
  return items.map(mapNotification);
}
