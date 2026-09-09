"use client";

import { Loader2, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { ProductPrice } from "@/features/product";
import type { CartItem } from "@/features/cart/types";
import { cn } from "@/lib/utils";
import { CheckoutLineItems } from "./CheckoutLineItems";

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  itemCount: number;
  subtotalTRY: number;
  isSubmitting?: boolean;
}

export function CheckoutOrderSummary({
  items,
  itemCount,
  subtotalTRY,
  isSubmitting = false,
}: CheckoutOrderSummaryProps) {
  const t = useTranslations("CheckoutPage.summary");
  const estimatedTaxTRY = Math.round(subtotalTRY * 0.1);
  const totalTRY = subtotalTRY + estimatedTaxTRY;

  return (
    <div
      id="checkout-order-summary"
      className="relative space-y-3.5 sm:space-y-6 rounded-2xl sm:rounded-3xl border border-border/80 bg-card/90 p-3.5 sm:p-6 md:p-7 shadow-xs backdrop-blur-md scroll-mt-24"
    >
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5 sm:pb-4">
        <h2 className="text-base sm:text-xl font-semibold tracking-tight text-foreground">
          {t("title")}
        </h2>
        <span className="text-xs font-medium text-muted-foreground">
          {t("itemCount", { count: itemCount })}
        </span>
      </div>

      <CheckoutLineItems items={items} />

      <div className="space-y-2.5 sm:space-y-3.5 border-t border-border/60 pt-3 sm:pt-3.5 text-xs sm:text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>{t("subtotal")}</span>
          <ProductPrice
            amountTRY={subtotalTRY}
            className="font-semibold text-foreground"
          />
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>{t("estimatedTax")}</span>
          <ProductPrice
            amountTRY={estimatedTaxTRY}
            className="font-medium text-foreground"
          />
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>{t("shipping")}</span>
          <span className="font-medium text-success">{t("shippingComplimentary")}</span>
        </div>
      </div>

      <div className="border-t border-border/70 pt-3 sm:pt-4 space-y-1">
        <div className="flex items-baseline justify-between">
          <span className="text-sm sm:text-base font-semibold text-foreground">
            {t("total")}
          </span>
          <ProductPrice
            amountTRY={totalTRY}
            className="text-lg sm:text-2xl font-bold tracking-tight text-foreground"
          />
        </div>
        <p className="text-[10px] sm:text-[11px] text-muted-foreground">
          {t("totalNote")}
        </p>
      </div>

      <button
        type="submit"
        form="checkout-form"
        disabled={isSubmitting || items.length === 0}
        className={cn(
          buttonVariants({ variant: "default", size: "lg" }),
          "w-full h-11 sm:h-12 rounded-xl text-sm sm:text-base font-medium shadow-xs hover:shadow-md transition-all gap-2 disabled:opacity-60 bg-success text-success-foreground hover:bg-success/90",
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            <span>{t("placingOrder")}</span>
          </>
        ) : (
          <span>{t("placeOrder")}</span>
        )}
      </button>

      <div className="flex items-center gap-2.5 text-[11px] sm:text-xs text-muted-foreground">
        <ShieldCheck className="size-4 shrink-0 text-primary-700 dark:text-primary-400" />
        <span>{t("secureNote")}</span>
      </div>
    </div>
  );
}
