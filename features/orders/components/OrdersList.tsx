"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Truck, CheckCircle2, XCircle, PackageOpen, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderSummary } from "../types";
import { OrderCard } from "./OrderCard";


type FilterTab = "all" | "active" | "delivered" | "cancelled";

interface OrdersListProps {
  orders: OrderSummary[];
}

export function OrdersList({ orders }: OrdersListProps) {
  const t = useTranslations("ProfilePage.orders");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const counts = useMemo(() => {
    return {
      all: orders.length,
      active: orders.filter((o) => o.status === "shipped" || o.status === "processing").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    switch (activeFilter) {
      case "active":
        return orders.filter((o) => o.status === "shipped" || o.status === "processing");
      case "delivered":
        return orders.filter((o) => o.status === "delivered");
      case "cancelled":
        return orders.filter((o) => o.status === "cancelled");
      case "all":
      default:
        return orders;
    }
  }, [orders, activeFilter]);

  const tabs: { key: FilterTab; label: string; count: number; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "all", label: t("filters.all"), count: counts.all, icon: PackageOpen },
    { key: "active", label: t("filters.active"), count: counts.active, icon: Truck },
    { key: "delivered", label: t("filters.delivered"), count: counts.delivered, icon: CheckCircle2 },
    { key: "cancelled", label: t("filters.cancelled"), count: counts.cancelled, icon: XCircle },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Status Filter Tabs — horizontal scroll on narrow screens */}
      <div className="-mx-1 overflow-x-auto border-b border-border/60 pb-2.5 sm:mx-0 sm:overflow-visible sm:pb-3">
        <div className="flex w-max min-w-full items-center gap-1.5 px-1 sm:w-auto sm:flex-wrap sm:gap-2 sm:px-0">
          {tabs.map((tab) => {
            const isActive = activeFilter === tab.key;
            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveFilter(tab.key)}
                className={cn(
                  "group relative inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:gap-2 sm:px-3.5 sm:py-1.5 sm:text-xs",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "size-3 transition-colors sm:size-3.5",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}
                  aria-hidden
                />
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "inline-flex size-4 items-center justify-center rounded-full text-[10px] font-semibold transition-colors sm:size-4.5",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-background/80 text-muted-foreground"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List / Filter Empty State */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-8 text-center sm:rounded-2xl sm:px-6 sm:py-12">
          <PackageOpen className="mx-auto size-8 text-muted-foreground/50 sm:size-10" />
          <p className="mt-2.5 text-sm font-medium text-foreground sm:mt-3">
            {t("filters.emptyFilter")}
          </p>
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline underline-offset-4 sm:mt-4"
          >
            <RotateCcw className="size-3.5" />
            <span>{t("filters.showAll")}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <OrderCard order={order} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
