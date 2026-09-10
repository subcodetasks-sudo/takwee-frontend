import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import {
  getAllContentPageSlugs,
  getContentPage,
  ContentPageView,
} from "@/features/content";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

/**
 * Boutique content pages under `/(root)/[slug]` (CMS + legacy mock slugs).
 *
 * Source of truth: `getContentPage` → `GET /api/v1/pages/{slug}`, with mock
 * fallback for older storefront slugs. Unknown / missing slugs must call
 * `notFound()` so `./not-found.tsx` renders.
 */

/** Allow slugs beyond `generateStaticParams` (needed when CMS adds pages). */
export const dynamicParams = true;

export function generateStaticParams() {
  return getAllContentPageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  const page = await getContentPage(slug, locale as Locale);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description || undefined,
  };
}

export default async function ContentSlugPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const page = await getContentPage(slug, locale as Locale);

  if (!page) {
    notFound();
  }

  return (
    <main className="flex-1">
      <ContentPageView page={page} locale={locale} />
    </main>
  );
}
