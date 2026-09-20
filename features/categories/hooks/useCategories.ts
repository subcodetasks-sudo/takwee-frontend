"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { fetchCategories } from "../api/get-categories";

export const categoriesQueryKey = (locale: string) =>
  ["categories", locale] as const;

/**
 * Shared categories query for header + footer chrome.
 * One request per locale session via React Query.
 */
export function useCategories() {
  const locale = useLocale();

  const query = useQuery({
    queryKey: categoriesQueryKey(locale),
    queryFn: () => fetchCategories(locale),
  });

  return {
    ...query,
    categories: Array.isArray(query.data) ? query.data : [],
  };
}
