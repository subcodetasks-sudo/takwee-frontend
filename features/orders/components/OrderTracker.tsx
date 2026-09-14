"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Check,
  CheckCircle2,
  Clock,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
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
import type { OrderStatus, OrderTrackingInfo, TrackingStepKey } from "../types";

interface OrderTrackerProps {
  tracking?: OrderTrackingInfo;
  status: OrderStatus;
  className?: string;
}

interface TrackingStepConfig {
  key: TrackingStepKey;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TRACKING_STEPS: TrackingStepConfig[] = [
  { key: "pending", labelKey: "tracker.pending", icon: Clock },
  { key: "confirmed", labelKey: "tracker.confirmed", icon: ShieldCheck },
  { key: "processing", labelKey: "tracker.processing", icon: Sparkles },
  { key: "shipped", labelKey: "tracker.shipped", icon: PackageCheck },
  { key: "delivered", labelKey: "tracker.delivered", icon: CheckCircle2 },
];

function getStepIndexForStatus(status: OrderStatus): number {
  switch (status) {
    case "pending":
      return 0;
    case "confirmed":
      return 1;
    case "processing":
      return 2;
    case "shipped":
      return 3;
    case "delivered":
      return 4;
    default:
      return 0;
  }
}

export function OrderTracker({ tracking, status, className }: OrderTrackerProps) {
  const t = useTranslations("ProfilePage.orders");
  const locale = useLocale();
  const { copied, copy } = useCopyToClipboard();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const isCancelled = status === "cancelled";

  const handleCopyTracking = async () => {
    if (!tracking?.trackingNumber) return;
    const ok = await copy(tracking.trackingNumber);
    if (ok) setTooltipOpen(true);
  };

  const formattedEstimatedDelivery = tracking?.estimatedDelivery
    ? new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(tracking.estimatedDelivery))
    : null;

  if (isCancelled) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className={cn(
          "w-full rounded-lg border border-error/30 bg-error-muted p-3 text-error sm:rounded-xl sm:p-4",
          className,
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background/80 shadow-2xs sm:size-8 sm:rounded-lg">
              <XCircle className="size-4 text-error" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground sm:text-sm">
                {t("cancelledNotice")}
              </p>
              <p className="text-[10px] text-muted-foreground sm:text-[11px]">
                {t("tracker.cancelledNotice")}
              </p>
            </div>
          </div>

          {tracking?.trackingNumber && (
            <div className="flex items-center gap-1.5 sm:gap-2">
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
                          onClick={handleCopyTracking}
                          className="group inline-flex max-w-full items-center gap-1 rounded-md border border-border/60 bg-background/90 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground transition-all hover:border-border hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:gap-1.5 sm:px-2 sm:text-[11px]"
                          aria-label={
                            copied
                              ? t("tracker.trackingCopied")
                              : t("tracker.copyTrackingNumber")
                          }
                        />
                      }
                    >
                      <bdi className="truncate">{tracking.trackingNumber}</bdi>
                      {copied ? (
                        <CheckIcon
                          size={12}
                          animate
                          className="shrink-0 text-success"
                          aria-hidden
                        />
                      ) : (
                        <Copy
                          size={12}
                          className="shrink-0 opacity-60 transition-opacity group-hover:opacity-100"
                          aria-hidden
                        />
                      )}
                    </TooltipTrigger>
                  </AnimateIcon>
                  <TooltipContent
                    side="top"
                    sideOffset={6}
                    className="text-xs font-medium"
                  >
                    {copied
                      ? t("tracker.trackingCopied")
                      : t("tracker.copyTrackingNumber")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Active progression: pending → confirmed → processing → shipped → delivered
  const currentStepIndex = getStepIndexForStatus(status);
  const isDelivered = status === "delivered";
  const currentStepConfig = TRACKING_STEPS[currentStepIndex] || TRACKING_STEPS[0];
  const CurrentIcon = currentStepConfig.icon;

  const getNoticeForStatus = () => {
    switch (status) {
      case "pending":
        return t("tracker.pendingNotice");
      case "confirmed":
        return t("tracker.confirmedNotice");
      case "processing":
        return t("tracker.processingNotice");
      case "shipped":
        return t("tracker.shippedNotice");
      case "delivered":
        return t("tracker.deliveredNotice");
      default:
        return t("tracker.pendingNotice");
    }
  };

  const activeNotice = getNoticeForStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
      className={cn(
        "w-full rounded-lg border p-2.5 sm:rounded-xl sm:p-5",
        isDelivered
          ? "border-success/25 bg-linear-to-r from-success-muted/40 via-success-muted/20 to-muted/40"
          : "border-secondary/20 bg-linear-to-r from-secondary/15 via-secondary/10 to-muted/40",
        className,
      )}
    >
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 sm:mb-5 sm:gap-2.5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-md shadow-2xs sm:size-8 sm:rounded-lg",
              isDelivered
                ? "bg-success/15 text-success"
                : "bg-secondary/15 text-secondary",
            )}
          >
            <CurrentIcon
              className={cn(
                "size-4 sm:size-4.5",
                !isDelivered && "animate-bounce",
              )}
            />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground sm:text-sm">
              {t(currentStepConfig.labelKey)}
            </p>
            {formattedEstimatedDelivery && !isDelivered ? (
              <p className="text-[10px] text-muted-foreground sm:text-[11px]">
                {t("tracker.estimatedArrival", {
                  date: formattedEstimatedDelivery,
                })}
              </p>
            ) : (
              <p className="text-[10px] text-muted-foreground sm:text-[11px]">
                {activeNotice}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {tracking?.carrier && (
            <span className="rounded-md border border-border/60 bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:px-2 sm:text-[11px]">
              {t("tracker.carrier", { carrier: tracking.carrier })}
            </span>
          )}
          {tracking?.trackingNumber && (
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
                        onClick={handleCopyTracking}
                        className="group inline-flex max-w-full items-center gap-1 rounded-md border border-border/60 bg-background/80 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground transition-all hover:border-border hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:gap-1.5 sm:px-2 sm:text-[11px]"
                        aria-label={
                          copied
                            ? t("tracker.trackingCopied")
                            : t("tracker.copyTrackingNumber")
                        }
                      />
                    }
                  >
                    <bdi className="truncate">{tracking.trackingNumber}</bdi>
                    {copied ? (
                      <CheckIcon
                        size={12}
                        animate
                        className="shrink-0 text-success"
                        aria-hidden
                      />
                    ) : (
                      <Copy
                        size={12}
                        className="shrink-0 opacity-60 transition-opacity group-hover:opacity-100"
                        aria-hidden
                      />
                    )}
                  </TooltipTrigger>
                </AnimateIcon>
                <TooltipContent
                  side="top"
                  sideOffset={6}
                  className="text-xs font-medium"
                >
                  {copied
                    ? t("tracker.trackingCopied")
                    : t("tracker.copyTrackingNumber")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      <div className="relative w-full pt-1 sm:pt-2">
        <div className="flex w-full justify-between">
          {TRACKING_STEPS.map((step, index) => {
            const isCompleted = isDelivered || index < currentStepIndex;
            const isCurrent = !isDelivered && index === currentStepIndex;
            const StepIcon = step.icon;

            return (
              <div
                key={step.key}
                className="flex flex-1 flex-col items-center px-0.5 text-center"
              >
                <div className="relative flex w-full items-center justify-center">
                  {index > 0 && (
                    <div
                      className={cn(
                        "absolute start-0 end-1/2 top-1/2 h-0.5 -translate-y-1/2 transition-colors duration-500 sm:h-1",
                        index <= currentStepIndex || isDelivered
                          ? isDelivered
                            ? "bg-success"
                            : "bg-secondary"
                          : "bg-border/60",
                      )}
                    />
                  )}

                  {index < TRACKING_STEPS.length - 1 && (
                    <div
                      className={cn(
                        "absolute start-1/2 end-0 top-1/2 h-0.5 -translate-y-1/2 transition-colors duration-500 sm:h-1",
                        index < currentStepIndex || isDelivered
                          ? isDelivered
                            ? "bg-success"
                            : "bg-secondary"
                          : "bg-border/60",
                      )}
                    />
                  )}

                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={cn(
                      "relative z-10 flex size-6 items-center justify-center rounded-full border-2 transition-all duration-300 sm:size-8 md:size-9",
                      isCompleted
                        ? isDelivered
                          ? "border-success bg-success text-success-foreground shadow-xs"
                          : "border-secondary bg-secondary text-secondary-foreground shadow-xs"
                        : isCurrent
                          ? "border-secondary bg-card text-secondary ring-2 ring-secondary/20 sm:ring-4"
                          : "border-border/80 bg-card text-muted-foreground/60 dark:bg-card",
                    )}
                  >
                    {isCompleted ? (
                      <Check className="size-2.5 stroke-[3] sm:size-3.5 md:size-4" />
                    ) : (
                      <StepIcon
                        className={cn(
                          "size-2.5 sm:size-3.5 md:size-4",
                          isCurrent && "animate-pulse text-secondary",
                        )}
                      />
                    )}

                    {isCurrent && (
                      <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-secondary/25" />
                    )}
                  </motion.div>
                </div>

                <p
                  className={cn(
                    "mt-1.5 line-clamp-2 w-full text-[8px] font-medium leading-tight sm:mt-2 sm:text-[11px] md:text-xs",
                    isCurrent
                      ? "font-bold text-secondary"
                      : isCompleted
                        ? isDelivered
                          ? "text-success"
                          : "text-foreground"
                        : "text-muted-foreground/70",
                  )}
                >
                  {t(step.labelKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
