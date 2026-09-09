import type { CartItem } from "../types";
import { SAMPLE_PRODUCTS } from "@/features/product/utils/sample-products";

export const CART_STORAGE_KEY = "linen_line_cart";

export function generateCartItemId(
  productId: string,
  selectedColorId?: string,
  selectedSize?: string,
): string {
  return `${productId}::${selectedColorId ?? "default"}::${selectedSize ?? "default"}`;
}

export function getInitialDemoCartItems(): CartItem[] {
  const p1 = SAMPLE_PRODUCTS[0];
  const p2 = SAMPLE_PRODUCTS[1];
  const items: CartItem[] = [];

  if (p1) {
    items.push({
      id: generateCartItemId(p1.id, p1.colors[0]?.id, "54"),
      productId: p1.id,
      product: p1,
      quantity: 1,
      selectedSize: "54",
      selectedColorId: p1.colors[0]?.id,
      addedAt: new Date().toISOString(),
    });
  }

  if (p2) {
    items.push({
      id: generateCartItemId(p2.id, p2.colors[0]?.id, "56"),
      productId: p2.id,
      product: p2,
      quantity: 1,
      selectedSize: "56",
      selectedColorId: p2.colors[0]?.id,
      addedAt: new Date().toISOString(),
    });
  }

  return items;
}

export function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw === null) {
      // First visit: initialize with demo items so user immediately sees populated cart & checkout box
      const demoItems = getInitialDemoCartItems();
      writeCartToStorage(demoItems);
      return demoItems;
    }

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
