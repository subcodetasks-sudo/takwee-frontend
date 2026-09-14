"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Package,
  RotateCcw,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Copy } from "@/components/animate-ui/icons/copy";
import { Check as CheckIcon } from "@/components/animate-ui/icons/check";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";
import type { OrderSummary } from "../types";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderTracker } from "./OrderTracker";
import { RefundNotice } from "./RefundNotice";
import { ProductPrice } from "@/features/product";

interface OrderCardProps {
  order: OrderSummary;
  className?: string;
}

export function OrderCard({ order, className }: OrderCardProps) {
  const t = useTranslations("ProfilePage.orders");
  const locale = useLocale();
  const { copied, copy } = useCopyToClipboard();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleCopyOrderNumber = async () => {
    const ok = await copy(order.number);
    if (ok) setTooltipOpen(true);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  const placedLabel = formatDate(order.placedAt);
  const deliveredLabel = order.deliveredAt ? formatDate(order.deliveredAt) : null;
  const cancelledLabel = order.cancelledAt ? formatDate(order.cancelledAt) : null;

  const isInProgress =
    order.status === "pending" ||
    order.status === "processing" ||
    order.status === "shipped" ||
    order.status === "in_transit" ||
    order.status === "out_for_delivery";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-xl border transition-all duration-300 sm:rounded-2xl",
        // State-specific card styling
        order.status === "pending" &&
          "border-amber-500/30 bg-card shadow-xs hover:border-amber-500/50",
        order.status === "processing" &&
          "border-warning/40 bg-card shadow-xs hover:border-warning/60",
        order.status === "shipped" &&
          "border-sky-500/30 bg-card shadow-xs hover:border-sky-500/50",
        order.status === "in_transit" &&
          "border-info/40 bg-card shadow-xs hover:border-info/60",
        order.status === "out_for_delivery" &&
          "border-purple-500/40 bg-card shadow-xs hover:border-purple-500/60",
        order.status === "delivered" &&
          "border-border bg-card hover:border-border/90 hover:shadow-2xs",
        order.status === "failed" &&
          "border-destructive/40 bg-card shadow-xs hover:border-destructive/60",
        order.status === "returned" &&
          "border-orange-500/30 bg-card shadow-xs hover:border-orange-500/50",
        order.status === "cancelled" &&
          "border-border/60 bg-muted/15 opacity-85 hover:opacity-100",
        className,
      )}
    >
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 px-3 py-2.5 sm:gap-3 sm:p-4 md:p-5">
        <div className="min-w-0 space-y-0.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-mono text-xs font-semibold tracking-tight text-foreground sm:text-sm">
              {order.number}
            </span>
            <TooltipProvider delay={100}>
              <Tooltip
                open={copied || tooltipOpen}
                onOpenChange={setTooltipOpen}
              >
                <AnimateIcon animateOnHover className="inline-flex">
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        onClick={handleCopyOrderNumber}
                        className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:size-7"
                        aria-label={
                          copied
                            ? t("orderNumberCopied")
                            : t("copyOrderNumber")
                        }
                      />
                    }
                  >
                    {copied ? (
                      <CheckIcon
                        size={14}
                        animate
                        className="text-success"
                        aria-hidden
                      />
                    ) : (
                      <Copy size={14} aria-hidden />
                    )}
                  </TooltipTrigger>
                </AnimateIcon>
                <TooltipContent
                  side="top"
                  sideOffset={6}
                  className="text-xs font-medium"
                >
                  {copied ? t("orderNumberCopied") : t("copyOrderNumber")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-muted-foreground/40" aria-hidden>
              •
            </span>
            <span className="text-[11px] text-muted-foreground sm:text-xs">
              {t("placedOn", { date: placedLabel })}
            </span>
          </div>
        </div>

        <OrderStatusBadge
          status={order.status}
          className="shrink-0 px-2 py-0.5 text-[11px] sm:px-2.5 sm:py-1 sm:text-xs"
        />
      </div>

      {/* STATE-SPECIFIC UNIQUE VIEWS */}
      <div className="space-y-3 p-3 sm:space-y-4 sm:p-4 md:p-5">
        {/* 1. In Progress States Tracker (pending, processing, shipped, in_transit, out_for_delivery) */}
        {isInProgress && (
          <OrderTracker tracking={order.tracking} status={order.status} />
        )}

        {/* 2. Delivered State View */}
        {order.status === "delivered" && (
          <div className="rounded-lg border border-success/20 bg-success-muted/20 p-2.5 text-xs sm:rounded-xl sm:p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1.5 text-success sm:gap-2">
                <CheckCircle2
                  className="size-3.5 shrink-0 sm:size-4"
                  aria-hidden
                />
                <span className="font-medium text-[11px] sm:text-xs">
                  {deliveredLabel
                    ? t("deliveredWithDate", { date: deliveredLabel })
                    : t("deliveredNotice")}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground sm:text-[11px]">
                {t("returnPolicyNotice")}
              </span>
            </div>
          </div>
        )}

        {/* 3. Failed State View */}
        {order.status === "failed" && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-2.5 text-xs sm:rounded-xl sm:p-3.5">
            <div className="flex items-start gap-2 text-destructive sm:gap-2.5">
              <AlertTriangle
                className="mt-0.5 size-3.5 shrink-0 sm:size-4"
                aria-hidden
              />
              <div className="space-y-1">
                <p className="font-medium text-[11px] sm:text-xs">
                  {t("failedNotice")}
                </p>
                <p className="text-[10px] text-muted-foreground sm:text-[11px]">
                  {t("failedHelpNotice")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. Returned State View */}
        {order.status === "returned" && (
          <div className="rounded-lg border border-orange-500/20 bg-orange-500/10 p-2.5 text-xs sm:rounded-xl sm:p-3.5">
            <div className="flex items-start gap-2 text-orange-700 dark:text-orange-400 sm:gap-2.5">
              <RotateCcw
                className="mt-0.5 size-3.5 shrink-0 sm:size-4"
                aria-hidden
              />
              <div className="space-y-1">
                <p className="font-medium text-[11px] sm:text-xs">
                  {t("returnedNotice")}
                </p>
                <RefundNotice totalTRY={order.totalTRY} />
              </div>
            </div>
          </div>
        )}

        {/* 5. Cancelled State View */}
        {order.status === "cancelled" && (
          <div className="rounded-lg border border-error/20 bg-error-muted/20 p-2.5 text-xs sm:rounded-xl sm:p-3.5">
            <div className="flex items-start gap-2 text-error sm:gap-2.5">
              <AlertCircle
                className="mt-0.5 size-3.5 shrink-0 sm:size-4"
                aria-hidden
              />
              <div className="space-y-1">
                <p className="font-medium text-[11px] sm:text-xs">
                  {cancelledLabel
                    ? t("cancelledWithDate", { date: cancelledLabel })
                    : t("cancelledNotice")}
                </p>
                <RefundNotice totalTRY={order.totalTRY} />
              </div>
            </div>
          </div>
        )}

        {/* Products Item List */}
        <div className="pt-1 sm:pt-2">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:mb-3 sm:text-xs">
            {t("items")}
          </p>
          <ul className="space-y-2.5 sm:space-y-3">
            {order.items.map((item, idx) => (
              <li
                key={`${order.id}-${item.name}-${idx}`}
                className="flex items-center gap-2.5 text-sm sm:gap-3"
              >
                {/* Product Thumbnail */}
                <div className="relative size-11 shrink-0 overflow-hidden rounded-md border border-border/60 bg-muted sm:size-14 sm:rounded-lg">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 44px, 56px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                      <Package className="size-4 sm:size-5" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="truncate text-xs font-medium text-foreground sm:text-sm">
                    {item.name || t("itemCount", { count: item.quantity })}
                  </p>
                  {(item.size || item.color) && (
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground sm:gap-2 sm:text-xs">
                      {item.size && <span>{item.size}</span>}
                      {item.size && item.color && <span>•</span>}
                      {item.color && <span>{item.color}</span>}
                    </div>
                  )}
                </div>

                {/* Quantity & Price */}
                <div className="shrink-0 text-end">
                  <span className="text-[11px] text-muted-foreground sm:text-xs">
                    ×{item.quantity}
                  </span>
                  {item.priceTRY != null && (
                    <ProductPrice
                      amountTRY={item.priceTRY}
                      className="text-[11px] font-medium text-foreground sm:text-xs"
                      iconClassName="size-3 sm:size-3.5"
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer / Summary & Actions */}
      <div className="flex flex-col gap-2.5 border-t border-border/60 bg-muted/15 px-3 py-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:p-4 md:p-5">
        <div className="flex items-baseline justify-between gap-3 sm:block sm:space-y-0.5">
          <span className="text-[11px] text-muted-foreground sm:text-xs">
            {t("itemCount", { count: order.itemCount })}
          </span>
          <p className="text-sm font-semibold text-foreground sm:text-base">
            <ProductPrice
              amountTRY={order.totalTRY}
              className="text-sm font-semibold text-foreground sm:text-base"
              iconClassName="size-3.5 sm:size-4"
            />
          </p>
        </div>

        {/* State-Tailored Quick Actions */}
        <div className="flex w-full flex-wrap items-center gap-1.5 sm:w-auto sm:gap-2">
          {order.status === "delivered" && (
            <Link
              href="/shop"
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "flex-1 gap-1.5 text-[11px] sm:flex-none sm:text-xs",
              })}
            >
              <RotateCcw className="size-3.5" aria-hidden />
              <span>{t("actions.buyAgain")}</span>
            </Link>
          )}

          {(order.status === "shipped" ||
            order.status === "in_transit" ||
            order.status === "out_for_delivery") &&
            order.tracking && (
              <Link
                href={`/me/orders/${order.id}`}
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className:
                    "flex-1 gap-1.5 text-[11px] text-info border-info/30 hover:bg-info-muted sm:flex-none sm:text-xs",
                })}
              >
                <Truck className="size-3.5" aria-hidden />
                <span>{t("actions.trackPackage")}</span>
              </Link>
            )}

          {(order.status === "processing" || order.status === "pending") && (
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
          )}

          {order.status === "failed" && (
            <Link
              href="/contact"
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className:
                  "flex-1 gap-1.5 text-[11px] text-destructive border-destructive/30 hover:bg-destructive/10 sm:flex-none sm:text-xs",
              })}
            >
              <HelpCircle className="size-3.5" aria-hidden />
              <span>{t("actions.contactSupport")}</span>
            </Link>
          )}

          {(order.status === "cancelled" || order.status === "returned") && (
            <Link
              href="/shop"
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "flex-1 gap-1.5 text-[11px] sm:flex-none sm:text-xs",
              })}
            >
              <ShoppingBag className="size-3.5" aria-hidden />
              <span>{t("actions.buyAgain")}</span>
            </Link>
          )}

          <Link
            href={`/me/orders/${order.id}`}
            className={buttonVariants({
              variant: isInProgress ? "default" : "outline",
              size: "sm",
              className: "flex-1 gap-1.5 text-[11px] sm:flex-none sm:text-xs",
            })}
          >
            <span>{t("actions.viewDetails")}</span>
            <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
