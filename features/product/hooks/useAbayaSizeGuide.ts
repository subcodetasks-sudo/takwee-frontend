"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { fetchAbayaSizeGuide } from "../api/get-abaya-size-guide";
import type { ApiAbayaSizeGuide } from "../types";

export const abayaSizeGuideQueryKey = (locale: string) =>
  ["abaya-size-guide", locale] as const;

export function useAbayaSizeGuide(initialData?: ApiAbayaSizeGuide) {
  const locale = useLocale();

  return useQuery({
    queryKey: abayaSizeGuideQueryKey(locale || "ar"),
    queryFn: () => fetchAbayaSizeGuide(locale || "ar"),
    initialData,
    staleTime: 1000 * 60 * 10,
  });
}
