"use client";

import { useTranslations } from "next-intl";
import { Check, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductPrice } from "./ProductPrice";
import { useProductDetails } from "../context/ProductDetailsContext";
import type { Product } from "../types";

interface ProductStickyBottomBarProps {
  product?: Product;
}

export function ProductStickyBottomBar({
  product: propProduct,
}: ProductStickyBottomBarProps) {
  const context = useProductDetails();
  const product = context?.product ?? propProduct;
  const t = useTranslations("ProductDetails");
  const tGuide = useTranslations("ProductDetails.sizeGuide");

  if (!product) return null;

  const quantity = context?.quantity ?? 1;
  const setQuantity = context?.setQuantity;
  const isAdded = context?.isAdded ?? false;
  const selectedSize = context?.selectedSize;
  const handleAddToCart = context?.handleAddToCart;

  const isOnSale =
    product.badge === "sale" ||
    (product.compareAtPriceTRY != null &&
      product.compareAtPriceTRY > product.priceTRY);

  const handleSizeClick = () => {
    const el = document.getElementById("size-selector");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-primary", "rounded-xl", "p-2", "transition-all");
      setTimeout(() => {
        el.classList.remove("ring-2", "ring-primary", "rounded-xl", "p-2");
      }, 1800);
    }
  };

  return (
    <aside
      aria-label={t("addToCart")}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 block md:hidden",
        "border-t border-border/80 bg-background/95 backdrop-blur-md",
        "shadow-[0_-4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)]",
        "px-3.5 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]",
        "transition-transform duration-300 ease-out",
      )}
    >
      <div className="mx-auto flex max-w-lg items-center justify-between gap-2.5 sm:gap-3">
        {/* Price & Size / Stock Info */}
        <div className="flex min-w-0 flex-col justify-center">
          <div className="flex items-baseline gap-1.5 truncate">
            <ProductPrice
              amountTRY={product.priceTRY}
              className="text-base font-bold tracking-tight text-foreground sm:text-lg"
              iconClassName="size-4 stroke-[2.2]"
            />
            {product.compareAtPriceTRY != null && isOnSale ? (
              <ProductPrice
                amountTRY={product.compareAtPriceTRY}
                className="text-xs text-muted-foreground line-through decoration-muted-foreground/60 tabular-nums"
              />
            ) : null}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            {product.inStock ? (
              selectedSize ? (
                <button
                  type="button"
                  onClick={handleSizeClick}
                  className="truncate font-medium text-foreground hover:text-primary transition-colors text-start"
                >
                  {tGuide("size")}: <span className="font-bold">{selectedSize}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSizeClick}
                  className="truncate text-primary underline underline-offset-2 text-start"
                >
                  {t("selectSize")}
                </button>
              )
            ) : (
              <span className="font-semibold text-error">
                {t("outOfStock")}
              </span>
            )}
          </div>
        </div>

        {/* Stepper + Add To Cart CTA */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Stepper */}
          <div className="inline-flex items-center rounded-lg border border-border/80 bg-card shadow-2xs">
            <button
              type="button"
              aria-label={t("decreaseQuantity")}
              disabled={!product.inStock || quantity <= 1}
              onClick={() => setQuantity?.((q) => Math.max(1, q - 1))}
              className="flex size-8 sm:size-9 items-center justify-center rounded-s-lg text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-30"
            >
              <Minus className="size-3.5" />
            </button>
            <span
              className="min-w-6 sm:min-w-7 text-center text-xs font-bold tabular-nums text-foreground"
              aria-live="polite"
            >
              {quantity}
            </span>
            <button
              type="button"
              aria-label={t("increaseQuantity")}
              disabled={!product.inStock}
              onClick={() => setQuantity?.((q) => Math.min(10, q + 1))}
              className="flex size-8 sm:size-9 items-center justify-center rounded-e-lg text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-30"
            >
              <Plus className="size-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <Button
            type="button"
            size="sm"
            disabled={!product.inStock}
            onClick={handleAddToCart}
            className={cn(
              "h-9 sm:h-10 min-w-28 sm:min-w-32 rounded-xl px-3 sm:px-4 text-xs font-semibold shadow-xs transition-all",
              isAdded &&
                "bg-success text-success-foreground hover:bg-success/90",
            )}
          >
            {isAdded ? (
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-3.5" />
                {t("addedToCart")}
              </span>
            ) : !product.inStock ? (
              t("outOfStock")
            ) : (
              t("addToCart")
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
