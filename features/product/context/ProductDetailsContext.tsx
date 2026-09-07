"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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
  isAdded: boolean;
  setIsAdded: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddToCart: () => void;
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
  const [selectedColorId, setSelectedColorId] = useState(
    product.colors[0]?.id,
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<AbayaSize | null>(
    product.sizes[0] ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (!isAdded) return;
    const timer = setTimeout(() => setIsAdded(false), 1600);
    return () => clearTimeout(timer);
  }, [isAdded]);

  const selectedColor =
    product.colors.find((color) => color.id === selectedColorId) ??
    product.colors[0];

  const handleAddToCart = () => {
    if (!product.inStock) return;
    if (!selectedSize) {
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
    onAddToCart?.({
      product,
      colorId: selectedColor?.id ?? product.colors[0]?.id,
      size: selectedSize,
      quantity,
    });
    setIsAdded(true);
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
        isAdded,
        setIsAdded,
        handleAddToCart,
      }}
    >
      {children}
    </ProductDetailsContext.Provider>
  );
}

export function useProductDetails(): ProductDetailsContextValue | null {
  return useContext(ProductDetailsContext);
}
