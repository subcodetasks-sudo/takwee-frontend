import type { OrderPaymentMethod } from "../types";

/** Maps API `payment_method` / payment.method to storefront camelCase. */
export function mapApiPaymentMethod(
  raw?: string | null,
): OrderPaymentMethod | undefined {
  if (!raw) return undefined;
  const s = raw.toLowerCase().trim();
  if (s === "bank_transfer" || s.includes("bank") || s.includes("transfer")) {
    return "bankTransfer";
  }
  if (s.includes("cod") || s.includes("cash")) {
    return "cashOnDelivery";
  }
  if (s.includes("card") || s.includes("credit") || s.includes("debit")) {
    return "card";
  }
  return undefined;
}

/** Storefront method → API snake_case for checkout body. */
export function toApiPaymentMethod(method: OrderPaymentMethod): string {
  switch (method) {
    case "bankTransfer":
      return "bank_transfer";
    case "cashOnDelivery":
      return "cash_on_delivery";
    case "card":
      return "card";
  }
}
