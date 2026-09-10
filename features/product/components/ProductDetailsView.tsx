"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { Product, ProductReview } from "../types";
import { useProduct } from "../hooks/useProduct";
import { ProductDetailsHero } from "./ProductDetailsHero";
import { ProductDetailsTabs } from "./ProductDetailsTabs";
import { RelatedProducts } from "./RelatedProducts";
import { ProductStickyBottomBar } from "./ProductStickyBottomBar";
import { ProductDetailsProvider } from "../context/ProductDetailsContext";

export interface ProductDetailsViewProps {
  product: Product;
  reviews?: ProductReview[];
}

export function ProductDetailsView({
  product: initialProduct,
  reviews: initialReviews = [],
}: ProductDetailsViewProps) {
  const { product = initialProduct, reviews = initialReviews } = useProduct(
    initialProduct?.id,
    { product: initialProduct, reviews: initialReviews },
  );

  const tProducts = useTranslations("Products");
  const tDetails = useTranslations("ProductDetails");
  const productName =
    product.name?.trim() ||
    (tProducts.has(product.nameKey)
      ? tProducts(product.nameKey)
      : product.nameKey);

  return (
    <ProductDetailsProvider product={product} productName={productName}>
      <article className="page-shell flex w-full flex-col gap-6 py-6 pb-24 sm:gap-8 sm:py-8 sm:pb-28 md:py-10 md:pb-12">
        <nav
          aria-label="Breadcrumb"
          className="-mb-1 flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link
            href="/shop"
            className="group inline-flex items-center gap-1.5 font-medium hover:text-foreground transition-colors"
          >
            <ArrowLeft
              className="size-3.5 rtl:rotate-180 transition-transform duration-200 group-hover:-translate-x-1 rtl:group-hover:translate-x-1"
              aria-hidden
            />
            <span>{tDetails("backToShop")}</span>
          </Link>
          {product.categoryName ? (
            <>
              <span className="text-muted-foreground/40">/</span>
              <span className="font-medium text-muted-foreground">
                {product.categoryName}
              </span>
            </>
          ) : null}
          <span className="text-muted-foreground/40">/</span>
          <span className="truncate font-medium text-foreground">
            {productName}
          </span>
        </nav>
        <ProductDetailsHero product={product} productName={productName} />
        <ProductDetailsTabs product={product} reviews={reviews} />
        <RelatedProducts
          productId={product.id}
          categoryId={product.categoryId}
        />
      </article>

      {/* Fixed bottom bar for small mobile screens */}
      <ProductStickyBottomBar />
    </ProductDetailsProvider>
  );
}
