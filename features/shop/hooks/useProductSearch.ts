"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useDebounce } from "@/hooks/use-debounce";
import { fetchProducts } from "../api/get-products";
import type { Product } from "@/features/product/types";

export interface UseProductSearchOptions {
  limit?: number;
  debounceMs?: number;
  enabled?: boolean;
}

export const productSearchQueryKey = (locale: string, query: string) =>
  ["product-search", locale, query.toLowerCase()] as const;

export function useProductSearch(
  query: string,
  options?: UseProductSearchOptions,
) {
  const locale = useLocale();
  const limit = options?.limit ?? 8;
  const debounceMs = options?.debounceMs ?? 250;
  const debouncedQuery = useDebounce(query.trim(), debounceMs);

  const isSearchActive = debouncedQuery.length >= 2 && (options?.enabled ?? true);

  const queryResult = useQuery<Product[]>({
    queryKey: productSearchQueryKey(locale, debouncedQuery),
    queryFn: () =>
      fetchProducts(locale, {
        search: debouncedQuery,
        perPage: limit,
      }),
    enabled: isSearchActive,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });

  const isDebouncing = query.trim() !== debouncedQuery && query.trim().length >= 2;

  return {
    products: isSearchActive ? (queryResult.data ?? []) : [],
    isLoading: isSearchActive && (queryResult.isLoading || isDebouncing),
    isFetching: queryResult.isFetching,
    error: queryResult.error,
    debouncedQuery,
    isSearchActive,
  };
}
