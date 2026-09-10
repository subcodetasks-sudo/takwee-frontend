"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { fetchHomePage } from "../api/get-home-page";
import type { HomePageData } from "../types";
import { joinAdvertisementTapeText } from "../utils/map-home-page";

export const homePageQueryKey = (locale: string) =>
  ["home-page", locale] as const;

const EMPTY_HOME: HomePageData = {
  heroes: [],
  advertisementTapes: [],
  categories: [],
  sections: [],
  products: [],
};

/**
 * Shared home-page query. Header (advertisement tapes) and home sections
 * all read from this cache so the API is hit once per locale session.
 */
export function useHomePage() {
  const locale = useLocale();

  const query = useQuery({
    queryKey: homePageQueryKey(locale),
    queryFn: () => fetchHomePage(locale),
  });

  const data = query.data ?? EMPTY_HOME;

  return {
    ...query,
    data: query.data ?? null,
    heroes: data.heroes,
    categories: data.categories,
    sections: data.sections,
    products: data.products,
    advertisementTapes: data.advertisementTapes,
    announcementText: joinAdvertisementTapeText(data.advertisementTapes),
  };
}
