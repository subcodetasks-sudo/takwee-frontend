"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { fetchProducts } from "../api/get-products";

export const productsQueryKey = (locale: string) =>
  ["products", locale] as const;

export interface UseProductsOptions {
  /** When set, only products in this API category id are returned. */
  categoryId?: string;
}

/**
 * Shared products query for shop chrome / client consumers.
 * ShopView prefers RSC `fetchProducts` / `getShopProducts`; this hook
 * shares the same query key if hydrated later.
 */
export function useProducts(options?: UseProductsOptions) {
  const locale = useLocale();
  const categoryId = options?.categoryId;

  const query = useQuery({
    queryKey: productsQueryKey(locale),
    queryFn: () => fetchProducts(locale),
  });

  const allProducts = query.data ?? [];
  const products = categoryId
    ? allProducts.filter((product) => product.categoryId === categoryId)
    : allProducts;

  return {
    ...query,
    products,
    allProducts,
  };
}
