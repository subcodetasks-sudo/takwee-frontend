import type { WishlistItem } from "../types";

export const WISHLIST_STORAGE_KEY = "linen_line_wishlist";

export function readWishlistFromStorage(): WishlistItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isWishlistItem);
  } catch {
    return [];
  }
}

export function writeWishlistToStorage(items: WishlistItem[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore quota / private-mode errors
  }
}

function isWishlistItem(value: unknown): value is WishlistItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.productId === "string" &&
    typeof item.addedAt === "string" &&
    item.product != null &&
    typeof item.product === "object"
  );
}
