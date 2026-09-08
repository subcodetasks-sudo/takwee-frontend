"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Check,
  Clock,
  Package,
  PackageCheck,
  Truck,
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
import type { OrderStatus, OrderTrackingInfo } from "../types";

interface OrderTrackerProps {
  tracking?: OrderTrackingInfo;
  status: OrderStatus;
  className?: string;
}

interface TrackingStepConfig {
  key: "placed" | "tailoring" | "shipped" | "delivered";
  labelKey: string;
  icon: typeof Package;
}

const TRACKING_STEPS: TrackingStepConfig[] = [
  { key: "placed", labelKey: "tracker.placed", icon: Package },
  { key: "tailoring", labelKey: "tracker.tailoring", icon: Clock },
  { key: "shipped", labelKey: "tracker.shipped", icon: Truck },
  { key: "delivered", labelKey: "tracker.delivered", icon: PackageCheck },
];

export function OrderTracker({ tracking, status, className }: OrderTrackerProps) {
  const t = useTranslations("ProfilePage.orders");
  const locale = useLocale();
  const { copied, copy } = useCopyToClipboard();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // Map status to current step index (0: placed, 1: tailoring/processing, 2: shipped, 3: delivered)
  const currentStepIndex =
    status === "delivered"
      ? 3
      : status === "shipped"
      ? 2
      : status === "processing"
      ? 1
      : 0;

  const currentStepConfig = TRACKING_STEPS[currentStepIndex] || TRACKING_STEPS[0];
  const CurrentIcon = currentStepConfig.icon;

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
      className={cn(
        "rounded-lg border border-secondary/20 bg-linear-to-r from-secondary/15 via-secondary/10 to-muted/40 p-2.5 sm:rounded-xl sm:p-5",
        className
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
                {status === "shipped"
                  ? t("tracker.inTransitNotice")
                  : t("tracker.processingNotice")}
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
      <div className="relative pb-0.5 pt-1.5 sm:pb-1 sm:pt-2">
        {/* Background Line */}
        <div className="absolute start-4 end-4 top-4 h-0.5 -translate-y-1/2 rounded-full bg-border/60 sm:start-6 sm:end-6 sm:top-6 sm:h-1" />

        {/* Filled Active Line with Motion */}
        <motion.div
          className="absolute start-4 top-4 h-0.5 -translate-y-1/2 rounded-full bg-secondary sm:start-6 sm:top-6 sm:h-1"
          initial={{ width: "0%" }}
          animate={{
            width:
              currentStepIndex === 0
                ? "0%"
                : currentStepIndex === 1
                ? "33.33%"
                : currentStepIndex === 2
                ? "66.66%"
                : "100%",
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {/* Steps Nodes */}
        <div className="relative flex justify-between">
          {TRACKING_STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const StepIcon = step.icon;

            return (
              <div
                key={step.key}
                className="flex flex-1 flex-col items-center px-0.5 text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={cn(
                    "relative flex size-6.5 items-center justify-center rounded-full border-2 transition-all duration-300 sm:size-9",
                    isCompleted
                      ? "border-secondary bg-secondary text-secondary-foreground shadow-xs"
                      : isCurrent
                      ? "border-secondary bg-card text-secondary ring-2 ring-secondary/20 sm:ring-4"
                      : "border-border/80 bg-muted/80 text-muted-foreground/60"
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-3 stroke-[3] sm:size-4" />
                  ) : (
                    <StepIcon
                      className={cn(
                        "size-3 sm:size-4",
                        isCurrent && "animate-pulse text-secondary"
                      )}
                    />
                  )}

                  {/* Ripple animation on current active step */}
                  {isCurrent && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-secondary/25" />
                  )}
                </motion.div>

                <p
                  className={cn(
                    "mt-1 line-clamp-2 w-full text-[9px] font-medium leading-tight sm:mt-2 sm:text-xs",
                    isCurrent
                      ? "font-bold text-secondary"
                      : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground/70"
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


