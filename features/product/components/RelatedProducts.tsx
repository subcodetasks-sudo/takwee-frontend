"use client";

import { useTranslations } from "next-intl";
import { useProducts } from "@/features/shop/hooks/useProducts";
import { RelatedProductsCarousel } from "./RelatedProductsCarousel";

import { ProductCardSkeleton } from "./ProductCardSkeleton";

interface RelatedProductsProps {
  productId: string;
  categoryId?: string;
}

export function RelatedProducts({ productId, categoryId }: RelatedProductsProps) {
  const t = useTranslations("ProductDetails.related");
  const { allProducts, isLoading } = useProducts();

  if (isLoading && allProducts.length === 0) {
    return (
      <section
        aria-busy="true"
        className="w-full rounded-2xl bg-muted/40 p-5 sm:rounded-3xl sm:p-6 md:p-8"
      >
        <div className="mb-6 space-y-2">
          <div className="h-6 w-40 rounded bg-muted animate-pulse" />
          <div className="h-4 w-60 rounded bg-muted/70 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

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
