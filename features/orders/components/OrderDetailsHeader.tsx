"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Receipt } from "lucide-react";
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
import type { OrderSummary } from "../types";
import { OrderReceiptDialog } from "./OrderReceiptDialog";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrderDetailsHeaderProps {
  order: OrderSummary;
}

export function OrderDetailsHeader({ order }: OrderDetailsHeaderProps) {
  const t = useTranslations("ProfilePage.orders");
  const locale = useLocale();
  const { copied, copy } = useCopyToClipboard();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleCopyOrderNumber = async () => {
    const ok = await copy(order.number);
    if (ok) setTooltipOpen(true);
  };

  const placedLabel = (() => {
    try {
      return new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(order.placedAt));
    } catch {
      return order.placedAt;
    }
  })();

  return (
    <div className="flex flex-wrap items-start justify-between gap-2.5 sm:gap-4">
      <div className="min-w-0 space-y-1 sm:space-y-2">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <h1 className="font-mono text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">
            {t("orderNumber", { number: order.number })}
          </h1>
          <TooltipProvider delay={100}>
            <Tooltip open={copied || tooltipOpen} onOpenChange={setTooltipOpen}>
              <AnimateIcon animateOnHover className="inline-flex">
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      onClick={handleCopyOrderNumber}
                      className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:size-8"
                      aria-label={
                        copied ? t("orderNumberCopied") : t("copyOrderNumber")
                      }
                    />
                  }
                >
                  {copied ? (
                    <CheckIcon
                      size={16}
                      animate
                      className="text-success"
                      aria-hidden
                    />
                  ) : (
                    <Copy size={16} aria-hidden />
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

          <OrderReceiptDialog
            order={order}
            trigger={
              <button
                type="button"
                className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border/70 bg-background px-2 text-xs font-medium text-foreground shadow-2xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:h-8 sm:gap-2 sm:px-2.5 sm:text-sm"
              >
                <Receipt
                  className="size-3.5 shrink-0 text-primary-700 sm:size-4 dark:text-primary-400"
                  aria-hidden
                />
                <span>{t("actions.viewReceipt")}</span>
              </button>
            }
          />
        </div>
        <p className="text-xs text-muted-foreground sm:text-sm">
          {t("placedOn", { date: placedLabel })}
        </p>
      </div>

      {order.status !== "delivered" && (
        <OrderStatusBadge
          status={order.status}
          className="shrink-0 px-2 py-0.5 text-[11px] sm:px-2.5 sm:py-1 sm:text-sm"
        />
      )}
    </div>
  );
}
