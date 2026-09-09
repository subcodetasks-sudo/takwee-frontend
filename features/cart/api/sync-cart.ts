import type { CartItem } from "../types";

/**
 * Future: persist cart to the authenticated user's account.
 * Local storage remains the source of truth for guests and a cache when signed in.
 */
export async function syncCartToServer(
  items: CartItem[],
  isAuthenticated: boolean,
): Promise<void> {
  if (!isAuthenticated) return;

  // TODO: Replace with API call, e.g. PUT /api/cart { items }
  void items;
}
