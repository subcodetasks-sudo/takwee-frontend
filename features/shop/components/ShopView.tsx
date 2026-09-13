import { getLocale } from "next-intl/server";
import { getPriceBounds } from "../utils/price-bounds";
import { getShopProducts } from "../utils/get-shop-products";
import { ShopCatalog } from "./ShopCatalog";
import { ShopHero } from "./ShopHero";

interface ShopViewProps {
  /** `/shop/[filter]` segment — category slug or legacy promo filter. */
  pathFilter?: string;
  /** Optional search query from URL searchParams (`/shop?search=...`). */
  searchQuery?: string;
}

export async function ShopView({ pathFilter, searchQuery }: ShopViewProps) {
  const locale = await getLocale();
  const { products, category } = await getShopProducts(
    pathFilter,
    locale,
    searchQuery,
  );
  const bounds = getPriceBounds(products);

  return (
    <>
      <ShopHero
        pathFilter={pathFilter}
        category={category}
        searchQuery={searchQuery}
      />
      <ShopCatalog
        products={products}
        bounds={bounds}
        searchQuery={searchQuery}
      />
    </>
  );
}
