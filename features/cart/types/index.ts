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

export interface CartState {
  items: CartItem[];
  /** Total sum of all quantities. */
  itemCount: number;
  /** Count of distinct line items. */
  lineItemCount: number;
  /** Subtotal in TRY. */
  subtotalTRY: number;
}
