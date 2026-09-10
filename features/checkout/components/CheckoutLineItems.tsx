"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ProductPrice } from "@/features/product";
import { PRODUCT_SWATCH_CLASSES } from "@/features/product/types";
import type { CartItem } from "@/features/cart/types";
import { cn } from "@/lib/utils";

interface CheckoutLineItemsProps {
  items: CartItem[];
}

export function CheckoutLineItems({ items }: CheckoutLineItemsProps) {
  const tProducts = useTranslations("Products");
  const tColors = useTranslations("ProductCard.colors");
  const tSummary = useTranslations("CheckoutPage.summary");

  return (
    <ul className="space-y-2 sm:space-y-3">
      {items.map((item) => {
        const selectedColor =
          item.product.colors.find((c) => c.id === item.selectedColorId) ??
          item.product.colors[0];
        const swatchClass = selectedColor?.swatch
          ? (PRODUCT_SWATCH_CLASSES[selectedColor.swatch] ?? "bg-foreground")
          : "bg-foreground";
        const thumbnail =
          selectedColor?.images[0] ??
          item.product.colors[0]?.images[0] ??
          "/imgs/hero-slide-1.jpg";
        const productName = tProducts(item.product.nameKey);
        const lineTotal = item.product.priceTRY * item.quantity;

        return (
          <li
            key={item.id}
            className="flex items-start gap-2.5 sm:gap-3 rounded-xl border border-border/70 bg-background/40 p-2 sm:p-3"
          >
            <Link
              href={`/products/${item.product.slug}`}
              className="relative aspect-3/4 w-14 sm:w-16 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted/40"
            >
              <Image
                src={thumbnail}
                alt={productName}
                fill
                sizes="64px"
                className="object-cover object-top"
              />
            </Link>
            <div className="min-w-0 flex-1 space-y-1">
              <Link
                href={`/products/${item.product.slug}`}
                className="block text-xs sm:text-sm font-medium text-foreground hover:text-primary line-clamp-1 transition-colors"
              >
                {productName}
              </Link>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
                {item.selectedSize ? (
                  <span>
                    {tSummary("size")}: {item.selectedSize}
                  </span>
                ) : null}
                {selectedColor ? (
                  <span className="inline-flex items-center gap-1">
                    <span
                      className={cn("size-2.5 rounded-full border border-border/60", !selectedColor.hex && swatchClass)}
                      style={selectedColor.hex ? { backgroundColor: selectedColor.hex } : undefined}
                      aria-hidden
                    />
                    {selectedColor.nameKey || selectedColor.id}
                  </span>
                ) : null}
                <span>{tSummary("qty", { count: item.quantity })}</span>
              </div>
              <ProductPrice
                amountTRY={lineTotal}
                className="text-xs sm:text-sm font-semibold text-foreground"
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
