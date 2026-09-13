import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ShopView } from "@/features/shop";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ShopPage.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ShopPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const search =
    typeof resolvedSearchParams?.search === "string"
      ? resolvedSearchParams.search
      : typeof resolvedSearchParams?.q === "string"
        ? resolvedSearchParams.q
        : undefined;

  setRequestLocale(locale);

  return (
    <main className="flex flex-1 flex-col">
      <ShopView searchQuery={search} />
    </main>
  );
}
