"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  Clock,
  PackageCheck,
  PackageOpen,
  RotateCcw,
  Search,
  SearchX,
  ShieldCheck,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "../types";
import { useOrders } from "../hooks/useOrders";
import { OrderCard } from "./OrderCard";

type FilterTab = "all" | OrderStatus;

export function OrdersList() {
  const t = useTranslations("ProfilePage.orders");
  const { orders, isLoading, isError, refetch } = useOrders();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const searchedOrders = useMemo(() => {
    const raw = searchQuery.trim().toLowerCase();
    if (!raw) return orders;
    const clean = raw.replace(/^#/, "");
    const numericQuery = clean.replace(/\D/g, "");

    return orders.filter((o) => {
      const numberLower = o.number.toLowerCase();
      const idLower = o.id.toLowerCase();
      const numberDigits = o.number.replace(/\D/g, "");

      // Match by order number (e.g. "LL-2048", "2048")
      if (numberLower.includes(clean)) return true;
      // Match by internal ID (e.g. "ord-1", "1")
      if (idLower.includes(clean)) return true;
      // Match digits-only (e.g. searching "2048" matches "LL-2048")
      if (numericQuery && numberDigits && numberDigits.includes(numericQuery)) {
        return true;
      }
      // Also match items inside the order
      if (o.items.some((item) => item.name?.toLowerCase().includes(clean))) {
        return true;
      }

      return false;
    });
  }, [orders, searchQuery]);

  const counts = useMemo(() => {
    const c: Record<FilterTab, number> = {
      all: searchedOrders.length,
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    for (const o of searchedOrders) {
      if (c[o.status] !== undefined) {
        c[o.status] += 1;
      }
    }
    return c;
  }, [searchedOrders]);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return searchedOrders;
    return searchedOrders.filter((o) => o.status === activeFilter);
  }, [searchedOrders, activeFilter]);

  const allTabs: {
    key: FilterTab;
    label: string;
    count: number;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { key: "all", label: t("filters.all"), count: counts.all, icon: PackageOpen },
    {
      key: "pending",
      label: t("filters.pending"),
      count: counts.pending,
      icon: Clock,
    },
    {
      key: "confirmed",
      label: t("filters.confirmed"),
      count: counts.confirmed,
      icon: ShieldCheck,
    },
    {
      key: "processing",
      label: t("filters.processing"),
      count: counts.processing,
      icon: Sparkles,
    },
    {
      key: "shipped",
      label: t("filters.shipped"),
      count: counts.shipped,
      icon: PackageCheck,
    },
    {
      key: "delivered",
      label: t("filters.delivered"),
      count: counts.delivered,
      icon: CheckCircle2,
    },
    {
      key: "cancelled",
      label: t("filters.cancelled"),
      count: counts.cancelled,
      icon: XCircle,
    },
  ];

  if (isError && orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center sm:rounded-2xl sm:px-6 sm:py-14">
        <p className="text-sm font-medium text-foreground sm:text-base">
          {t("loadError.title")}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("loadError.description")}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => void refetch()}
          className="mt-4 text-xs sm:mt-5"
        >
          {t("loadError.retry")}
        </Button>
      </div>
    );
  }

  if (isLoading && orders.length === 0) {
    return (
      <div className="space-y-4" aria-busy="true">
        <div className="h-10 w-full rounded-xl bg-muted animate-pulse" />
        <div className="flex gap-2 border-b border-border/60 pb-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-7 w-20 rounded-full bg-muted animate-pulse sm:w-24"
            />
          ))}
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/60 bg-card p-4 space-y-4 sm:rounded-2xl sm:p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-4">
              <div className="space-y-1">
                <div className="h-5 w-32 rounded bg-muted animate-pulse" />
                <div className="h-3.5 w-24 rounded bg-muted/70 animate-pulse" />
              </div>
              <div className="h-6 w-24 rounded-full bg-muted animate-pulse" />
            </div>
            <div className="flex gap-4">
              <div className="size-14 shrink-0 rounded-lg bg-muted animate-pulse sm:size-16" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                <div className="h-3.5 w-1/3 rounded bg-muted/70 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center sm:px-6 sm:py-14">
        <p className="text-sm font-medium text-foreground">{t("empty.title")}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("empty.description")}
        </p>
        <Link
          href="/shop"
          className="mt-4 inline-flex text-sm font-medium text-primary-800 underline-offset-4 hover:underline dark:text-primary-300"
        >
          {t("empty.cta")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search Input Bar */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70"
          aria-hidden
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("search.placeholder")}
          className="h-10 w-full rounded-xl border border-border/70 bg-card ps-9 pe-9 text-xs text-foreground placeholder:text-muted-foreground/60 transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs sm:h-11 sm:ps-10 sm:text-sm"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute end-2.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label={t("search.clear")}
          >
            <X className="size-3.5" aria-hidden />
          </button>
        )}
      </div>

      {/* Active Search Result Feedback */}
      {searchQuery.trim() && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-0.5">
          <span>
            {t("search.resultsCount", { count: filteredOrders.length })}
          </span>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-xs font-medium text-primary hover:underline underline-offset-4"
          >
            {t("search.clear")}
          </button>
        </div>
      )}

      {/* Responsive Filter Tab Strip */}
      <div className="-mx-2 overflow-x-auto px-2 pb-2.5 scrollbar-none sm:mx-0 sm:px-0 sm:overflow-visible sm:pb-3 border-b border-border/60">
        <div className="flex w-max min-w-full items-center gap-1.5 sm:w-auto sm:flex-wrap sm:gap-2">
          {allTabs.map((tab) => {
            const isActive = activeFilter === tab.key;
            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveFilter(tab.key)}
                className={cn(
                  "group relative inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "size-3 shrink-0 transition-colors sm:size-3.5",
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                  aria-hidden
                />
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "inline-flex h-4 min-w-4 px-1 items-center justify-center rounded-full text-[10px] font-semibold transition-colors sm:h-4.5 sm:min-w-4.5",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-background/80 text-muted-foreground",
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtered Orders or Empty Search / Filter State */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-8 text-center sm:rounded-2xl sm:px-6 sm:py-12">
          {searchQuery.trim() ? (
            <>
              <SearchX className="mx-auto size-8 text-muted-foreground/50 sm:size-10" />
              <p className="mt-2.5 text-sm font-medium text-foreground sm:mt-3">
                {t("search.noResultsTitle")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("search.noResultsDescription", { query: searchQuery.trim() })}
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline underline-offset-4 sm:mt-4"
              >
                <RotateCcw className="size-3.5" />
                <span>{t("search.clear")}</span>
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
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
