"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { fetchCities } from "../api/get-cities";

export const citiesQueryKey = (locale: string, countryId: number) =>
  ["shipping-cities", locale, countryId] as const;

export function useCities(countryId?: number) {
  const locale = useLocale();
  const enabled = typeof countryId === "number" && countryId > 0;

  const query = useQuery({
    queryKey: citiesQueryKey(locale, countryId ?? 0),
    queryFn: () => fetchCities(countryId as number, locale),
    enabled,
  });

  return {
    ...query,
    cities: query.data ?? [],
  };
}
