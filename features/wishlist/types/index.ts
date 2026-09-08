import type { Product, AbayaSize } from "@/features/product/types";

export interface WishlistItem {
  id: string;
  productId: string;
  product?: Product;
  selectedSize?: AbayaSize;
  selectedColorId?: string;
  addedAt: string;
}

export interface WishlistState {
  items: WishlistItem[];
  itemCount: number;
}
