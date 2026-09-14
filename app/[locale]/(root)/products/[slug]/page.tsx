import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProductDetailsView } from "@/features/product";
import { getProductPageBySlug } from "@/features/product/utils/get-product-page";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const page = await getProductPageBySlug(slug, locale);
    if (!page) return {};

    const { product } = page;
    const tProducts = await getTranslations({ locale, namespace: "Products" });
    const tDetails = await getTranslations({
      locale,
      namespace: "ProductDetails",
    });

    const name = product.name ?? tProducts(product.nameKey);
    const rawDescription = product.description?.trim();
    const description = rawDescription
      ? stripHtml(rawDescription)
      : (product.specs.length > 0
          ? tDetails(`products.${product.nameKey}.description`)
          : name);

    return {
      title: name,
      description,
    };
  } catch {
    return {};
  }
}

export default async function ProductDetailsPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex-1">
      <ProductDetailsView slug={slug} />
    </main>
  );
}

