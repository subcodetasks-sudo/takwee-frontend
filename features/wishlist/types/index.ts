import type { Product, AbayaSize } from "@/features/product/types";

export interface WishlistItem {
  /** Stable wishlist row id — currently equal to `productId`. */
  id: string;
  productId: string;
  /** Product snapshot for display offline / without a catalog round-trip. */
  product: Product;
  selectedSize?: AbayaSize;
  selectedColorId?: string;
  /** ISO date string. */
  addedAt: string;
}

export interface WishlistState {
  items: WishlistItem[];
  itemCount: number;
}

export interface ToggleWishlistOptions {
  selectedColorId?: string;
  selectedSize?: AbayaSize;
}
