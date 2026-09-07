"use client";

import { useTranslations } from "next-intl";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ShopSort } from "../types";

const SORT_OPTIONS: ShopSort[] = [
  "featured",
  "price-asc",
  "price-desc",
  "newest",
];

interface ShopMobileFilterBarProps {
  activeFilterCount: number;
  sort: ShopSort;
  onSortChange: (sort: ShopSort) => void;
  onOpenFilters: () => void;
  onClearFilters: () => void;
  className?: string;
}

export function ShopMobileFilterBar({
  activeFilterCount,
  sort,
  onSortChange,
  onOpenFilters,
  onClearFilters,
  className,
}: ShopMobileFilterBarProps) {
  const t = useTranslations("ShopPage");

  const sortItems = {
    featured: t("sort.featured"),
    "price-asc": t("sort.priceAsc"),
    "price-desc": t("sort.priceDesc"),
    newest: t("sort.newest"),
  };

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-[60] lg:hidden",
        "border-t border-border bg-background/95 backdrop-blur-md",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        className,
      )}
    >
      <div className="page-shell flex items-center gap-2 py-3">
        <Button
          type="button"
          variant="default"
          size="lg"
          className="relative min-w-0 flex-1"
          aria-label={t("catalog.filters")}
          onClick={onOpenFilters}
        >
          <SlidersHorizontal data-icon="inline-start" />
          {t("catalog.filters")}
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="ms-1 size-5 justify-center rounded-full bg-primary-foreground/15 p-0 text-[0.65rem] text-primary-foreground"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        <Select
          value={sort}
          onValueChange={(value) => {
            if (value) onSortChange(value as ShopSort);
          }}
          items={sortItems}
        >
          <SelectTrigger
            size="default"
            aria-label={t("sort.label")}
            className="h-9 min-w-0 flex-1 border-border bg-background"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            side="top"
            sideOffset={10}
            align="end"
            alignItemWithTrigger={false}
            className="min-w-(--anchor-width)"
          >
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {sortItems[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {activeFilterCount > 0 && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={t("catalog.clearAll")}
            onClick={onClearFilters}
            className="shrink-0"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
