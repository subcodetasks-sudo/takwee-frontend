import { whatsappHref } from "@/features/settings/utils/map-settings";

/**
 * WhatsApp destination for completing an order.
 * Prefers the store phone (`contact_phone`), then `contact_whatsapp`,
 * then a WhatsApp payment-way account number.
 */
export function resolveOrderWhatsappTarget(
  sources: Array<string | null | undefined>,
): { href: string | null; phone: string | null } {
  for (const source of sources) {
    const href = whatsappHref(source);
    const phone = source?.trim();
    if (href && phone) return { href, phone };
  }
  return { href: null, phone: null };
}

export function buildWhatsappOrderText(parts: {
  intro: string;
  orderLine: string;
  itemLines: string[];
  totalLine: string;
}): string {
  return [
    parts.intro,
    "",
    parts.orderLine,
    ...parts.itemLines,
    "",
    parts.totalLine,
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}

/** Appends the order text to a `https://wa.me/{id}` link. */
export function withWhatsappText(href: string, text: string): string {
  const url = new URL(href);
  url.searchParams.set("text", text);
  return url.toString();
}

export function formatOrderAmount(
  amountTRY: number,
  symbol: string,
  rateAgainstTRY: number,
  locale: string,
): string {
  const converted = amountTRY * (rateAgainstTRY || 1);
  const formatted = converted.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${formatted} ${symbol}`.trim();
}
