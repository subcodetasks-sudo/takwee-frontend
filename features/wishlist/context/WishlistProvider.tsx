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
import type { Product } from "@/features/product/types";
import { syncWishlistToServer } from "../api/sync-wishlist";
import type { ToggleWishlistOptions, WishlistItem } from "../types";
import {
  readWishlistFromStorage,
  writeWishlistToStorage,
  WISHLIST_STORAGE_KEY,
} from "../utils/wishlist-storage";

interface WishlistContextValue {
  items: WishlistItem[];
  itemCount: number;
  /** False until localStorage has been read on the client. */
  isHydrated: boolean;
  isWishlisted: (productId: string) => boolean;
  addItem: (product: Product, options?: ToggleWishlistOptions) => void;
  removeItem: (productId: string) => void;
  /** Returns `true` when the product is now on the wishlist. */
  toggleItem: (product: Product, options?: ToggleWishlistOptions) => boolean;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function hydrateProducts(items: WishlistItem[]): WishlistItem[] {
  return items;
}

function createWishlistItem(
  product: Product,
  options?: ToggleWishlistOptions,
): WishlistItem {
  return {
    id: product.id,
    productId: product.id,
    product,
    selectedColorId: options?.selectedColorId ?? product.colors[0]?.id,
    selectedSize: options?.selectedSize,
    addedAt: new Date().toISOString(),
  };
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setItems(hydrateProducts(readWishlistFromStorage()));
    setIsHydrated(true);

    const onStorage = (event: StorageEvent) => {
      if (event.key === WISHLIST_STORAGE_KEY || event.key === null) {
        setItems(hydrateProducts(readWishlistFromStorage()));
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback(
    (nextItems: WishlistItem[]) => {
      const hydrated = hydrateProducts(nextItems);
      writeWishlistToStorage(hydrated);
      setItems(hydrated);
      void syncWishlistToServer(hydrated, isAuthenticated);
    },
    [isAuthenticated],
  );

  const isWishlisted = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items],
  );

  const addItem = useCallback(
    (product: Product, options?: ToggleWishlistOptions) => {
      const current = hydrateProducts(readWishlistFromStorage());
      if (current.some((item) => item.productId === product.id)) return;
      persist([createWishlistItem(product, options), ...current]);
    },
    [persist],
  );

  const removeItem = useCallback(
    (productId: string) => {
      const current = hydrateProducts(readWishlistFromStorage());
      persist(current.filter((item) => item.productId !== productId));
    },
    [persist],
  );

  const toggleItem = useCallback(
    (product: Product, options?: ToggleWishlistOptions) => {
      const current = hydrateProducts(readWishlistFromStorage());
      const exists = current.some((item) => item.productId === product.id);

      if (exists) {
        persist(current.filter((item) => item.productId !== product.id));
        return false;
      }

      persist([createWishlistItem(product, options), ...current]);
      return true;
    },
    [persist],
  );

  const clear = useCallback(() => {
    persist([]);
  }, [persist]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      itemCount: items.length,
      isHydrated,
      isWishlisted,
      addItem,
      removeItem,
      toggleItem,
      clear,
    }),
    [
      items,
      isHydrated,
      isWishlisted,
      addItem,
      removeItem,
      toggleItem,
      clear,
    ],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
