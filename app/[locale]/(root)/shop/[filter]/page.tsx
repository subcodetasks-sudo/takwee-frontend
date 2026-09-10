import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SHOP_FILTERS, isShopFilter } from "@/features/product";
import { getCategories } from "@/features/categories/utils/get-categories";
import { ShopView } from "@/features/shop";
import { resolveShopPath } from "@/features/shop/utils/resolve-shop-path";

type Props = {
  params: Promise<{ locale: string; filter: string }>;
};

export async function generateStaticParams() {
  try {
    const categories = await getCategories("en");
    const categorySlugs = categories.map((category) => category.slug);
    const filters = new Set<string>([...SHOP_FILTERS, ...categorySlugs]);
    return [...filters].map((filter) => ({ filter }));
  } catch {
    return SHOP_FILTERS.map((filter) => ({ filter }));
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, filter } = await params;
  const categories = await getCategories(locale);
  const resolved = resolveShopPath(filter, categories);

  if (!resolved || resolved.kind === "all") return {};

  const tMeta = await getTranslations({ locale, namespace: "ShopPage.meta" });

  if (resolved.kind === "category") {
    return {
      title: resolved.category.name,
      description: tMeta("description"),
    };
  }

  const tFilter = await getTranslations({
    locale,
    namespace: "ShopPage.filters",
  });

  return {
    title: tFilter(`${resolved.filter}.title`),
    description: tFilter(`${resolved.filter}.subtitle`) || tMeta("description"),
  };
}

export default async function ShopFilterPage({ params }: Props) {
  const { locale, filter } = await params;
  setRequestLocale(locale);

  const categories = await getCategories(locale);
  const resolved = resolveShopPath(filter, categories);

  if (!resolved || resolved.kind === "all") {
    notFound();
  }

  // Promo filters that are not API categories still need to be known shop filters.
  if (resolved.kind === "promo" && !isShopFilter(filter)) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col">
      <ShopView pathFilter={filter} />
    </main>
  );
}
