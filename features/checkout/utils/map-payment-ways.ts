import { resolveImageUrl } from "@/lib/images";
import type { ApiPaymentWay } from "../types/api";
import type { PaymentWay } from "../types";

/** Client-only id for the settings WhatsApp option (not an API payment way). */
export const WHATSAPP_CHECKOUT_ID = "whatsapp";

function asText(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function isWhatsappPaymentWay(raw: {
  name?: string | null;
  type?: string | null;
  code?: string | null;
}): boolean {
  const blob = `${raw.type ?? ""} ${raw.code ?? ""} ${raw.name ?? ""}`.toLowerCase();
  return (
    blob.includes("whatsapp") ||
    blob.includes("واتساب") ||
    blob.includes("واتس")
  );
}

export function mapPaymentWay(raw: ApiPaymentWay): PaymentWay | null {
  const id = String(raw.id ?? "").trim();
  if (!id) return null;

  const logoSrc = asText(raw.logo);
  const logo = logoSrc ? resolveImageUrl(logoSrc) || logoSrc : null;

  return {
    id,
    name: asText(raw.name) ?? "",
    logo,
    accountName: asText(raw.account_name),
    accountNumber: asText(raw.account_number),
    sortOrder: Number.isFinite(Number(raw.sort_order))
      ? Number(raw.sort_order)
      : 0,
    kind: isWhatsappPaymentWay(raw) ? "whatsapp" : "transfer",
  };
}

export function mapPaymentWays(rows: ApiPaymentWay[] | null | undefined): PaymentWay[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .map(mapPaymentWay)
    .filter((way): way is PaymentWay => way !== null)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}
