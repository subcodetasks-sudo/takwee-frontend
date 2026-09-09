"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  ShieldCheck,
  Gift,
  RotateCcw,
  Info,
  Tag,
  Check,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductPrice } from "@/features/product";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CartOrderSummaryProps {
  subtotalTRY: number;
  itemCount: number;
}

export function CartOrderSummary({
  subtotalTRY,
  itemCount,
}: CartOrderSummaryProps) {
  const t = useTranslations("CartPage.summary");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  // 10% estimated merchandise VAT
  const estimatedTaxTRY = Math.round(subtotalTRY * 0.1);
  const totalTRY = subtotalTRY + estimatedTaxTRY;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    setPromoApplied(true);
  };

  return (
    <div
      id="cart-order-summary"
      className="relative space-y-4 sm:space-y-6 rounded-2xl sm:rounded-3xl border border-border/80 bg-card/90 p-3.5 sm:p-6 md:p-7 shadow-xs backdrop-blur-md transition-all scroll-mt-24"
    >
      {/* Card Title */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3 sm:pb-4">
        <h2 className="text-base sm:text-xl font-semibold tracking-tight text-foreground">
          {t("title")}
        </h2>
        <span className="text-xs font-medium text-muted-foreground">
          {t("itemCount", { count: itemCount })}
        </span>
      </div>

      {/* Financial Breakdown */}
      <div className="space-y-3.5 text-xs sm:text-sm">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-muted-foreground">
          <span>{t("subtotal")}</span>
          <ProductPrice amountTRY={subtotalTRY} className="font-semibold text-foreground" />
        </div>

        {/* Estimated Merchandise Taxes (VAT 10%) */}
        <div className="flex items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span>{t("estimatedTax")}</span>
            <TooltipProvider delay={100}>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      aria-label={t("taxTooltip")}
                      className="text-muted-foreground/70 hover:text-foreground transition-colors"
                    />
                  }
                >
                  <Info className="size-3.5" aria-hidden />
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={4} className="text-xs max-w-xs">
                  {t("taxTooltip")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <ProductPrice amountTRY={estimatedTaxTRY} className="font-medium text-foreground" />
        </div>
      </div>

      {/* Promo Code Input */}
      <form onSubmit={handleApplyPromo} className="space-y-2 pt-1">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Tag className="absolute start-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              type="text"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value);
                if (promoApplied) setPromoApplied(false);
              }}
              placeholder={t("promoCode.placeholder")}
              className="h-10 ps-9 pe-3 text-xs rounded-xl uppercase tracking-wider font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={!promoCode.trim()}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-10 px-4 rounded-xl text-xs font-semibold shrink-0 disabled:opacity-50",
            )}
          >
            {promoApplied ? (
              <span className="flex items-center gap-1 text-success">
                <Check className="size-3.5" />
                {t("promoCode.applied")}
              </span>
            ) : (
              t("promoCode.apply")
            )}
          </button>
        </div>
      </form>

      {/* Divider */}
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
        <p className="text-[10px] sm:text-[11px] text-muted-foreground text-start">
          {t("totalNote")}
        </p>
      </div>

      {/* Primary Checkout Action */}
      <div className="pt-0.5 sm:pt-2">
        <Link
          href="/checkout"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "group w-full h-11 sm:h-12 rounded-xl text-sm sm:text-base font-medium shadow-xs hover:shadow-md transition-all gap-2 flex items-center justify-center",
          )}
        >
          <span>{t("checkoutButton")}</span>
          <ArrowRight
            className="size-4 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
            aria-hidden
          />
        </Link>
      </div>

      {/* Boutique Trust Guarantees */}
      <div className="border-t border-border/60 pt-3 sm:pt-4 space-y-2 sm:space-y-2.5 text-[11px] sm:text-xs text-muted-foreground">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="size-4 shrink-0 text-primary-700 dark:text-primary-400" />
          <span>{t("guarantees.secure")}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Gift className="size-4 shrink-0 text-primary-700 dark:text-primary-400" />
          <span>{t("guarantees.packaging")}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <RotateCcw className="size-4 shrink-0 text-primary-700 dark:text-primary-400" />
          <span>{t("guarantees.returns")}</span>
        </div>
      </div>
    </div>
  );
}
