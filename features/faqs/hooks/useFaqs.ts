"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { fetchFaqById, fetchFaqs } from "../api/get-faqs";
import type { FaqItem } from "../types";

export function useFaqs(initialData?: FaqItem[]) {
  const locale = useLocale();

  const query = useQuery({
    queryKey: ["faqs", locale],
    queryFn: () => fetchFaqs(locale),
    initialData,
    staleTime: 5 * 60 * 1000,
  });

  return {
    faqs: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useFaq(id: number | string, initialData?: FaqItem | null) {
  const locale = useLocale();

  const query = useQuery({
    queryKey: ["faq", id, locale],
    queryFn: () => fetchFaqById(id, locale),
    initialData,
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });

  return {
    faq: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
