import type { OrderSummary } from "@/features/orders/types";

const CHECKOUT_ORDER_KEY = "linen_line_checkout_order";

export function saveCheckoutOrder(order: OrderSummary): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CHECKOUT_ORDER_KEY, JSON.stringify(order));
  } catch {
    // Ignore quota / private-mode failures in mock flow.
  }
}

export function readCheckoutOrder(): OrderSummary | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CHECKOUT_ORDER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OrderSummary;
  } catch {
    return null;
  }
}

export function clearCheckoutOrder(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(CHECKOUT_ORDER_KEY);
  } catch {
    // Ignore.
  }
}
