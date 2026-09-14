"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  PackageCheck,
  RotateCcw,
  Sparkles,
  Truck,
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
  { key: "placed", labelKey: "tracker.placed", icon: Package },
  { key: "processing", labelKey: "tracker.processing", icon: Sparkles },
  { key: "shipped", labelKey: "tracker.shipped", icon: PackageCheck },
  { key: "in_transit", labelKey: "tracker.in_transit", icon: Truck },
  { key: "out_for_delivery", labelKey: "tracker.out_for_delivery", icon: MapPin },
  { key: "delivered", labelKey: "tracker.delivered", icon: CheckCircle2 },
];

function getStepIndexForStatus(status: OrderStatus): number {
  switch (status) {
    case "pending":
      return 0;
    case "processing":
      return 1;
    case "shipped":
      return 2;
    case "in_transit":
      return 3;
    case "out_for_delivery":
      return 4;
    case "delivered":
      return 5;
    default:
      return 0;
  }
}

export function OrderTracker({ tracking, status, className }: OrderTrackerProps) {
  const t = useTranslations("ProfilePage.orders");
  const locale = useLocale();
  const { copied, copy } = useCopyToClipboard();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // If status is an exception / terminal non-delivery state (failed, returned, cancelled)
  const isException =
    status === "failed" || status === "returned" || status === "cancelled";

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

  if (isException) {
    const isFailed = status === "failed";
    const isReturned = status === "returned";

    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className={cn(
          "rounded-lg border p-3 sm:rounded-xl sm:p-4",
          isFailed && "border-destructive/30 bg-destructive/10 text-destructive",
          isReturned && "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-400",
          !isFailed && !isReturned && "border-error/30 bg-error-muted text-error",
          className,
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background/80 shadow-2xs sm:size-8 sm:rounded-lg">
              {isFailed ? (
                <AlertTriangle className="size-4 text-destructive" />
              ) : isReturned ? (
                <RotateCcw className="size-4 text-orange-600 dark:text-orange-400" />
              ) : (
                <XCircle className="size-4 text-error" />
              )}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground sm:text-sm">
                {isFailed
                  ? t("failedNotice")
                  : isReturned
                    ? t("returnedNotice")
                    : t("cancelledNotice")}
              </p>
              <p className="text-[10px] text-muted-foreground sm:text-[11px]">
                {isFailed
                  ? t("tracker.failedNotice")
                  : isReturned
                    ? t("tracker.returnedNotice")
                    : t("cancelledNotice")}
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

  // Active progression status (pending, processing, shipped, in_transit, out_for_delivery, delivered)
  const currentStepIndex = getStepIndexForStatus(status);
  const currentStepConfig = TRACKING_STEPS[currentStepIndex] || TRACKING_STEPS[0];
  const CurrentIcon = currentStepConfig.icon;

  const getNoticeForStatus = () => {
    switch (status) {
      case "pending":
        return t("tracker.pendingNotice");
      case "processing":
        return t("tracker.processingNotice");
      case "shipped":
        return t("tracker.shippedNotice");
      case "in_transit":
        return t("tracker.inTransitNotice");
      case "out_for_delivery":
        return t("tracker.outForDeliveryNotice");
      case "delivered":
        return t("tracker.deliveredNotice");
      default:
        return t("tracker.processingNotice");
    }
  };

  const activeNotice = getNoticeForStatus();


  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
      className={cn(
        "rounded-lg border border-secondary/20 bg-linear-to-r from-secondary/15 via-secondary/10 to-muted/40 p-2.5 sm:rounded-xl sm:p-5",
        className,
      )}
    >
      {/* Header of Track Line */}
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 sm:mb-5 sm:gap-2.5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary/15 text-secondary shadow-2xs sm:size-8 sm:rounded-lg">
            <CurrentIcon className="size-4 animate-bounce sm:size-4.5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground sm:text-sm">
              {t(currentStepConfig.labelKey)}
            </p>
            {formattedEstimatedDelivery ? (
              <p className="text-[10px] text-muted-foreground sm:text-[11px]">
                {t("tracker.estimatedArrival", { date: formattedEstimatedDelivery })}
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

      {/* Stepper Bar */}
      <div className="relative pt-1 sm:pt-2">
        <div className="flex justify-between">
          {TRACKING_STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const StepIcon = step.icon;

            return (
              <div
                key={step.key}
                className="flex flex-1 flex-col items-center px-0.5 text-center"
              >
                {/* Connector line container - exactly aligned with the circle's vertical and horizontal center */}
                <div className="relative flex w-full items-center justify-center">
                  {/* Line connecting to previous step */}
                  {index > 0 && (
                    <div
                      className={cn(
                        "absolute start-0 end-1/2 top-1/2 h-0.5 -translate-y-1/2 sm:h-1 transition-colors duration-500",
                        index <= currentStepIndex
                          ? "bg-secondary"
                          : "bg-border/60",
                      )}
                    />
                  )}

                  {/* Line connecting to next step */}
                  {index < TRACKING_STEPS.length - 1 && (
                    <div
                      className={cn(
                        "absolute start-1/2 end-0 top-1/2 h-0.5 -translate-y-1/2 sm:h-1 transition-colors duration-500",
                        index < currentStepIndex
                          ? "bg-secondary"
                          : "bg-border/60",
                      )}
                    />
                  )}

                  {/* Step Node */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={cn(
                      "relative z-10 flex size-6 items-center justify-center rounded-full border-2 transition-all duration-300 sm:size-8 md:size-9",
                      isCompleted
                        ? "border-secondary bg-secondary text-secondary-foreground shadow-xs"
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

                    {/* Ripple animation on current active step */}
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
                        ? "text-foreground"
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
