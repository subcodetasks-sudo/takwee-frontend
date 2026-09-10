"use client";

import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DirectionProvider } from "@/components/ui/direction";
import { cn } from "@/lib/utils";
import {
  PRODUCT_SWATCH_CLASSES,
  type ProductBadge,
} from "@/features/product/types";
import { ProductPrice } from "@/features/product";
import type {
  ShopCategoryOption,
  ShopColorOption,
  ShopFilterState,
  ShopPriceBounds,
} from "../types";
import { toggleListValue } from "../utils/filter-products";

interface ShopFilterPanelProps {
  filters: ShopFilterState;
  bounds: ShopPriceBounds;
  categories: ShopCategoryOption[];
  sizes: string[];
  colors: ShopColorOption[];
  badges: ProductBadge[];
  resultCount: number;
  onChange: (next: ShopFilterState) => void;
  onClear: () => void;
  onApply?: () => void;
  showApply?: boolean;
  /** Prefix checkbox/switch ids when multiple panels mount (desktop + sheet). */
  idPrefix?: string;
  className?: string;
}

function clampPriceRange(
  value: readonly number[],
  bounds: ShopPriceBounds,
): [number, number] {
  const low = Math.min(value[0] ?? bounds.min, value[1] ?? bounds.max);
  const high = Math.max(value[0] ?? bounds.min, value[1] ?? bounds.max);

  return [
    Math.min(bounds.max, Math.max(bounds.min, low)),
    Math.min(bounds.max, Math.max(bounds.min, high)),
  ];
}

export function ShopFilterPanel({
  filters,
  bounds,
  categories,
  sizes,
  colors,
  badges,
  resultCount,
  onChange,
  onClear,
  onApply,
  showApply = false,
  idPrefix = "shop",
  className,
}: ShopFilterPanelProps) {
  const t = useTranslations("ShopPage");
  const locale = useLocale();
  const direction = locale === "ar" ? "rtl" : "ltr";
  const priceRange = clampPriceRange(filters.priceRange, bounds);
  const priceStep = Math.max(1, Math.min(50, bounds.max - bounds.min));
  const isPriceDisabled = bounds.max <= bounds.min;

  const update = (partial: Partial<ShopFilterState>) => {
    onChange({ ...filters, ...partial });
  };

  return (
    <DirectionProvider direction={direction}>
      <aside
        dir={direction}
        className={cn("flex h-full flex-col gap-4", className)}
        aria-label={t("panel.title")}
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            {t("panel.title")}
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onClear}
            className="text-muted-foreground"
          >
            {t("catalog.clearAll")}
          </Button>
        </div>

        <Accordion
          multiple
          defaultValue={["category", "size", "color", "badge", "price"]}
          className="w-full"
        >
          {categories.length > 0 ? (
            <AccordionItem value="category">
              <AccordionTrigger>{t("panel.category")}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-1">
                  {categories.map((category) => {
                    const checked = filters.categories.includes(category.id);
                    const id = `${idPrefix}-category-${category.id}`;
                    return (
                      <Label
                        key={category.id}
                        htmlFor={id}
                        className="flex cursor-pointer items-center justify-between gap-2.5 font-normal"
                      >
                        <span className="flex items-center gap-2.5">
                          <Checkbox
                            id={id}
                            checked={checked}
                            onCheckedChange={(next) => {
                              const isChecked = next === true;
                              update({
                                categories: isChecked
                                  ? [...filters.categories, category.id]
                                  : filters.categories.filter(
                                      (item) => item !== category.id,
                                    ),
                              });
                            }}
                          />
                          <span>{category.name}</span>
                        </span>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {category.count}
                        </span>
                      </Label>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ) : null}

          {sizes.length > 0 ? (
            <AccordionItem value="size">
              <AccordionTrigger>{t("panel.size")}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 pt-1">
                  {sizes.map((size) => {
                    const selected = filters.sizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          update({
                            sizes: toggleListValue<string>(filters.sizes, size),
                          })
                        }
                        className={cn(
                          "flex h-9 min-w-9 px-2.5 items-center justify-center rounded-lg border text-xs font-medium transition-colors",
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:bg-muted",
                        )}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ) : null}

          {colors.length > 0 ? (
            <AccordionItem value="color">
              <AccordionTrigger>{t("panel.color")}</AccordionTrigger>
              <AccordionContent>
                <TooltipProvider delay={100}>
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {colors.map((color) => {
                      const selected = filters.colors.includes(color.id);
                      const colorName = color.name;
                      const swatchClass = color.swatch
                        ? PRODUCT_SWATCH_CLASSES[color.swatch]
                        : undefined;

                      return (
                        <Tooltip key={color.id}>
                          <TooltipTrigger
                            type="button"
                            aria-label={t("panel.selectColor", {
                              color: colorName,
                            })}
                            aria-pressed={selected}
                            onClick={() =>
                              update({
                                colors: toggleListValue<string>(
                                  filters.colors,
                                  color.id,
                                ),
                              })
                            }
                            className={cn(
                              "relative size-8 rounded-full border transition-shadow",
                              selected
                                ? "ring-2 ring-ring ring-offset-2 ring-offset-background"
                                : "border-border hover:ring-1 hover:ring-border",
                            )}
                          >
                            <span
                              aria-hidden
                              className={cn(
                                "absolute inset-0.5 rounded-full border border-black/10 dark:border-white/15",
                                !color.hex && (swatchClass ?? "bg-foreground"),
                              )}
                              style={
                                color.hex
                                  ? { backgroundColor: color.hex }
                                  : undefined
                              }
                            />
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            sideOffset={6}
                            className="text-xs font-medium"
                          >
                            {colorName}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </TooltipProvider>
              </AccordionContent>
            </AccordionItem>
          ) : null}

          {badges.length > 0 ? (
            <AccordionItem value="badge">
              <AccordionTrigger>{t("panel.badge")}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-1">
                  {badges.map((badge) => {
                    const checked = filters.badges.includes(badge);
                    const id = `${idPrefix}-badge-${badge}`;
                    return (
                      <Label
                        key={badge}
                        htmlFor={id}
                        className="flex cursor-pointer items-center gap-2.5 font-normal"
                      >
                        <Checkbox
                          id={id}
                          checked={checked}
                          onCheckedChange={(next) => {
                            const isChecked = next === true;
                            update({
                              badges: isChecked
                                ? [...filters.badges, badge]
                                : filters.badges.filter(
                                    (item) => item !== badge,
                                  ),
                            });
                          }}
                        />
                        <span>{t(`panel.${badge}`)}</span>
                      </Label>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ) : null}

          <AccordionItem value="price">
            <AccordionTrigger>{t("panel.price")}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2" dir={direction}>
                <Slider
                  min={bounds.min}
                  max={bounds.max}
                  step={priceStep}
                  minStepsBetweenValues={1}
                  disabled={isPriceDisabled}
                  locale={locale}
                  value={priceRange}
                  thumbLabels={[t("panel.priceMin"), t("panel.priceMax")]}
                  onValueChange={(value) => {
                    if (!Array.isArray(value) || value.length < 2) return;
                    update({
                      priceRange: clampPriceRange(value, bounds),
                    });
                  }}
                />
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <ProductPrice
                    amountTRY={priceRange[0]}
                    className="text-sm text-foreground"
                    iconClassName="size-3.5"
                  />
                  <span aria-hidden>—</span>
                  <ProductPrice
                    amountTRY={priceRange[1]}
                    className="text-sm text-foreground"
                    iconClassName="size-3.5"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="space-y-4 border-t border-border pt-4">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor={`${idPrefix}-in-stock`} className="font-normal">
              {t("panel.inStock")}
            </Label>
            <Switch
              id={`${idPrefix}-in-stock`}
              checked={filters.inStockOnly}
              onCheckedChange={(checked) => update({ inStockOnly: checked })}
            />
          </div>
        </div>

        {showApply && (
          <div className="mt-auto border-t border-border pt-4">
            <Button type="button" className="w-full" onClick={onApply}>
              {t("catalog.apply", { count: resultCount })}
            </Button>
          </div>
        )}
      </aside>
    </DirectionProvider>
  );
}
