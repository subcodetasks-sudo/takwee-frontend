"use client";

import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Check,
  MessageSquarePlus,
  Package,
  Sparkles,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/features/auth";
import {
  fetchOrderById,
  fetchOrders,
  orderQueryKey,
  ordersQueryKey,
} from "@/features/orders";
import { cn } from "@/lib/utils";
import type { Product, ProductReview } from "../types";

export type ReviewItem = ProductReview;

interface ProductReviewsProps {
  product: Product;
  initialReviews?: ProductReview[];
}

export function ProductReviews({
  product,
  initialReviews = [],
}: ProductReviewsProps) {
  const t = useTranslations("ProductDetails.reviewsSection");
  const locale = useLocale();
  const { session, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const token = session?.token;

  const deliveredOrdersQuery = useQuery({
    queryKey: ordersQueryKey(locale, "delivered"),
    queryFn: () => fetchOrders(token!, locale, "delivered"),
    enabled: isAuthenticated && Boolean(token),
    staleTime: 60_000,
  });

  const deliveredOrders = deliveredOrdersQuery.data ?? [];

  const detailQueries = useQueries({
    queries: deliveredOrders.map((order) => ({
      queryKey: orderQueryKey(locale, order.id),
      queryFn: () => fetchOrderById(token!, order.id, locale),
      enabled: isAuthenticated && Boolean(token) && Boolean(order.id),
      staleTime: 60_000,
    })),
  });

  const hasPurchasedProduct = useMemo(() => {
    if (!isAuthenticated || !product.id) return false;
    return detailQueries.some((query) =>
      query.data?.items.some(
        (item) =>
          item.productId != null &&
          String(item.productId) === String(product.id),
      ),
    );
  }, [detailQueries, isAuthenticated, product.id]);

  const isPurchaseCheckPending =
    isAuthenticated &&
    (isAuthLoading ||
      deliveredOrdersQuery.isLoading ||
      (deliveredOrders.length > 0 &&
        detailQueries.some((query) => query.isLoading || query.isPending)));

  const reviews = initialReviews;
  const totalReviews = Math.max(product.reviewsCount ?? 0, reviews.length);
  const averageFromList =
    reviews.length > 0
      ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
      : 0;
  const averageRating = (
    typeof product.rating === "number" && product.rating > 0
      ? product.rating
      : averageFromList
  ).toFixed(1);

  const showOrdersCta = !hasPurchasedProduct && !isPurchaseCheckPending;

  return (
    <div className="w-full space-y-8">
      <div className="rounded-2xl border border-border/80 bg-card/60 p-6 shadow-xs sm:p-8">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-3">
          {totalReviews === 0 ? (
            <div className="flex flex-col items-center justify-center text-center lg:items-start lg:text-start">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-800 dark:bg-secondary-900/60 dark:text-secondary-300">
                <Star className="size-5 fill-secondary-300 stroke-secondary-700" />
              </div>
              <h4 className="mt-2.5 text-base font-semibold text-foreground">
                {t("noReviewsTitle")}
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground max-w-xs">
                {t("noReviewsDesc")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center lg:items-start lg:text-start">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  {averageRating}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  {t("outOf")}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-1 text-warning">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="size-5 fill-current stroke-warning"
                    aria-hidden
                  />
                ))}
              </div>

              <p className="mt-2 text-xs font-medium text-muted-foreground">
                {t("basedOn", { count: totalReviews })}
              </p>
              <p className="mt-1 text-[11px] font-semibold text-success">
                {t("recommendation")}
              </p>
            </div>
          )}

          {totalReviews === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 border-y border-border/60 py-4 text-center text-xs text-muted-foreground lg:border-y-0 lg:border-x lg:px-6 lg:py-0">
              <Sparkles className="size-5 text-secondary-500" />
              <p className="font-semibold text-foreground">
                {t("verifiedReviewsOnly")}
              </p>
              <p className="text-[11px] leading-relaxed max-w-xs">
                {t("verifiedReviewsNotice")}
              </p>
            </div>
          ) : (
            <div className="space-y-2 border-y border-border/60 py-4 lg:border-y-0 lg:border-x lg:px-6 lg:py-0">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviews.filter((r) => r.rating === stars).length;
                const percent =
                  totalReviews > 0
                    ? Math.round((count / totalReviews) * 100)
                    : 0;
                return (
                  <div key={stars} className="flex items-center gap-2 text-xs">
                    <div className="flex w-12 shrink-0 items-center justify-end gap-1">
                      <span className="font-semibold tabular-nums text-foreground">
                        {stars}
                      </span>
                      <Star className="size-3 fill-warning text-warning" />
                    </div>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-warning transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-9 shrink-0 text-end text-[11px] tabular-nums text-muted-foreground">
                      {percent}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-col items-center justify-center gap-3 text-center lg:items-end lg:text-end">
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              {hasPurchasedProduct
                ? t("purchaserNotice")
                : t("purchaseOnlyNotice")}
            </p>
            {showOrdersCta ? (
              <Link
                href="/me/orders"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    className:
                      "gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-xs",
                  }),
                )}
              >
                <Package className="size-4" />
                <span>{t("viewOrdersCta")}</span>
              </Link>
            ) : null}
            {totalReviews > 0 ? (
              <span className="text-xs text-muted-foreground">
                {t("filterAll", { count: totalReviews })}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/80 bg-card/40 p-8 text-center sm:p-10">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <MessageSquarePlus className="size-6" />
            </div>
            <div className="max-w-md space-y-1">
              <h5 className="text-sm font-semibold text-foreground">
                {hasPurchasedProduct
                  ? t("purchaserEmptyTitle")
                  : t("reviewsEmptyTitle")}
              </h5>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {hasPurchasedProduct
                  ? t("purchaserEmptyDesc")
                  : t("reviewsEmptyDesc")}
              </p>
            </div>
            {showOrdersCta ? (
              <Link
                href="/me/orders"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "mt-1 rounded-xl text-xs font-semibold gap-1.5",
                  }),
                )}
              >
                <Package className="size-3.5" />
                <span>{t("viewOrdersCta")}</span>
              </Link>
            ) : null}
          </div>
        ) : (
          reviews.map((rev) => (
            <article
              key={rev.id}
              className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 sm:p-6 shadow-2xs transition-all hover:border-border"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 font-semibold text-foreground ring-1 ring-primary/20 text-xs sm:text-sm">
                    {rev.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                        {rev.author}
                      </h4>
                      {rev.verified ? (
                        <Badge
                          variant="secondary"
                          className="gap-1 bg-success-muted text-success border-0 text-[10px] px-2 py-0.5 font-medium"
                        >
                          <Check className="size-3" />
                          {t("verifiedBuyer")}
                        </Badge>
                      ) : null}
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {rev.date}
                    </span>
                  </div>
                </div>

                <div
                  className="flex items-center gap-0.5 text-warning"
                  aria-label={`${rev.rating} stars`}
                >
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        "size-4",
                        s <= rev.rating
                          ? "fill-warning text-warning"
                          : "fill-transparent text-muted-foreground/30",
                      )}
                      aria-hidden
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                {rev.title ? (
                  <h5 className="text-sm font-semibold text-foreground">
                    {rev.title}
                  </h5>
                ) : null}
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {rev.comment}
                </p>
              </div>

              {rev.sizePurchased ? (
                <div className="border-t border-border/40 pt-3 text-xs">
                  <span className="inline-flex items-center rounded-md bg-muted/60 px-2 py-1 text-[11px] font-medium text-foreground">
                    {t("sizePurchased", { size: rev.sizePurchased })}
                  </span>
                </div>
              ) : null}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
