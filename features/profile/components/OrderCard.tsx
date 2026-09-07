import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OrderStatus, OrderSummary } from "../types";

const STATUS_CLASS: Record<OrderStatus, string> = {
  delivered: "bg-success-muted text-success border-transparent",
  shipped: "bg-info-muted text-info border-transparent",
  processing: "bg-warning-muted text-warning border-transparent",
  cancelled: "bg-error-muted text-error border-transparent",
};

interface OrderCardProps {
  order: OrderSummary;
}

export async function OrderCard({ order }: OrderCardProps) {
  const t = await getTranslations("ProfilePage.orders");
  const locale = await getLocale();

  const placedLabel = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(order.placedAt));

  const totalLabel = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(order.totalTRY);

  return (
    <article className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold tracking-tight text-foreground">
            {t("orderNumber", { number: order.number })}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("placedOn", { date: placedLabel })}
          </p>
        </div>
        <Badge
          variant="outline"
          className={cn("font-medium capitalize", STATUS_CLASS[order.status])}
        >
          {t(`status.${order.status}`)}
        </Badge>
      </div>

      <ul className="mt-4 space-y-1.5 border-t border-border/70 pt-3">
        {order.items.map((item) => (
          <li
            key={`${order.id}-${item.name}`}
            className="flex items-center justify-between gap-3 text-sm text-foreground/90"
          >
            <span className="truncate">{item.name}</span>
            <span className="shrink-0 text-xs text-muted-foreground">
              ×{item.quantity}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-3">
        <span className="text-xs text-muted-foreground">
          {t("itemCount", { count: order.itemCount })}
        </span>
        <span className="text-sm font-semibold text-foreground">{totalLabel}</span>
      </div>
    </article>
  );
}
