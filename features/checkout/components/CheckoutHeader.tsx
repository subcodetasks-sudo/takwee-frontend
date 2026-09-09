"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";

interface CheckoutHeaderProps {
  itemCount?: number;
}

export function CheckoutHeader({ itemCount = 0 }: CheckoutHeaderProps) {
  const t = useTranslations("CheckoutPage");

  return (
    <div className="space-y-2 sm:space-y-3">
      <Link
        href="/cart"
        className="group inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft
          className="size-3.5 rtl:rotate-180 transition-transform duration-200 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5"
          aria-hidden
        />
        {t("backToCart")}
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-3 sm:gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">
              {t("title")}
            </h1>
            <span className="rounded-full border border-border/70 bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground shadow-2xs">
              {t("itemCount", { count: itemCount })}
            </span>
          </div>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {t("subtitle")}
          </p>
        </div>
      </div>
    </div>
  );
}
