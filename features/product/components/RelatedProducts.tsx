import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/animations";
import { getRelatedProducts } from "../utils/get-related-products";
import { RelatedProductsCarousel } from "./RelatedProductsCarousel";

interface RelatedProductsProps {
  productId: string;
}

export async function RelatedProducts({ productId }: RelatedProductsProps) {
  const t = await getTranslations("ProductDetails.related");
  const products = getRelatedProducts(productId);

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="related-products-heading"
      className="w-full rounded-2xl bg-muted/60 p-5 sm:rounded-3xl sm:p-6 md:p-8"
    >
      <FadeIn direction="up">
        <RelatedProductsCarousel
          title={t("title")}
          subtitle={t("subtitle")}
          products={products}
          previousLabel={t("previous")}
          nextLabel={t("next")}
        />
      </FadeIn>
    </section>
  );
}
