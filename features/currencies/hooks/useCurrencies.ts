"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { fetchCurrencies } from "../api/get-currencies";
import type { Currency } from "../types";

export const currenciesQueryKey = (locale?: string) =>
  locale ? (["currencies", locale] as const) : (["currencies"] as const);

export function useCurrencies(initialData?: Currency[]) {
  const locale = useLocale();
  const query = useQuery({
    queryKey: currenciesQueryKey(locale),
    queryFn: () => fetchCurrencies(locale),
    initialData:
      initialData && initialData.length > 0 ? initialData : undefined,
  });

  return {
    ...query,
    currencies: query.data ?? initialData ?? [],
  };
}
