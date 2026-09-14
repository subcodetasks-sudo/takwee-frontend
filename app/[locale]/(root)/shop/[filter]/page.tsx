import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SHOP_FILTERS } from "@/features/product";
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
  try {
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
  } catch {
    return {};
  }
}

export default async function ShopFilterPage({ params }: Props) {
  const { locale, filter } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex flex-1 flex-col">
      <ShopView pathFilter={filter} />
    </main>
  );
}
