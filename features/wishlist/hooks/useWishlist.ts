"use client";

/**
 * Re-export for callers that expect hooks under `features/wishlist/hooks`.
 * Implementation lives with WishlistProvider so context and hook stay colocated.
 */
export { useWishlist, WishlistProvider } from "../context/WishlistProvider";
