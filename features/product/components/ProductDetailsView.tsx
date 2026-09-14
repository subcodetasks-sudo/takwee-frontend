import { getLocale } from "next-intl/server";
import { getProductPageBySlug } from "../utils/get-product-page";
import { ProductDetailsContent } from "./ProductDetailsContent";

export interface ProductDetailsViewProps {
  /** SEO slug or numeric id. */
  slug: string;
}

/**
 * Server Component shell for the PDP — suitable for JSON-LD / Product schema.
 * Interactive UI lives in {@link ProductDetailsContent}.
 */
export async function ProductDetailsView({ slug }: ProductDetailsViewProps) {
  const locale = await getLocale();
  const page = await getProductPageBySlug(slug, locale).catch(() => null);

  return (
    <>
      {/* JSON-LD (Product) can be injected here using `page?.product`. */}
      <ProductDetailsContent
        slug={slug}
        product={page?.product}
        reviews={page?.reviews}
      />
    </>
  );
}
