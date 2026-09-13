"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { fetchCountries } from "../api/get-countries";

export const countriesQueryKey = (locale: string) =>
  ["shipping-countries", locale] as const;

export function useCountries() {
  const locale = useLocale();
  const query = useQuery({
    queryKey: countriesQueryKey(locale),
    queryFn: () => fetchCountries(locale),
  });

  return {
    ...query,
    countries: query.data ?? [],
  };
}
