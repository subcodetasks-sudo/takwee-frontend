import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isShopFilter, SHOP_FILTERS } from "@/features/product";
import { ShopView } from "@/features/shop";

type Props = {
  params: Promise<{ locale: string; filter: string }>;
};

export function generateStaticParams() {
  return SHOP_FILTERS.map((filter) => ({ filter }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, filter } = await params;
  if (!isShopFilter(filter)) return {};

  const tMeta = await getTranslations({ locale, namespace: "ShopPage.meta" });
  const tFilter = await getTranslations({
    locale,
    namespace: "ShopPage.filters",
  });

  return {
    title: tFilter(`${filter}.title`),
    description: tFilter(`${filter}.subtitle`) || tMeta("description"),
  };
}

export default async function ShopFilterPage({ params }: Props) {
  const { locale, filter } = await params;
  setRequestLocale(locale);

  if (!isShopFilter(filter)) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col">
      <ShopView pathFilter={filter} />
    </main>
  );
}
