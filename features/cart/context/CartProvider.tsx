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
import type {
  AddToCartOptions,
  CartItem,
  CartStockChangeResult,
} from "../types";
import {
  readCartFromStorage,
  writeCartToStorage,
  generateCartItemId,
  CART_STORAGE_KEY,
} from "../utils/cart-storage";
import {
  clampToAvailableStock,
  getAvailableStock,
  getProductStockLimit,
} from "../utils/stock-limit";

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
  addItem: (
    product: Product,
    options?: AddToCartOptions,
  ) => CartStockChangeResult;
  removeItem: (itemId: string) => void;
  updateQuantity: (
    itemId: string,
    quantity: number,
  ) => CartStockChangeResult;
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

/** Enforce product-level stock across all color/size lines. */
function clampCartToStock(items: CartItem[]): CartItem[] {
  const remainingByProduct = new Map<string, number | undefined>();
  const next: CartItem[] = [];

  for (const item of items) {
    const product = item.product;
    if (!remainingByProduct.has(product.id)) {
      remainingByProduct.set(product.id, getProductStockLimit(product));
    }

    const remaining = remainingByProduct.get(product.id);
    if (remaining === undefined) {
      next.push(item);
      continue;
    }

    if (remaining <= 0) continue;

    const quantity = Math.min(item.quantity, remaining);
    remainingByProduct.set(product.id, remaining - quantity);
    if (quantity > 0) {
      next.push({ ...item, quantity });
    }
  }

  return next;
}

function createCartItem(
  product: Product,
  options?: AddToCartOptions,
  quantity = Math.max(1, options?.quantity ?? 1),
): CartItem {
  const selectedColorId = options?.selectedColorId ?? product.colors[0]?.id;
  const selectedSize = options?.selectedSize ?? product.sizes[0]?.name;
  const id = generateCartItemId(product.id, selectedColorId, selectedSize);

  return {
    id,
    productId: product.id,
    product,
    quantity,
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
    setItems(clampCartToStock(hydrateProducts(readCartFromStorage())));
    setIsHydrated(true);

    const onStorage = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY || event.key === null) {
        setItems(clampCartToStock(hydrateProducts(readCartFromStorage())));
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback(
    (nextItems: CartItem[]) => {
      const hydrated = clampCartToStock(hydrateProducts(nextItems));
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
    (product: Product, options?: AddToCartOptions): CartStockChangeResult => {
      const current = clampCartToStock(
        hydrateProducts(readCartFromStorage()),
      );
      const selectedColorId = options?.selectedColorId ?? product.colors[0]?.id;
      const selectedSize = options?.selectedSize ?? product.sizes[0]?.name;
      const targetId = generateCartItemId(
        product.id,
        selectedColorId,
        selectedSize,
      );
      const requestedQty = Math.max(1, options?.quantity ?? 1);
      const stockLimit = getProductStockLimit(product);
      const available = getAvailableStock(product, current);
      const addQty = clampToAvailableStock(requestedQty, available);
      const capped =
        available !== undefined && (addQty < requestedQty || addQty === 0);

      if (addQty <= 0) {
        return {
          quantity:
            current.find((item) => item.id === targetId)?.quantity ?? 0,
          added: 0,
          capped: true,
          available: available ?? 0,
          stockLimit,
        };
      }

      const existingIndex = current.findIndex((item) => item.id === targetId);

      if (existingIndex > -1) {
        const next = [...current];
        const existing = next[existingIndex]!;
        const quantity = existing.quantity + addQty;
        next[existingIndex] = {
          ...existing,
          quantity,
          product,
        };
        persist(next);
        return {
          quantity,
          added: addQty,
          capped,
          available:
            available === undefined ? undefined : Math.max(0, available - addQty),
          stockLimit,
        };
      }

      persist([
        createCartItem(product, options, addQty),
        ...current,
      ]);
      return {
        quantity: addQty,
        added: addQty,
        capped,
        available:
          available === undefined ? undefined : Math.max(0, available - addQty),
        stockLimit,
      };
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
    (itemId: string, quantity: number): CartStockChangeResult => {
      const current = clampCartToStock(
        hydrateProducts(readCartFromStorage()),
      );
      const existing = current.find((item) => item.id === itemId);

      if (!existing) {
        return { quantity: 0, added: 0, capped: false };
      }

      if (quantity <= 0) {
        persist(current.filter((item) => item.id !== itemId));
        return { quantity: 0, added: 0, capped: false };
      }

      const stockLimit = getProductStockLimit(existing.product);
      const availableForLine = getAvailableStock(
        existing.product,
        current,
        itemId,
      );
      const nextQty = Math.max(
        1,
        clampToAvailableStock(quantity, availableForLine),
      );
      const capped =
        availableForLine !== undefined && nextQty < Math.floor(quantity);

      const next = current.map((item) =>
        item.id === itemId ? { ...item, quantity: nextQty } : item,
      );
      persist(next);

      return {
        quantity: nextQty,
        added: 0,
        capped,
        available:
          availableForLine === undefined
            ? undefined
            : Math.max(0, availableForLine - nextQty),
        stockLimit,
      };
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
