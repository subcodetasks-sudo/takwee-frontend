"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { fetchPages } from "../api/get-pages";
import { groupPageLinks } from "../utils/map-pages";

export const pagesQueryKey = (locale: string) => ["content-pages", locale] as const;

/**
 * Shared CMS pages query for footer columns (and future chrome).
 * One request per locale session via React Query.
 */
export function usePages() {
  const locale = useLocale();

  const query = useQuery({
    queryKey: pagesQueryKey(locale),
    queryFn: () => fetchPages(locale),
  });

  const pages = query.data ?? [];
  const groups = groupPageLinks(pages);

  return {
    ...query,
    pages,
    aboutPages: groups.about,
    supportPages: groups.support,
    legalPages: groups.legal,
    otherPages: groups.other,
  };
}
