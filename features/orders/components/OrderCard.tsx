"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  AlertCircle,
  ArrowRight,
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

  const formatDate = (dateStr: string, withTime = false) => {
    try {
      const normalized = dateStr.includes("T")
        ? dateStr
        : dateStr.replace(" ", "T");
      return new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
        ...(withTime
          ? { hour: "numeric", minute: "2-digit" as const }
          : {}),
      }).format(new Date(normalized));
    } catch {
      return dateStr;
    }
  };

  const placedLabel = formatDate(order.placedAt);
  const cancelledLabel = order.cancelledAt
    ? formatDate(order.cancelledAt, true)
    : null;

  const isInProgress =
    order.status === "pending" ||
    order.status === "confirmed" ||
    order.status === "processing" ||
    order.status === "shipped";

  const showTracker = isInProgress || order.status === "delivered";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-xl border transition-all duration-300 sm:rounded-2xl",
        // State-specific card styling
        order.status === "pending" &&
          "border-amber-500/30 bg-card shadow-xs hover:border-amber-500/50",
        order.status === "confirmed" &&
          "border-info/40 bg-card shadow-xs hover:border-info/60",
        order.status === "processing" &&
          "border-warning/40 bg-card shadow-xs hover:border-warning/60",
        order.status === "shipped" &&
          "border-sky-500/30 bg-card shadow-xs hover:border-sky-500/50",
        order.status === "delivered" &&
          "border-border bg-card hover:border-border/90 hover:shadow-2xs",
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

        {order.status !== "delivered" && (
          <OrderStatusBadge
            status={order.status}
            className="shrink-0 px-2 py-0.5 text-[11px] sm:px-2.5 sm:py-1 sm:text-xs"
          />
        )}
      </div>

      {/* STATE-SPECIFIC UNIQUE VIEWS */}
      <div className="space-y-3 p-3 sm:space-y-4 sm:p-4 md:p-5">
        {/* Tracker: in-progress + delivered (full-width stepper; no separate delivered badge) */}
        {showTracker && (
          <OrderTracker tracking={order.tracking} status={order.status} />
        )}

        {/* Cancelled State View */}
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
                {order.cancellationReason && (
                  <p className="text-[10px] text-muted-foreground sm:text-xs">
                    {order.cancellationReason}
                  </p>
                )}
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

          {order.status === "shipped" && order.tracking && (
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

          {(order.status === "processing" ||
            order.status === "pending" ||
            order.status === "confirmed") && (
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

          {order.status === "cancelled" && (
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
