"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/features/auth";
import { getProductById } from "@/features/product/utils/get-product";
import type { Product } from "@/features/product/types";
import { syncCartToServer } from "../api/sync-cart";
import type { AddToCartOptions, CartItem } from "../types";
import {
  readCartFromStorage,
  writeCartToStorage,
  generateCartItemId,
  CART_STORAGE_KEY,
} from "../utils/cart-storage";

interface CartContextValue {
  items: CartItem[];
  /** Total quantity of all items in the bag. */
  itemCount: number;
  /** Number of unique line items in the bag. */
  lineItemCount: number;
  /** Subtotal of all items in TRY. */
  subtotalTRY: number;
  /** False until localStorage has been read on the client. */
  isHydrated: boolean;
  isInCart: (productId: string, options?: AddToCartOptions) => boolean;
  getItemQuantity: (productId: string, options?: AddToCartOptions) => number;
  addItem: (product: Product, options?: AddToCartOptions) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/** Prefer live catalog data when available; keep stored snapshot as fallback. */
function hydrateProducts(items: CartItem[]): CartItem[] {
  return items.map((item) => {
    const live = getProductById(item.productId);
    if (!live) return item;
    return { ...item, product: live };
  });
}

function createCartItem(
  product: Product,
  options?: AddToCartOptions,
): CartItem {
  const selectedColorId = options?.selectedColorId ?? product.colors[0]?.id;
  const selectedSize = options?.selectedSize ?? product.sizes[0];
  const id = generateCartItemId(product.id, selectedColorId, selectedSize);

  return {
    id,
    productId: product.id,
    product,
    quantity: Math.max(1, options?.quantity ?? 1),
    selectedColorId,
    selectedSize,
    addedAt: new Date().toISOString(),
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setItems(hydrateProducts(readCartFromStorage()));
    setIsHydrated(true);

    const onStorage = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY || event.key === null) {
        setItems(hydrateProducts(readCartFromStorage()));
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback(
    (nextItems: CartItem[]) => {
      const hydrated = hydrateProducts(nextItems);
      writeCartToStorage(hydrated);
      setItems(hydrated);
      void syncCartToServer(hydrated, isAuthenticated);
    },
    [isAuthenticated],
  );

  const isInCart = useCallback(
    (productId: string, options?: AddToCartOptions) => {
      const targetId = options
        ? generateCartItemId(
            productId,
            options.selectedColorId,
            options.selectedSize,
          )
        : null;

      return items.some((item) =>
        targetId ? item.id === targetId : item.productId === productId,
      );
    },
    [items],
  );

  const getItemQuantity = useCallback(
    (productId: string, options?: AddToCartOptions) => {
      const targetId = options
        ? generateCartItemId(
            productId,
            options.selectedColorId,
            options.selectedSize,
          )
        : null;

      if (targetId) {
        return items.find((item) => item.id === targetId)?.quantity ?? 0;
      }

      return items
        .filter((item) => item.productId === productId)
        .reduce((sum, item) => sum + item.quantity, 0);
    },
    [items],
  );

  const addItem = useCallback(
    (product: Product, options?: AddToCartOptions) => {
      const current = hydrateProducts(readCartFromStorage());
      const selectedColorId = options?.selectedColorId ?? product.colors[0]?.id;
      const selectedSize = options?.selectedSize ?? product.sizes[0];
      const targetId = generateCartItemId(
        product.id,
        selectedColorId,
        selectedSize,
      );
      const addQty = Math.max(1, options?.quantity ?? 1);

      const existingIndex = current.findIndex((item) => item.id === targetId);

      if (existingIndex > -1) {
        const next = [...current];
        const existing = next[existingIndex]!;
        next[existingIndex] = {
          ...existing,
          quantity: existing.quantity + addQty,
          product,
        };
        persist(next);
      } else {
        persist([createCartItem(product, options), ...current]);
      }
    },
    [persist],
  );

  const removeItem = useCallback(
    (itemId: string) => {
      const current = hydrateProducts(readCartFromStorage());
      persist(current.filter((item) => item.id !== itemId));
    },
    [persist],
  );

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      const current = hydrateProducts(readCartFromStorage());
      if (quantity <= 0) {
        persist(current.filter((item) => item.id !== itemId));
        return;
      }

      const next = current.map((item) =>
        item.id === itemId ? { ...item, quantity } : item,
      );
      persist(next);
    },
    [persist],
  );

  const clear = useCallback(() => {
    persist([]);
  }, [persist]);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotalTRY = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.product.priceTRY * item.quantity,
        0,
      ),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount,
      lineItemCount: items.length,
      subtotalTRY,
      isHydrated,
      isInCart,
      getItemQuantity,
      addItem,
      removeItem,
      updateQuantity,
      clear,
    }),
    [
      items,
      itemCount,
      subtotalTRY,
      isHydrated,
      isInCart,
      getItemQuantity,
      addItem,
      removeItem,
      updateQuantity,
      clear,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
