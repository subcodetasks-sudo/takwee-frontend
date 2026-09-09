"use client";

/**
 * Re-export for callers that expect hooks under `features/cart/hooks`.
 * Implementation lives with CartProvider so context and hook stay colocated.
 */
export { useCart, CartProvider } from "../context/CartProvider";
