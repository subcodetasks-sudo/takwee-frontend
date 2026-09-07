import type { ShopFilter } from "@/features/product/utils/shop-filters";
import { getPriceBounds } from "../utils/price-bounds";
import { getShopProducts } from "../utils/get-shop-products";
import { ShopCatalog } from "./ShopCatalog";
import { ShopHero } from "./ShopHero";

interface ShopViewProps {
  pathFilter?: ShopFilter;
}

export async function ShopView({ pathFilter }: ShopViewProps) {
  const products = getShopProducts(pathFilter);
  const bounds = getPriceBounds(products);

  return (
    <>
      <ShopHero pathFilter={pathFilter} />
      <ShopCatalog products={products} bounds={bounds} />
    </>
  );
}
