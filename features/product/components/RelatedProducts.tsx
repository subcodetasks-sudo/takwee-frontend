"use client";

import { useTranslations } from "next-intl";
import { useProducts } from "@/features/shop/hooks/useProducts";
import { RelatedProductsCarousel } from "./RelatedProductsCarousel";

interface RelatedProductsProps {
  productId: string;
  categoryId?: string;
}

export function RelatedProducts({ productId, categoryId }: RelatedProductsProps) {
  const t = useTranslations("ProductDetails.related");
  const { allProducts } = useProducts();

  // Show products in the same category first, followed by other catalog products
  const sameCategory = categoryId
    ? allProducts.filter((p) => p.id !== productId && p.categoryId === categoryId)
    : [];
  const otherProducts = allProducts.filter(
    (p) => p.id !== productId && (!categoryId || p.categoryId !== categoryId),
  );
  const products = [...sameCategory, ...otherProducts].slice(0, 8);

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="related-products-heading"
      className="w-full rounded-2xl bg-muted/60 p-5 sm:rounded-3xl sm:p-6 md:p-8"
    >
      <RelatedProductsCarousel
        title={t("title")}
        subtitle={t("subtitle")}
        products={products}
        previousLabel={t("previous")}
        nextLabel={t("next")}
      />
    </section>
  );
}
