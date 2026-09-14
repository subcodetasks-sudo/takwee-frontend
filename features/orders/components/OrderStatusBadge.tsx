"use client";

import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  Clock,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "../types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const t = useTranslations("ProfilePage.orders.status");

  switch (status) {
    case "pending":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 dark:text-amber-400",
            className,
          )}
        >
          <Clock className="size-3.5 shrink-0" aria-hidden />
          <span>{t("pending")}</span>
        </Badge>
      );

    case "confirmed":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 border-info/30 bg-info-muted px-2.5 py-1 text-xs font-medium text-info",
            className,
          )}
        >
          <ShieldCheck className="size-3.5 shrink-0" aria-hidden />
          <span>{t("confirmed")}</span>
        </Badge>
      );

    case "processing":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 border-warning/30 bg-warning-muted px-2.5 py-1 text-xs font-medium text-warning",
            className,
          )}
        >
          <Sparkles className="size-3.5 shrink-0" aria-hidden />
          <span>{t("processing")}</span>
        </Badge>
      );

    case "shipped":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-600 dark:text-sky-400",
            className,
          )}
        >
          <PackageCheck className="size-3.5 shrink-0" aria-hidden />
          <span>{t("shipped")}</span>
        </Badge>
      );

    case "delivered":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 border-success/30 bg-success-muted px-2.5 py-1 text-xs font-medium text-success",
            className,
          )}
        >
          <CheckCircle2 className="size-3.5 shrink-0" aria-hidden />
          <span>{t("delivered")}</span>
        </Badge>
      );

    case "cancelled":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 border-error/30 bg-error-muted px-2.5 py-1 text-xs font-medium text-error",
            className,
          )}
        >
          <XCircle className="size-3.5 shrink-0" aria-hidden />
          <span>{t("cancelled")}</span>
        </Badge>
      );

    default:
      return (
        <Badge
          variant="outline"
          className={cn("gap-1.5 px-2.5 py-1 text-xs font-medium", className)}
        >
          <span>{String(status)}</span>
        </Badge>
      );
  }
}
