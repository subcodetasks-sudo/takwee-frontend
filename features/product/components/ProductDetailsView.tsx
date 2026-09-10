import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { Product, ProductReview } from "../types";
import { ProductDetailsHero } from "./ProductDetailsHero";
import { ProductDetailsTabs } from "./ProductDetailsTabs";
import { RelatedProducts } from "./RelatedProducts";
import { ProductStickyBottomBar } from "./ProductStickyBottomBar";
import { ProductDetailsProvider } from "../context/ProductDetailsContext";

interface ProductDetailsViewProps {
  product: Product;
  reviews?: ProductReview[];
}

export async function ProductDetailsView({
  product,
  reviews = [],
}: ProductDetailsViewProps) {
  const tProducts = await getTranslations("Products");
  const tDetails = await getTranslations("ProductDetails");
  const productName = product.name ?? tProducts(product.nameKey);

  return (
    <ProductDetailsProvider product={product} productName={productName}>
      <article className="page-shell flex w-full flex-col gap-6 py-6 pb-24 sm:gap-8 sm:py-8 sm:pb-28 md:py-10 md:pb-12">
        <nav aria-label="Breadcrumb" className="-mb-1">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft
              className="size-3.5 rtl:rotate-180 transition-transform duration-200 group-hover:-translate-x-1 rtl:group-hover:translate-x-1"
              aria-hidden
            />
            <span>{tDetails("backToShop")}</span>
          </Link>
        </nav>
        <ProductDetailsHero product={product} productName={productName} />
        <ProductDetailsTabs product={product} reviews={reviews} />
        <RelatedProducts productId={product.id} />
      </article>

      {/* Fixed bottom bar for small mobile screens */}
      <ProductStickyBottomBar />
    </ProductDetailsProvider>
  );
}
