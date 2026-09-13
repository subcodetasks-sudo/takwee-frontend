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
import { Link } from "@/i18n/routing";
import { Search, X } from "lucide-react";
import { ShopToolbar } from "./ShopToolbar";

interface ShopCatalogProps {
  products: Product[];
  bounds: ShopPriceBounds;
  searchQuery?: string;
}

export function ShopCatalog({
  products,
  bounds,
  searchQuery,
}: ShopCatalogProps) {
  const t = useTranslations("ShopPage");
  const tNav = useTranslations("Navigation");

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
        {searchQuery && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-primary-200/60 bg-primary-50/50 p-3 text-sm dark:border-primary-800/40 dark:bg-primary-950/30">
            <div className="flex items-center gap-2 text-foreground min-w-0">
              <Search className="size-4 shrink-0 text-primary-700 dark:text-primary-300" />
              <span className="truncate">
                {tNav("searchResults")}:{" "}
                <strong className="font-semibold">&quot;{searchQuery}&quot;</strong>
              </span>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1 shrink-0 text-xs font-semibold text-primary-700 hover:text-primary-900 dark:text-primary-300 dark:hover:text-primary-100 hover:underline"
            >
              <X className="size-3.5" />
              <span>{tNav("searchClear")}</span>
            </Link>
          </div>
        )}

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
