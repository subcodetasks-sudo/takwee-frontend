"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { Product } from "@/features/product/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { ShopFilterState, ShopPriceBounds, ShopSort } from "../types";
import {
  countActiveFilters,
  createDefaultFilterState,
  filterAndSortProducts,
  getBadgeOptions,
  getCategoryOptions,
  getColorOptions,
  getSizeOptions,
} from "../utils/filter-products";
import { ShopFilterPanel } from "./ShopFilterPanel";
import { ShopMobileFilterBar } from "./ShopMobileFilterBar";
import { ShopProductGrid } from "./ShopProductGrid";
import { ShopToolbar } from "./ShopToolbar";

interface ShopCatalogProps {
  products: Product[];
  bounds: ShopPriceBounds;
}

export function ShopCatalog({ products, bounds }: ShopCatalogProps) {
  const t = useTranslations("ShopPage");

  const [filters, setFilters] = useState<ShopFilterState>(() =>
    createDefaultFilterState(bounds),
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setFilters(createDefaultFilterState(bounds));
    });
  }, [bounds.min, bounds.max, products]);

  const categoryOptions = useMemo(
    () => getCategoryOptions(products),
    [products],
  );

  const sizeOptions = useMemo(
    () => getSizeOptions(products),
    [products],
  );

  const colorOptions = useMemo(
    () => getColorOptions(products),
    [products],
  );

  const badgeOptions = useMemo(
    () => getBadgeOptions(products),
    [products],
  );

  const filteredProducts = useMemo(
    () => filterAndSortProducts(products, filters),
    [products, filters],
  );

  const activeFilterCount = countActiveFilters(filters, bounds);

  const handleFiltersChange = (
    next: ShopFilterState | ((prev: ShopFilterState) => ShopFilterState),
  ) => {
    startTransition(() => {
      setFilters(next);
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      setFilters(createDefaultFilterState(bounds));
    });
  };

  const handleSortChange = (sort: ShopSort) => {
    startTransition(() => {
      setFilters((prev) => ({ ...prev, sort }));
    });
  };

  return (
    <section
      aria-label={t("catalog.ariaLabel")}
      className="page-shell grid gap-8 py-10 pb-28 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10 lg:py-14 lg:pb-14"
    >
      <div className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-border bg-card/60 p-4">
          <ShopFilterPanel
            filters={filters}
            bounds={bounds}
            categories={categoryOptions}
            sizes={sizeOptions}
            colors={colorOptions}
            badges={badgeOptions}
            resultCount={filteredProducts.length}
            onChange={handleFiltersChange}
            onClear={clearFilters}
            idPrefix="shop-desktop"
          />
        </div>
      </div>

      <div className="space-y-6">
        <ShopToolbar
          resultCount={filteredProducts.length}
          activeFilterCount={activeFilterCount}
          sort={filters.sort}
          onSortChange={handleSortChange}
          onClearFilters={clearFilters}
        />

        <ShopProductGrid products={filteredProducts} />
      </div>

      <ShopMobileFilterBar
        activeFilterCount={activeFilterCount}
        sort={filters.sort}
        onSortChange={handleSortChange}
        onOpenFilters={() => setMobileOpen((open) => !open)}
        onClearFilters={clearFilters}
      />

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="z-50 gap-0 overflow-hidden rounded-t-2xl border-border p-0 lg:hidden data-[side=bottom]:bottom-[4.75rem] data-[side=bottom]:max-h-[calc(100dvh-5.25rem)]"
        >
          <SheetHeader className="shrink-0 border-b border-border p-4 text-start">
            <SheetTitle>{t("panel.title")}</SheetTitle>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 pb-6">
            <ShopFilterPanel
              filters={filters}
              bounds={bounds}
              categories={categoryOptions}
              sizes={sizeOptions}
              colors={colorOptions}
              badges={badgeOptions}
              resultCount={filteredProducts.length}
              onChange={setFilters}
              onClear={clearFilters}
              showApply
              onApply={() => setMobileOpen(false)}
              idPrefix="shop-mobile"
            />
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
