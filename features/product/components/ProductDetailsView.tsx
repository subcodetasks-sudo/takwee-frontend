import { getTranslations } from "next-intl/server";
import type { Product } from "../types";
import { ProductDetailsHero } from "./ProductDetailsHero";
import { ProductDetailsTabs } from "./ProductDetailsTabs";
import { RelatedProducts } from "./RelatedProducts";
import { ProductStickyBottomBar } from "./ProductStickyBottomBar";
import { ProductDetailsProvider } from "../context/ProductDetailsContext";

interface ProductDetailsViewProps {
  product: Product;
}

export async function ProductDetailsView({ product }: ProductDetailsViewProps) {
  const tProducts = await getTranslations("Products");
  const productName = tProducts(product.nameKey);

  return (
    <ProductDetailsProvider product={product} productName={productName}>
      <article className="page-shell flex w-full flex-col gap-10 py-8 pb-24 sm:gap-12 sm:py-10 sm:pb-28 md:py-12 md:pb-12">
        <ProductDetailsHero product={product} productName={productName} />
        <ProductDetailsTabs product={product} />
        <RelatedProducts productId={product.id} />
      </article>

      {/* Fixed bottom bar for small mobile screens */}
      <ProductStickyBottomBar />
    </ProductDetailsProvider>
  );
}
