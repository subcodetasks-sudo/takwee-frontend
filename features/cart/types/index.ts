import type { Product, AbayaSize } from "@/features/product/types";

export interface CartItem {
  /** Stable unique identifier derived from productId, colorId, and size. */
  id: string;
  productId: string;
  /** Product snapshot for display offline / without a catalog round-trip. */
  product: Product;
  quantity: number;
  selectedSize?: AbayaSize;
  selectedColorId?: string;
  /** ISO date string. */
  addedAt: string;
}

export interface AddToCartOptions {
  quantity?: number;
  selectedSize?: AbayaSize;
  selectedColorId?: string;
}

/** Result of addItem / updateQuantity when stock limits apply. */
export interface CartStockChangeResult {
  /** Final line quantity after the change (0 when the line was removed or not added). */
  quantity: number;
  /** Units newly added to the bag (addItem only; 0 when blocked). */
  added: number;
  /** True when the requested amount exceeded available stock. */
  capped: boolean;
  /** Remaining units that can still be added for this product, when stock is known. */
  available?: number;
  /** Product stock ceiling when known. */
  stockLimit?: number;
}

export interface CartState {
  items: CartItem[];
  /** Total sum of all quantities. */
  itemCount: number;
  /** Count of distinct line items. */
  lineItemCount: number;
  /** Subtotal in TRY. */
  subtotalTRY: number;
}
