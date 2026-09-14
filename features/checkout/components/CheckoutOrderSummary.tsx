"use client";

import { Loader2, ShieldCheck, Tag, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProductPrice } from "@/features/product";
import type { CartItem } from "@/features/cart/types";
import { cn } from "@/lib/utils";
import type { ApiCheckoutPricing } from "../types/api";
import { CheckoutLineItems } from "./CheckoutLineItems";

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  itemCount: number;
  subtotalTRY: number;
  pricing?: ApiCheckoutPricing | null;
  isPreviewLoading?: boolean;
  couponCode?: string;
  onApplyCoupon?: (code: string) => void | Promise<void>;
  onRemoveCoupon?: () => void | Promise<void>;
  isApplyingCoupon?: boolean;
  isSubmitting?: boolean;
}

export function CheckoutOrderSummary({
  items,
  itemCount,
  subtotalTRY,
  pricing,
  isPreviewLoading = false,
  couponCode = "",
  onApplyCoupon,
  onRemoveCoupon,
  isApplyingCoupon = false,
  isSubmitting = false,
}: CheckoutOrderSummaryProps) {
  const t = useTranslations("CheckoutPage.summary");

  const [inputCoupon, setInputCoupon] = useState(couponCode);

  useEffect(() => {
    setInputCoupon(couponCode);
  }, [couponCode]);

  // If live pricing from preview API is available, use exact API numbers
  const subtotal = pricing ? pricing.subtotal : subtotalTRY;
  const discount = pricing ? pricing.discount : 0;
  const shippingFee = pricing ? pricing.shipping_cost : 0;
  const tax = pricing ? pricing.tax : Math.round(subtotalTRY * 0.1);
  const total = pricing ? pricing.total : subtotal + tax + shippingFee - discount;
  const appliedCoupon = pricing?.coupon || couponCode;
  const couponBusy = isApplyingCoupon || isPreviewLoading || isSubmitting;

  const handleApplyCoupon = () => {
    if (inputCoupon.trim() && onApplyCoupon && !couponBusy) {
      void onApplyCoupon(inputCoupon.trim());
    }
  };

  const handleRemoveCoupon = () => {
    if (onRemoveCoupon && !couponBusy) {
      void onRemoveCoupon();
    }
  };

  return (
    <div
      id="checkout-order-summary"
      className="relative space-y-3.5 sm:space-y-6 rounded-2xl sm:rounded-3xl border border-border/80 bg-card/90 p-3.5 sm:p-6 md:p-7 shadow-xs backdrop-blur-md scroll-mt-24"
    >
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5 sm:pb-4">
        <h2 className="text-base sm:text-xl font-semibold tracking-tight text-foreground">
          {t("title")}
        </h2>
        <div className="flex items-center gap-2">
          {isPreviewLoading ? (
            <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
          ) : null}
          <span className="text-xs font-medium text-muted-foreground">
            {t("itemCount", { count: itemCount })}
          </span>
        </div>
      </div>

      <CheckoutLineItems items={items} />

      {/* Coupon Code Input — div, not form (nested inside checkout-form) */}
      {onApplyCoupon ? (
        <div className="space-y-2 pt-1 border-t border-border/60">
          <div className="flex items-center gap-2 pt-2">
            <div className="relative flex-1">
              <Tag className="absolute start-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                type="text"
                value={inputCoupon}
                onChange={(e) => setInputCoupon(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApplyCoupon();
                  }
                }}
                placeholder={t("promoCode.placeholder")}
                disabled={Boolean(appliedCoupon) || couponBusy}
                aria-label={t("promoCode.label")}
                className="h-10 ps-9 pe-3 text-xs rounded-xl uppercase tracking-wider font-medium"
              />
            </div>
            {appliedCoupon ? (
              <TooltipProvider delay={100}>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        disabled={couponBusy}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "h-10 px-3 rounded-xl text-xs font-semibold shrink-0 text-muted-foreground hover:text-foreground",
                        )}
                        aria-label={t("promoCode.remove")}
                      />
                    }
                  >
                    {isApplyingCoupon ? (
                      <Loader2 className="size-3.5 animate-spin" aria-hidden />
                    ) : (
                      <X className="size-3.5" aria-hidden />
                    )}
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={4} className="text-xs">
                    {t("promoCode.remove")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={!inputCoupon.trim() || couponBusy}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "h-10 px-4 rounded-xl text-xs font-semibold shrink-0 disabled:opacity-50 gap-1.5",
                )}
              >
                {isApplyingCoupon ? (
                  <Loader2 className="size-3.5 animate-spin" aria-hidden />
                ) : null}
                {t("promoCode.apply")}
              </button>
            )}
          </div>
          {appliedCoupon ? (
            <p className="flex items-center gap-1.5 text-xs text-success font-medium">
              <Check className="size-3.5" />
              <span>{appliedCoupon}</span>
            </p>
          ) : null}
        </div>
      ) : null}

      {isPreviewLoading && !pricing ? (
        <div className="space-y-3 border-t border-border/60 pt-3 sm:pt-3.5">
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 rounded bg-muted/60 animate-pulse" />
            <div className="h-4 w-16 rounded bg-muted/60 animate-pulse" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 rounded bg-muted/60 animate-pulse" />
            <div className="h-4 w-12 rounded bg-muted/60 animate-pulse" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-4 w-16 rounded bg-muted/60 animate-pulse" />
            <div className="h-4 w-20 rounded bg-muted/60 animate-pulse" />
          </div>
          <div className="border-t border-border/70 pt-3 flex items-center justify-between">
            <div className="h-5 w-20 rounded bg-muted/60 animate-pulse" />
            <div className="h-6 w-24 rounded bg-muted/60 animate-pulse" />
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-2.5 sm:space-y-3.5 border-t border-border/60 pt-3 sm:pt-3.5 text-xs sm:text-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>{t("subtotal")}</span>
              {isPreviewLoading ? (
                <div className="h-4 w-16 rounded bg-muted/60 animate-pulse" />
              ) : (
                <ProductPrice
                  amountTRY={subtotal}
                  className="font-semibold text-foreground"
                />
              )}
            </div>

            {discount > 0 ? (
              <div className="flex items-center justify-between text-success">
                <span>
                  {t("discount")}
                  {appliedCoupon ? ` (${appliedCoupon})` : ""}
                </span>
                {isPreviewLoading ? (
                  <div className="h-4 w-14 rounded bg-muted/60 animate-pulse" />
                ) : (
                  <span className="font-semibold tabular-nums">- <ProductPrice amountTRY={discount} /></span>
                )}
              </div>
            ) : null}

            {tax > 0 ? (
              <div className="flex items-center justify-between text-muted-foreground">
                <span>{t("estimatedTax")}</span>
                {isPreviewLoading ? (
                  <div className="h-4 w-14 rounded bg-muted/60 animate-pulse" />
                ) : (
                  <ProductPrice
                    amountTRY={tax}
                    className="font-medium text-foreground"
                  />
                )}
              </div>
            ) : null}

            <div className="flex items-center justify-between text-muted-foreground">
              <span>{t("shipping")}</span>
              {isPreviewLoading ? (
                <div className="h-4 w-16 rounded bg-muted/60 animate-pulse" />
              ) : shippingFee === 0 ? (
                <span className="font-medium text-success">{t("shippingComplimentary")}</span>
              ) : (
                <ProductPrice
                  amountTRY={shippingFee}
                  className="font-medium text-foreground"
                />
              )}
            </div>
          </div>

          <div className="border-t border-border/70 pt-3 sm:pt-4 space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-sm sm:text-base font-semibold text-foreground">
                {t("total")}
              </span>
              {isPreviewLoading ? (
                <div className="h-7 w-24 rounded bg-muted/60 animate-pulse" />
              ) : (
                <ProductPrice
                  amountTRY={total}
                  className="text-lg sm:text-2xl font-bold tracking-tight text-foreground"
                />
              )}
            </div>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground">
              {t("totalNote")}
            </p>
          </div>
        </>
      )}

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
