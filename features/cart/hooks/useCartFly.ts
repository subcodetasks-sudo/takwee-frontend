"use client";

/**
 * Re-export for callers that expect hooks under `features/cart/hooks`.
 * Implementation lives with CartFlyProvider so context and hook stay colocated.
 */
export { useCartFly, CartFlyProvider } from "../context/CartFlyProvider";
