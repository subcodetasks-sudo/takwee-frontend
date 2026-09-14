"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  HelpCircle,
  MapPin,
  Package,
  RotateCcw,
  ShoppingBag,
  CreditCard,
  Banknote,
  Building2,
  XCircle,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { Button, buttonVariants } from "@/components/ui/button";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { ProductPrice } from "@/features/product";
import { WriteReviewDialog } from "@/features/reviews";
import type { OrderItemSummary } from "../types";
import { useCancelOrder, useOrder } from "../hooks/useOrders";
import { OrderDetailsHeader } from "./OrderDetailsHeader";
import { OrderTracker } from "./OrderTracker";
function getProductHref(item: OrderItemSummary): string | null {
  if (item.slug) return `/products/${item.slug}`;
  return null;
}

function formatDate(
  locale: string,
  dateStr: string,
  style: "short" | "long" | "datetime" = "short",
) {
  try {
    const normalized = dateStr.includes("T")
      ? dateStr
      : dateStr.replace(" ", "T");
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: style === "long" ? "long" : "short",
      year: "numeric",
      ...(style === "datetime"
        ? { hour: "numeric", minute: "2-digit" as const }
        : {}),
    }).format(new Date(normalized));
  } catch {
    return dateStr;
  }
}

interface OrderDetailsContentProps {
  orderId: string;
}

export function OrderDetailsContent({ orderId }: OrderDetailsContentProps) {
  const t = useTranslations("ProfilePage.orders");
  const locale = useLocale();
  const { order, isLoading, isError, refetch } = useOrder(orderId);
  const { cancelOrder, isCancelling } = useCancelOrder();

  const handleCancel = async () => {
    if (!order?.canCancel) return;
    try {
      await cancelOrder(order.id);
      gooeyToast.success(t("toasts.cancelSuccess"));
    } catch (error) {
      gooeyToast.error(
        error instanceof Error && error.message
          ? error.message
          : t("toasts.cancelError"),
      );
    }
  };

  if (isLoading && !order) {
    return (
      <section className="w-full flex-1 py-5 sm:py-8 md:py-12" aria-busy="true">
        <div className="mx-auto space-y-5 sm:space-y-8">
          <div className="space-y-2.5 sm:space-y-4">
            <div className="h-4 w-28 rounded bg-muted animate-pulse" />
            <div className="h-8 w-48 rounded-lg bg-muted animate-pulse" />
            <div className="h-4 w-36 rounded bg-muted/70 animate-pulse" />
          </div>
          <div className="h-28 rounded-xl bg-muted/60 animate-pulse sm:rounded-2xl" />
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-xl border border-border/60 p-3 sm:gap-4 sm:p-5"
              >
                <div className="size-14 shrink-0 rounded-lg bg-muted animate-pulse sm:size-24" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
                  <div className="h-3.5 w-1/3 rounded bg-muted/70 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || !order) {
    return (
      <section className="w-full flex-1 py-5 sm:py-8 md:py-12">
        <div className="mx-auto space-y-4 text-center">
          <Link
            href="/me/orders"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden />
            {t("details.backToOrders")}
          </Link>
          <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 sm:rounded-2xl sm:px-6 sm:py-14">
            <p className="text-sm font-medium text-foreground">
              {t("details.notFoundTitle")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("loadError.description")}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => void refetch()}
              className="mt-4 text-xs"
            >
              {t("loadError.retry")}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const cancelledLabel = order.cancelledAt
    ? formatDate(locale, order.cancelledAt, "datetime")
    : null;

  const isInProgress =
    order.status === "pending" ||
    order.status === "confirmed" ||
    order.status === "processing" ||
    order.status === "shipped";

  const showTracker = isInProgress || order.status === "delivered";

  const itemsSubtotal =
    order.subtotalTRY ??
    order.items.reduce(
      (sum, item) => sum + (item.priceTRY ?? 0) * item.quantity,
      0,
    );
  const shippingTRY = order.shippingTRY ?? 0;
  const discountTRY = order.discountTRY ?? 0;

  const PaymentIcon =
    order.payment?.method === "cashOnDelivery"
      ? Banknote
      : order.payment?.method === "bankTransfer"
        ? Building2
        : CreditCard;

  return (
    <section className="w-full flex-1 py-5 sm:py-8 md:py-12">
      <div className="mx-auto space-y-5 sm:space-y-8">
        <FadeIn direction="up">
          <div className="space-y-2.5 sm:space-y-4">
            <Link
              href="/me/orders"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden />
              {t("details.backToOrders")}
            </Link>
            <OrderDetailsHeader order={order} />
          </div>
        </FadeIn>

        {showTracker && (
          <FadeIn direction="up" delay={0.05}>
            <OrderTracker tracking={order.tracking} status={order.status} />
          </FadeIn>
        )}

        {order.status === "cancelled" && (
          <FadeIn direction="up" delay={0.05}>
            <div className="rounded-lg border border-error/20 bg-error-muted/20 p-2.5 text-xs sm:rounded-xl sm:p-4 sm:text-sm">
              <div className="flex items-start gap-2 text-error sm:gap-2.5">
                <AlertCircle
                  className="mt-0.5 size-3.5 shrink-0 sm:size-4"
                  aria-hidden
                />
                <div className="space-y-1">
                  <p className="font-medium text-[11px] sm:text-sm">
                    {cancelledLabel
                      ? t("cancelledWithDate", { date: cancelledLabel })
                      : t("cancelledNotice")}
                  </p>
                  {order.cancellationReason && (
                    <p className="text-[10px] text-muted-foreground sm:text-xs">
                      {order.cancellationReason}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        <FadeIn direction="up" delay={0.08}>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-end justify-between gap-2 sm:gap-3">
              <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-sm">
                {t("items")}
              </h2>
              <span className="text-[11px] text-muted-foreground sm:text-xs">
                {t("itemCount", { count: order.itemCount })}
              </span>
            </div>

            <StaggerContainer
              staggerDelay={0.06}
              className="space-y-2.5 sm:space-y-3.5"
            >
              {order.items.map((item, idx) => {
                const productHref = getProductHref(item);

                return (
                  <StaggerItem key={`${order.id}-${item.name || "item"}-${idx}`}>
                    <article className="group/item relative overflow-hidden rounded-xl border border-border/80 bg-card p-3 transition-all duration-200 hover:border-border hover:shadow-xs sm:rounded-2xl sm:p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                        <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-4.5">
                          {productHref ? (
                            <Link
                              href={productHref}
                              className="group/thumb relative size-14 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:size-24 sm:rounded-xl"
                              aria-label={item.name || undefined}
                            >
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.name || ""}
                                  fill
                                  sizes="(min-width: 640px) 96px, 56px"
                                  className="object-cover transition-transform duration-300 group-hover/thumb:scale-105 group-hover/item:scale-105"
                                />
                              ) : (
                                <div className="flex size-full items-center justify-center text-muted-foreground">
                                  <Package
                                    className="size-5 sm:size-7"
                                    aria-hidden
                                  />
                                </div>
                              )}
                            </Link>
                          ) : (
                            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted sm:size-24 sm:rounded-xl">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.name || ""}
                                  fill
                                  sizes="(min-width: 640px) 96px, 56px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex size-full items-center justify-center text-muted-foreground">
                                  <Package
                                    className="size-5 sm:size-7"
                                    aria-hidden
                                  />
                                </div>
                              )}
                            </div>
                          )}

                          <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
                            <div>
                              {item.name ? (
                                productHref ? (
                                  <Link
                                    href={productHref}
                                    className="group/title inline-flex max-w-full items-center gap-1 rounded-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:gap-1.5"
                                  >
                                    <h3 className="line-clamp-1 text-xs font-semibold text-foreground transition-colors group-hover/title:text-primary sm:text-base">
                                      {item.name}
                                    </h3>
                                    <ArrowUpRight
                                      className="size-3 shrink-0 text-muted-foreground/60 transition-transform group-hover/title:-translate-y-0.5 group-hover/title:translate-x-0.5 group-hover/title:text-primary sm:size-3.5 rtl:-scale-x-100 rtl:group-hover/title:-translate-x-0.5"
                                      aria-hidden
                                    />
                                  </Link>
                                ) : (
                                  <h3 className="line-clamp-1 text-xs font-semibold text-foreground sm:text-base">
                                    {item.name}
                                  </h3>
                                )
                              ) : (
                                <h3 className="line-clamp-1 text-xs font-semibold text-foreground sm:text-base">
                                  {t("itemCount", { count: item.quantity })}
                                </h3>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-1 text-[11px] sm:gap-1.5 sm:text-xs">
                              {item.size && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-1.5 py-0.5 text-foreground/85 ring-1 ring-border/40 sm:px-2">
                                  <span className="text-[10px] text-muted-foreground sm:text-[11px]">
                                    {t("details.size")}:
                                  </span>
                                  <span className="font-medium">{item.size}</span>
                                </span>
                              )}
                              {item.color && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-1.5 py-0.5 text-foreground/85 ring-1 ring-border/40 sm:px-2">
                                  <span className="text-[10px] text-muted-foreground sm:text-[11px]">
                                    {t("details.color")}:
                                  </span>
                                  <span className="font-medium">
                                    {item.color}
                                  </span>
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-1.5 py-0.5 text-foreground/85 ring-1 ring-border/40 sm:px-2">
                                <span className="text-[10px] text-muted-foreground sm:text-[11px]">
                                  {t("details.quantity")}:
                                </span>
                                <span className="font-semibold text-foreground">
                                  {item.quantity}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-border/50 pt-2.5 sm:flex-col sm:items-end sm:justify-center sm:gap-2.5 sm:border-t-0 sm:pt-0">
                          {item.priceTRY != null && (
                            <div className="space-y-0.5 sm:text-end">
                              <ProductPrice
                                amountTRY={item.priceTRY * item.quantity}
                                className="text-sm font-semibold text-foreground sm:text-lg"
                                iconClassName="size-3.5 sm:size-4"
                              />
                              {item.quantity > 1 && (
                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground sm:justify-end sm:text-[11px]">
                                  <span>{item.quantity} ×</span>
                                  <ProductPrice
                                    amountTRY={item.priceTRY}
                                    className="text-[10px] text-muted-foreground sm:text-[11px]"
                                    iconClassName="size-2.5"
                                  />
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
                            {order.status === "delivered" &&
                              item.name &&
                              item.productId && (
                              <WriteReviewDialog
                                item={item}
                                orderNumber={order.number}
                              />
                            )}

                            {productHref && (
                              <Link
                                href={productHref}
                                className={buttonVariants({
                                  variant: "outline",
                                  size: "xs",
                                  className:
                                    "gap-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground border-border/80 sm:text-xs",
                                })}
                              >
                                <span>{t("actions.viewProduct")}</span>
                                <ArrowUpRight
                                  className="size-3 rtl:-scale-x-100"
                                  aria-hidden
                                />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.1}>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {order.shippingAddress && (
              <div className="rounded-xl border border-border bg-card p-3 sm:rounded-2xl sm:p-5">
                <div className="mb-2 flex items-center gap-2 text-foreground sm:mb-3">
                  <MapPin
                    className="size-3.5 text-muted-foreground sm:size-4"
                    aria-hidden
                  />
                  <h2 className="text-xs font-semibold sm:text-sm">
                    {t("details.shippingAddress")}
                  </h2>
                </div>
                <address className="space-y-0.5 text-xs not-italic text-muted-foreground sm:text-sm">
                  <p className="font-medium text-foreground">
                    {order.shippingAddress.fullName}
                  </p>
                  <p>{order.shippingAddress.line1}</p>
                  {order.shippingAddress.line2 && (
                    <p>{order.shippingAddress.line2}</p>
                  )}
                  <p>
                    {[
                      order.shippingAddress.city,
                      order.shippingAddress.region,
                      order.shippingAddress.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p className="pt-1 font-mono text-[11px] sm:text-xs">
                      {order.shippingAddress.phone}
                    </p>
                  )}
                </address>
              </div>
            )}

            <div className="rounded-xl border border-border bg-card p-3 sm:rounded-2xl sm:p-5">
              <div className="mb-2 flex items-center gap-2 text-foreground sm:mb-3">
                <PaymentIcon
                  className="size-3.5 text-muted-foreground sm:size-4"
                  aria-hidden
                />
                <h2 className="text-xs font-semibold sm:text-sm">
                  {t("details.paymentSummary")}
                </h2>
              </div>

              {order.payment && (
                <p className="mb-3 text-xs text-muted-foreground sm:mb-4 sm:text-sm">
                  {order.payment.method === "card" && order.payment.last4
                    ? t("details.paymentCard", {
                        brand: order.payment.brand ?? "Card",
                        last4: order.payment.last4,
                      })
                    : t(`details.paymentMethods.${order.payment.method}`)}
                </p>
              )}

              <dl className="space-y-1.5 text-xs sm:space-y-2 sm:text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">
                    {t("details.subtotal")}
                  </dt>
                  <dd>
                    <ProductPrice
                      amountTRY={itemsSubtotal}
                      className="text-xs text-foreground sm:text-sm"
                      iconClassName="size-3 sm:size-3.5"
                    />
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">
                    {t("details.shipping")}
                  </dt>
                  <dd className="text-foreground">
                    {shippingTRY === 0 ? (
                      <span className="text-success">
                        {t("details.shippingFree")}
                      </span>
                    ) : (
                      <ProductPrice
                        amountTRY={shippingTRY}
                        className="text-xs text-foreground sm:text-sm"
                        iconClassName="size-3 sm:size-3.5"
                      />
                    )}
                  </dd>
                </div>
                {discountTRY > 0 && (
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">
                      {t("details.discount")}
                    </dt>
                    <dd className="text-success">
                      −
                      <ProductPrice
                        amountTRY={discountTRY}
                        className="inline-flex text-xs text-success sm:text-sm"
                        iconClassName="size-3 sm:size-3.5"
                      />
                    </dd>
                  </div>
                )}
                <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-2.5 sm:pt-3">
                  <dt className="font-semibold text-foreground">
                    {t("details.total")}
                  </dt>
                  <dd>
                    <ProductPrice
                      amountTRY={order.totalTRY}
                      className="text-sm font-semibold text-foreground sm:text-base"
                      iconClassName="size-3.5 sm:size-4"
                    />
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.12}>
          <div className="flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-4 sm:gap-2 sm:pt-6">
            {order.canCancel && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isCancelling}
                onClick={() => void handleCancel()}
                className="flex-1 gap-1.5 text-[11px] text-error border-error/30 hover:bg-error-muted sm:flex-none sm:text-xs"
              >
                <XCircle className="size-3.5" aria-hidden />
                <span>
                  {isCancelling
                    ? t("actions.cancelling")
                    : t("actions.cancelOrder")}
                </span>
              </Button>
            )}

            {(order.status === "delivered" || order.status === "cancelled") && (
              <Link
                href="/shop"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className:
                    "flex-1 gap-1.5 text-[11px] sm:flex-none sm:text-xs",
                })}
              >
                {order.status === "cancelled" ? (
                  <ShoppingBag className="size-3.5" aria-hidden />
                ) : (
                  <RotateCcw className="size-3.5" aria-hidden />
                )}
                <span>{t("actions.buyAgain")}</span>
              </Link>
            )}

            <Link
              href="/contact"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className:
                  "flex-1 gap-1.5 text-[11px] text-muted-foreground hover:text-foreground sm:flex-none sm:text-xs",
              })}
            >
              <HelpCircle className="size-3.5" aria-hidden />
              <span>{t("actions.needHelp")}</span>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
