import { ApiError } from "@/lib/api-client";
import type { Locale } from "@/i18n/routing";
import type { ContentPage } from "../types";
import { fetchPageBySlug } from "./get-pages";
import { mapApiPageToContentPage } from "../utils/map-pages";
import { getMockContentPage } from "../utils/mock-content";

/**
 * Fetches a boutique content page by slug + locale.
 *
 * Preference order:
 * 1. Live `GET /api/v1/pages/{slug}` (localized via Accept-Language)
 * 2. Legacy mock catalog for old storefront slugs (bookmarks / SEO)
 *
 * Returns `null` when neither source has the page — the route MUST call
 * `notFound()` so `[slug]/not-found` renders.
 */
export async function getContentPage(
  slug: string,
  locale: Locale,
): Promise<ContentPage | null> {
  try {
    const apiPage = await fetchPageBySlug(slug, locale);
    if (apiPage) {
      return mapApiPageToContentPage(apiPage);
    }
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      // fall through to mock
    } else if (error instanceof ApiError) {
      console.error(
        `[getContentPage] ${error.status} ${error.statusText}`,
        error.data,
      );
      // Soft-fail to mock for transient API errors on known mock slugs.
    } else {
      console.error("[getContentPage] request failed", error);
    }
  }

  return getMockContentPage(slug, locale);
}
