import type { WishlistItem } from "../types";

/**
 * Future: persist wishlist to the authenticated user's account.
 * Local storage remains the source of truth for guests and a cache when signed in.
 */
export async function syncWishlistToServer(
  items: WishlistItem[],
  isAuthenticated: boolean,
): Promise<void> {
  if (!isAuthenticated) return;

  // TODO: Replace with API call, e.g. PUT /api/wishlist { items }
  void items;
}
