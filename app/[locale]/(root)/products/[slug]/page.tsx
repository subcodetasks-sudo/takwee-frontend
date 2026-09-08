import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProductDetailsView } from "@/features/product";
import {
  getAllProductSlugs,
  getProductBySlug,
} from "@/features/product/utils/get-product";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  const tProducts = await getTranslations({ locale, namespace: "Products" });
  const tDetails = await getTranslations({
    locale,
    namespace: "ProductDetails",
  });
  const name = tProducts(product.nameKey);
  const description = tDetails(`products.${product.nameKey}.description`);

  return {
    title: name,
    description,
  };
}

export default async function ProductDetailsPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  return (
    <main className="flex-1">
      <ProductDetailsView product={product} />
    </main>
  );
}
