"use client";

import { useMemo } from "react";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useProducts } from "../hooks/useProducts";
import { resolveShopPath } from "../utils/resolve-shop-path";
import { applyShopPathFilter } from "../utils/filter-products";
import { getPriceBounds } from "../utils/price-bounds";
import { ShopCatalog } from "./ShopCatalog";
import { ShopHero } from "./ShopHero";
import { ShopLoadingSkeleton } from "./ShopLoadingSkeleton";

interface ShopViewClientProps {
  /** `/shop/[filter]` segment — category slug or legacy promo filter. */
  pathFilter?: string;
  /** Optional search query from URL searchParams (`/shop?search=...`). */
  searchQuery?: string;
}

export function ShopViewClient({
  pathFilter,
  searchQuery,
}: ShopViewClientProps) {
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { allProducts, isLoading: isProductsLoading } = useProducts({
    search: searchQuery,
  });

  const resolved = useMemo(
    () => resolveShopPath(pathFilter, categories),
    [pathFilter, categories],
  );

  const category = resolved?.kind === "category" ? resolved.category : null;

  const products = useMemo(() => {
    if (!resolved || resolved.kind === "all") {
      return allProducts;
    }
    if (resolved.kind === "category") {
      return allProducts.filter(
        (product) => product.categoryId === resolved.category.id,
      );
    }
    return applyShopPathFilter(allProducts, resolved.filter);
  }, [allProducts, resolved]);

  const bounds = useMemo(() => getPriceBounds(products), [products]);

  const isLoading =
    (isProductsLoading || isCategoriesLoading) && allProducts.length === 0;

  return (
    <>
      <ShopHero
        pathFilter={pathFilter}
        category={category}
        searchQuery={searchQuery}
      />
      {isLoading ? (
        <ShopLoadingSkeleton />
      ) : (
        <ShopCatalog
          products={products}
          bounds={bounds}
          searchQuery={searchQuery}
        />
      )}
    </>
  );
}
