"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CheckoutEmptyState() {
  const t = useTranslations("CheckoutPage.empty");

  return (
    <div className="relative isolate overflow-hidden rounded-2xl sm:rounded-3xl border border-border/70 bg-gradient-to-b from-card/90 via-card/70 to-muted/20 p-4 sm:p-10 md:p-14 shadow-xs">
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        <div className="mb-4 sm:mb-6 flex size-14 sm:size-16 items-center justify-center rounded-2xl border border-border/80 bg-background/85 text-primary-800 dark:text-primary-200 shadow-xs">
          <ShoppingBag className="size-6 sm:size-7 stroke-[1.4]" aria-hidden />
        </div>
        <h2 className="text-lg sm:text-2xl font-semibold tracking-tight text-foreground">
          {t("title")}
        </h2>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          {t("description")}
        </p>
        <div className="mt-5 sm:mt-7 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <Link
            href="/shop"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "group h-11 rounded-xl gap-2 px-6",
            )}
          >
            <span>{t("ctaShop")}</span>
            <ArrowRight
              className="size-3.5 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
              aria-hidden
            />
          </Link>
          <Link
            href="/cart"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 rounded-xl px-6",
            )}
          >
            {t("ctaCart")}
          </Link>
        </div>
      </div>
    </div>
  );
}
