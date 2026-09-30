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

export function formatDeliveryAddress(
  address: {
    countryName?: string | null;
    stateOrProvince?: string | null;
    city?: string | null;
    district?: string | null;
    streetAddress?: string | null;
    apartmentOrSuite?: string | null;
  } | null,
): string | null {
  if (!address) return null;
  const parts = [
    address.streetAddress,
    address.apartmentOrSuite,
    address.district,
    address.city,
    address.stateOrProvince,
    address.countryName,
  ]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part));
  return parts.length > 0 ? parts.join(" - ") : null;
}

/** Prefilled cart message for the WhatsApp order button (no placed order yet). */
export function buildWhatsappCartText(parts: {
  greeting: string;
  intro: string;
  detailsTitle: string;
  items: { name: string; meta: string[] }[];
  totalLine: string;
  customerTitle: string;
  customerLines: string[];
  closing: string;
}): string {
  const lines: string[] = [parts.greeting, parts.intro, "", parts.detailsTitle];
  parts.items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.name}`);
    for (const meta of item.meta) lines.push(`   • ${meta}`);
  });
  lines.push("", parts.totalLine, "", parts.customerTitle, ...parts.customerLines, "", parts.closing);
  return lines.join("\n");
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
