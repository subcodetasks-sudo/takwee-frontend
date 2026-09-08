"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, Clock, Truck, XCircle } from "lucide-react";
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
    case "delivered":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 border-success/30 bg-success-muted px-2.5 py-1 text-xs font-medium text-success",
            className
          )}
        >
          <CheckCircle2 className="size-3.5" aria-hidden />
          <span>{t("delivered")}</span>
        </Badge>
      );

    case "shipped":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 border-info/30 bg-info-muted px-2.5 py-1 text-xs font-medium text-info",
            className
          )}
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-info opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-info" />
          </span>
          <Truck className="size-3.5" aria-hidden />
          <span>{t("shipped")}</span>
        </Badge>
      );

    case "processing":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 border-warning/30 bg-warning-muted px-2.5 py-1 text-xs font-medium text-warning",
            className
          )}
        >
          <Clock className="size-3.5" aria-hidden />
          <span>{t("processing")}</span>
        </Badge>
      );

    case "cancelled":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 border-error/30 bg-error-muted px-2.5 py-1 text-xs font-medium text-error",
            className
          )}
        >
          <XCircle className="size-3.5" aria-hidden />
          <span>{t("cancelled")}</span>
        </Badge>
      );
  }
}
