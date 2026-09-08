import type { Locale } from "@/i18n/routing";
import type { ContentPage } from "../types";
import { getMockContentPage } from "../utils/mock-content";

/**
 * Fetches a boutique content page by slug + locale.
 *
 * Returns `null` when the page does not exist. The route
 * `app/[locale]/(root)/[slug]/page.tsx` MUST call `notFound()` on null so
 * the `[slug]/not-found` (and `(root)/not-found`) UI is shown — including
 * for random URLs caught by the dynamic `[slug]` segment.
 *
 * Today this returns mock data. When wiring the CMS/API:
 *
 * ```ts
 * const res = await fetch(
 *   `${process.env.CONTENT_API_URL}/pages/${slug}?locale=${locale}`,
 *   { next: { tags: [`content:${slug}`, `content:${slug}:${locale}`], revalidate: 3600 } },
 * );
 *
 * // Important: treat 404 (and optionally 404-like empty bodies) as null.
 * // Do NOT throw for "not found" — let the page call notFound() instead.
 * if (res.status === 404) return null;
 * if (!res.ok) throw new Error(`Content API error ${res.status}`); // real failures → error.js
 *
 * const data = (await res.json()) as ContentPage | null;
 * return data ?? null;
 * ```
 */
export async function getContentPage(
  slug: string,
  locale: Locale,
): Promise<ContentPage | null> {
  return getMockContentPage(slug, locale);
}
