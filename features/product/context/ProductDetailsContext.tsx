"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  getMaxSelectableQuantity,
  useCart,
  useCartFly,
} from "@/features/cart";
import { useWishlist } from "@/features/wishlist";
import { gooeyToast } from "@/components/ui/goey-toaster";
import type { AbayaSize, Product } from "../types";

export interface ProductDetailsContextValue {
  product: Product;
  productName: string;
  selectedColorId: string | undefined;
  setSelectedColorId: (id: string) => void;
  activeImageIndex: number;
  setActiveImageIndex: (index: number) => void;
  selectedSize: AbayaSize | null;
  setSelectedSize: (size: AbayaSize | null) => void;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  maxQuantity: number;
  isAdded: boolean;
  setIsAdded: React.Dispatch<React.SetStateAction<boolean>>;
  isWishlisted: boolean;
  isInCart: boolean;
  handleAddToCart: (origin?: HTMLElement | null) => void;
  handleToggleWishlist: () => void;
}

const ProductDetailsContext =
  createContext<ProductDetailsContextValue | null>(null);

export interface ProductDetailsProviderProps {
  product: Product;
  productName: string;
  onAddToCart?: (payload: {
    product: Product;
    colorId: string;
    size: AbayaSize;
    quantity: number;
  }) => void;
  children: React.ReactNode;
}

export function ProductDetailsProvider({
  product,
  productName,
  onAddToCart,
  children,
}: ProductDetailsProviderProps) {
  const {
    addItem,
    getItemQuantity,
    isInCart: isCartInCart,
    isHydrated,
  } = useCart();
  const { flyToCart } = useCartFly();
  const { isWishlisted: isProductWishlisted, toggleItem } = useWishlist();
  const tCart = useTranslations("CartPage.toasts");
  const tWishlist = useTranslations("WishlistPage.toasts");
  const [selectedColorId, setSelectedColorId] = useState(
    product.colors[0]?.id,
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<AbayaSize | null>(
    product.sizes[0]?.name ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const inCartQty = isHydrated ? getItemQuantity(product.id) : 0;
  const maxQuantity = getMaxSelectableQuantity(product, inCartQty);

  useEffect(() => {
    if (!isAdded) return;
    const timer = setTimeout(() => setIsAdded(false), 1600);
    return () => clearTimeout(timer);
  }, [isAdded]);

  useEffect(() => {
    setQuantity((q) => {
      if (maxQuantity <= 0) return 1;
      return Math.min(q, maxQuantity);
    });
  }, [maxQuantity]);

  const selectedColor =
    product.colors.find((color) => color.id === selectedColorId) ??
    product.colors[0];
  const isWishlisted = isProductWishlisted(product.id);
  const isInCart = (isHydrated && isCartInCart(product.id)) || isAdded;

  const handleAddToCart = (origin?: HTMLElement | null) => {
    if (!product.inStock) return;
    if (product.sizes.length > 0 && !selectedSize) {
      const el = document.getElementById("size-selector");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-primary", "rounded-xl", "p-2", "transition-all");
        setTimeout(() => {
          el.classList.remove("ring-2", "ring-primary", "rounded-xl", "p-2");
        }, 1800);
      }
      return;
    }
    const colorId = selectedColor?.id ?? product.colors[0]?.id;
    const imageUrl =
      selectedColor?.images[activeImageIndex] ??
      selectedColor?.images[0] ??
      product.images?.[activeImageIndex] ??
      product.images?.[0] ??
      product.colors[0]?.images[0] ??
      "";
    const result = addItem(product, {
      selectedColorId: colorId,
      selectedSize: selectedSize ?? undefined,
      quantity,
    });

    if (result.added <= 0) {
      gooeyToast.error(
        result.stockLimit != null && result.stockLimit > 0
          ? tCart("stockLimit", { count: result.stockLimit })
          : tCart("stockLimitReached"),
      );
      return;
    }

    if (origin) {
      flyToCart({
        origin,
        imageUrl,
        alt: productName,
      });
    }
    onAddToCart?.({
      product,
      colorId: colorId ?? "",
      size: (selectedSize ?? "") as AbayaSize,
      quantity: result.added,
    });
    setIsAdded(true);
    if (result.capped && result.stockLimit != null) {
      gooeyToast.warning(tCart("stockLimit", { count: result.stockLimit }));
    } else {
      gooeyToast.success(tCart("added"));
    }
  };

  const handleToggleWishlist = () => {
    const next = toggleItem(product, {
      selectedColorId: selectedColor?.id ?? product.colors[0]?.id,
      selectedSize: selectedSize ?? undefined,
    });
    gooeyToast.success(next ? tWishlist("added") : tWishlist("removed"));
  };

  return (
    <ProductDetailsContext.Provider
      value={{
        product,
        productName,
        selectedColorId,
        setSelectedColorId,
        activeImageIndex,
        setActiveImageIndex,
        selectedSize,
        setSelectedSize,
        quantity,
        setQuantity,
        maxQuantity,
        isAdded,
        setIsAdded,
        isWishlisted,
        isInCart,
        handleAddToCart,
        handleToggleWishlist,
      }}
    >
      {children}
    </ProductDetailsContext.Provider>
  );
}

export function useProductDetails(): ProductDetailsContextValue | null {
  return useContext(ProductDetailsContext);
}
