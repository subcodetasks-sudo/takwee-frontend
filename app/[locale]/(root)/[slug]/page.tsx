import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import {
  getAllContentPageSlugs,
  getContentPage,
  isContentPageSlug,
  ContentPageView,
} from "@/features/content";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

/**
 * Boutique content pages under `/(root)/[slug]` (terms, privacy, FAQ, …).
 *
 * This dynamic segment also catches unknown top-level paths that are not
 * `shop`, `products`, `me`, etc. Those must 404 via `notFound()` so
 * `./not-found.tsx` (and `(root)/not-found.tsx`) render — do not render an
 * empty shell or throw a generic error.
 *
 * --- Future CMS / API wiring ---
 * 1. `getContentPage(slug, locale)` should return `null` on HTTP 404,
 *    unpublished, or missing payload (see that module’s comments).
 * 2. Always call `notFound()` when the fetch returns `null` — that is how
 *    this route becomes a proper 404 page.
 * 3. Prefer the API as source of truth: relax or remove `isContentPageSlug`
 *    once the CMS can expose arbitrary published slugs.
 * 4. Keep `dynamicParams` enabled (default) so new CMS slugs work without a
 *    full redeploy; only missing/unpublished records should 404.
 * 5. Never wrap `notFound()` in try/catch — it must propagate to the
 *    not-found boundary. Use `unstable_rethrow` if you catch nearby errors.
 */

/** Allow slugs beyond `generateStaticParams` (needed when CMS adds pages). */
export const dynamicParams = true;

export function generateStaticParams() {
  return getAllContentPageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  // Unknown / missing content → noindex-friendly empty metadata; page calls notFound().
  if (!isContentPageSlug(slug)) return {};

  const page = await getContentPage(slug, locale as Locale);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
  };
}

export default async function ContentSlugPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // Mock-era allowlist. When the API is wired, you may drop this check and
  // rely solely on `getContentPage(...) === null` → `notFound()` below.
  if (!isContentPageSlug(slug)) {
    notFound();
  }

  const page = await getContentPage(slug, locale as Locale);

  // Future API: null means 404 / unpublished — renders `[slug]/not-found.tsx`.
  if (!page) {
    notFound();
  }

  return (
    <main className="flex-1">
      <ContentPageView page={page} locale={locale} />
    </main>
  );
}
