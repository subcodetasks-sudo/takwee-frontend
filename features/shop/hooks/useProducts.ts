"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { fetchProducts } from "../api/get-products";

export interface UseProductsOptions {
  /** When set, only products in this API category id are returned. */
  categoryId?: string;
  /** Optional search query sent to the API. */
  search?: string;
  /** Number of products per page (default: 100). */
  perPage?: number;
}

export const productsQueryKey = (locale: string, search?: string) =>
  search
    ? (["products", locale, { search }] as const)
    : (["products", locale] as const);

/**
 * Shared products query for shop chrome / client consumers.
 * Fetches products via React Query on the client.
 */
export function useProducts(options?: UseProductsOptions) {
  const locale = useLocale();
  const categoryId = options?.categoryId;
  const search = options?.search?.trim();
  const perPage = options?.perPage;

  const query = useQuery({
    queryKey: productsQueryKey(locale, search),
    queryFn: () => fetchProducts(locale, { search, perPage }),
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
