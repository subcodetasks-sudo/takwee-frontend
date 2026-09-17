import type { CartItem } from "../types";

export const CART_STORAGE_KEY = "linen_line_cart";

export function generateCartItemId(
  productId: string,
  selectedColorId?: string,
  selectedSize?: string,
): string {
  return `${productId}::${selectedColorId ?? "default"}::${selectedSize ?? "default"}`;
}

export function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isCartItem);
  } catch {
    return [];
  }
}

export function writeCartToStorage(items: CartItem[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore quota / private-mode errors
  }
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.productId === "string" &&
    typeof item.quantity === "number" &&
    item.quantity > 0 &&
    typeof item.addedAt === "string" &&
    item.product != null &&
    typeof item.product === "object"
  );
}
