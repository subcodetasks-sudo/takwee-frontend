"use client";

import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ShopSort } from "../types";

interface ShopToolbarProps {
  resultCount: number;
  activeFilterCount: number;
  sort: ShopSort;
  onSortChange: (sort: ShopSort) => void;
  onClearFilters: () => void;
}

const SORT_OPTIONS: ShopSort[] = [
  "featured",
  "price-asc",
  "price-desc",
  "newest",
];

export function ShopToolbar({
  resultCount,
  activeFilterCount,
  sort,
  onSortChange,
  onClearFilters,
}: ShopToolbarProps) {
  const t = useTranslations("ShopPage");

  const sortItems = {
    featured: t("sort.featured"),
    "price-asc": t("sort.priceAsc"),
    "price-desc": t("sort.priceDesc"),
    newest: t("sort.newest"),
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
      <p className="text-sm text-muted-foreground">
        {t("catalog.results", { count: resultCount })}
      </p>

      <div className="hidden flex-wrap items-center gap-2 lg:flex">
        {activeFilterCount > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground"
          >
            <X data-icon="inline-start" />
            {t("catalog.clearAll")}
          </Button>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{t("sort.label")}</span>
          <Select
            value={sort}
            onValueChange={(value) => {
              if (value) onSortChange(value as ShopSort);
            }}
            items={sortItems}
          >
            <SelectTrigger
              size="sm"
              aria-label={t("sort.label")}
              className="min-w-44"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              side="bottom"
              sideOffset={6}
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
        </div>
      </div>
    </div>
  );
}
