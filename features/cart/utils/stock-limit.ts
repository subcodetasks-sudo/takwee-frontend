import type { Product } from "@/features/product/types";
import type { CartItem } from "../types";

/** Soft UI ceiling when the API does not provide `stockQuantity`. */
export const FALLBACK_CART_QTY_MAX = 10;

/** Known stock units from the API, or `undefined` when quantity is omitted. */
export function getProductStockLimit(product: Product): number | undefined {
  if (
    typeof product.stockQuantity === "number" &&
    Number.isFinite(product.stockQuantity)
  ) {
    return Math.max(0, Math.floor(product.stockQuantity));
  }
  return undefined;
}

/** Total units of a product already in the bag (all color/size lines). */
export function getProductQuantityInCart(
  items: CartItem[],
  productId: string,
  excludeItemId?: string,
): number {
  return items.reduce((sum, item) => {
    if (item.productId !== productId) return sum;
    if (excludeItemId && item.id === excludeItemId) return sum;
    return sum + item.quantity;
  }, 0);
}

/**
 * How many more units can be added for this product.
 * Returns `undefined` when stock is unknown (no hard cap).
 * Returns `0` when the product is marked out of stock.
 */
export function getAvailableStock(
  product: Product,
  items: CartItem[],
  excludeItemId?: string,
): number | undefined {
  if (!product.inStock) return 0;

  const limit = getProductStockLimit(product);
  if (limit === undefined) return undefined;

  const inCart = getProductQuantityInCart(items, product.id, excludeItemId);
  return Math.max(0, limit - inCart);
}

/** Clamp a requested quantity to available stock when known. */
export function clampToAvailableStock(
  requested: number,
  available: number | undefined,
): number {
  const qty = Math.max(0, Math.floor(requested));
  if (available === undefined) return qty;
  return Math.min(qty, available);
}

/**
 * Max selectable quantity on PDP steppers: remaining stock, or fallback when unknown.
 */
export function getMaxSelectableQuantity(
  product: Product,
  itemsInCartForProduct: number,
): number {
  if (!product.inStock) return 0;

  const limit = getProductStockLimit(product);
  if (limit === undefined) return FALLBACK_CART_QTY_MAX;

  return Math.max(0, limit - Math.max(0, itemsInCartForProduct));
}
