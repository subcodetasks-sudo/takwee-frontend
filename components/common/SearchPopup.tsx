"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  ArrowRight,
  ArrowLeft,
  Search,
  PackageSearch,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/features/product/types";
import { ProductPrice } from "@/features/product/components/ProductPrice";

interface SearchPopupProps {
  query: string;
  debouncedQuery: string;
  products: Product[];
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: () => void;
  isMobile?: boolean;
}

export function SearchPopup({
  query,
  debouncedQuery,
  products,
  isLoading,
  isOpen,
  onClose,
  onSelectProduct,
  isMobile = false,
}: SearchPopupProps) {
  const tNav = useTranslations("Navigation");
  const tProducts = useTranslations("Products");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const popupRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isOpen, onClose]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmedQuery = query.trim();
  const activeSearchQuery = debouncedQuery || trimmedQuery;
  const showMinChars = trimmedQuery.length > 0 && trimmedQuery.length < 2;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const getProductName = (product: Product) => {
    if (product.name?.trim()) return product.name.trim();
    if (tProducts.has(product.nameKey)) return tProducts(product.nameKey);
    return product.slug.replace(/-/g, " ");
  };

  return (
    <div
      ref={popupRef}
      role="region"
      aria-label={tNav("searchResults")}
      className={cn(
        "absolute z-50 mt-2 w-full rounded-2xl border border-border/80 bg-background/98 shadow-2xl backdrop-blur-xl transition-all overflow-hidden",
        "animate-in fade-in-0 zoom-in-95 duration-150",
        isMobile
          ? "start-0 top-full max-h-[calc(100dvh-12rem)]"
          : "start-0 top-full min-w-[380px] max-h-[460px]",
      )}
    >
      {/* Search status / header */}
      <div className="flex items-center justify-between border-b border-border/60 px-3.5 py-2 text-[11px] font-medium text-muted-foreground bg-muted/30">
        <span className="flex items-center gap-1.5">
          {isLoading ? (
            <>
              <Loader2 className="size-3 animate-spin text-primary-600" />
              <span>{tNav("searchLoading")}</span>
            </>
          ) : showMinChars ? (
            <>
              <Search className="size-3 text-muted-foreground" />
              <span>{tNav("searchMinChars")}</span>
            </>
          ) : (
            <>
              <Search className="size-3 text-muted-foreground" />
              <span>{tNav("searchResults")}</span>
            </>
          )}
        </span>

        {!isLoading && !showMinChars && products.length > 0 && (
          <span className="tabular-nums font-semibold text-foreground/80">
            {tNav("searchResultCount", { count: products.length })}
          </span>
        )}
      </div>

      {/* Body Content */}
      <div className="overflow-y-auto max-h-[340px] divide-y divide-border/40 scrollbar-thin">
        {/* Loading skeleton */}
        {isLoading && (
          <div className="p-2 space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 rounded-xl animate-pulse"
              >
                <div className="size-13 rounded-lg bg-muted/80 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-3/4 rounded bg-muted/80" />
                  <div className="h-2.5 w-1/3 rounded bg-muted/60" />
                  <div className="h-3 w-1/4 rounded bg-muted/70" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Min characters helper */}
        {!isLoading && showMinChars && (
          <div className="py-8 px-4 text-center">
            <Search className="mx-auto size-7 text-muted-foreground/60 mb-2" />
            <p className="text-xs font-medium text-muted-foreground">
              {tNav("searchMinChars")}
            </p>
            <p className="text-[11px] text-muted-foreground/70 mt-1">
              {tNav("searchSuggestionNotice")}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !showMinChars && products.length === 0 && (
          <div className="py-8 px-4 text-center">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-muted/60 text-muted-foreground mb-2.5">
              <PackageSearch className="size-5" />
            </div>
            <p className="text-xs font-medium text-foreground">
              {tNav("searchNoResults", { query: activeSearchQuery })}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1 max-w-xs mx-auto">
              {tNav("searchSuggestionNotice")}
            </p>
          </div>
        )}

        {/* Products list */}
        {!isLoading &&
          products.map((product) => {
            const productName = getProductName(product);
            const imageSrc = product.images?.[0] || "";

            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                onClick={() => {
                  onSelectProduct?.();
                  onClose();
                }}
                className="group flex items-center gap-3 p-2.5 hover:bg-muted/60 transition-colors duration-150"
              >
                {/* Thumbnail */}
                <div className="relative size-13 sm:size-14 shrink-0 rounded-lg overflow-hidden bg-muted/80 border border-border/50">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={productName}
                      fill
                      sizes="56px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                      <Search className="size-4" />
                    </div>
                  )}
                </div>

                {/* Product details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors truncate">
                      {productName}
                    </span>
                    {product.badge === "sale" && (
                      <span className="shrink-0 rounded-full bg-error-muted px-1.5 py-0.5 text-[9px] font-bold text-error">
                        {tNav("sale")}
                      </span>
                    )}
                  </div>

                  {product.categoryName && (
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider line-clamp-1 mt-0.5">
                      {product.categoryName}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-1">
                    <ProductPrice
                      amountTRY={product.priceTRY}
                      className="text-xs sm:text-sm font-bold text-foreground"
                    />
                    {product.compareAtPriceTRY &&
                      product.compareAtPriceTRY > product.priceTRY && (
                        <span className="text-[11px] text-muted-foreground line-through tabular-nums">
                          <ProductPrice
                            amountTRY={product.compareAtPriceTRY}
                            className="text-muted-foreground"
                          />
                        </span>
                      )}
                  </div>
                </div>

                {/* Arrow hint on hover */}
                <ArrowIcon className="size-4 text-muted-foreground/50 group-hover:text-primary transition-colors group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 shrink-0 me-1" />
              </Link>
            );
          })}
      </div>

      {/* Footer view all results button */}
      {!isLoading && !showMinChars && products.length > 0 && (
        <div className="border-t border-border/70 p-1.5 bg-muted/20">
          <Link
            href={`/shop?search=${encodeURIComponent(activeSearchQuery)}`}
            onClick={() => {
              onSelectProduct?.();
              onClose();
            }}
            className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl text-xs font-semibold text-primary-800 dark:text-primary-200 hover:bg-primary-50 dark:hover:bg-primary-950/60 transition-colors group"
          >
            <span>
              {tNav("searchViewAll", { count: products.length })}
            </span>
            <ArrowIcon className="size-3.5 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>
      )}
    </div>
  );
}
