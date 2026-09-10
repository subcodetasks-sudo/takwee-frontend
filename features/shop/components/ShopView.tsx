import { getLocale } from "next-intl/server";
import { getPriceBounds } from "../utils/price-bounds";
import { getShopProducts } from "../utils/get-shop-products";
import { ShopCatalog } from "./ShopCatalog";
import { ShopHero } from "./ShopHero";

interface ShopViewProps {
  /** `/shop/[filter]` segment — category slug or legacy promo filter. */
  pathFilter?: string;
}

export async function ShopView({ pathFilter }: ShopViewProps) {
  const locale = await getLocale();
  const { products, category } = await getShopProducts(pathFilter, locale);
  const bounds = getPriceBounds(products);

  return (
    <>
      <ShopHero pathFilter={pathFilter} category={category} />
      <ShopCatalog products={products} bounds={bounds} />
    </>
  );
}
