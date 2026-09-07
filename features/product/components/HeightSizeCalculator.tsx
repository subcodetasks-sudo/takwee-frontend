"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AbayaSize } from "../types";

const QUICK_PRESETS = [152, 158, 163, 168, 174] as const;

export function calculateSizeFromHeight(heightCm: number): {
  size: AbayaSize;
  lengthCm: number;
} | null {
  if (isNaN(heightCm) || heightCm < 140 || heightCm > 195) {
    return null;
  }
  if (heightCm <= 155) {
    return { size: "52", lengthCm: 130 };
  }
  if (heightCm <= 160) {
    return { size: "54", lengthCm: 135 };
  }
  if (heightCm <= 165) {
    return { size: "56", lengthCm: 140 };
  }
  if (heightCm <= 170) {
    return { size: "58", lengthCm: 145 };
  }
  return { size: "60", lengthCm: 150 };
}

interface HeightSizeCalculatorProps {
  selectedSize?: AbayaSize | null;
  onSelectSize: (size: AbayaSize) => void;
  className?: string;
}

export function HeightSizeCalculator({
  selectedSize,
  onSelectSize,
  className,
}: HeightSizeCalculatorProps) {
  const t = useTranslations("ProductDetails.heightCalculator");
  const [heightInput, setHeightInput] = useState<string>("");

  const parsedHeight = Number.parseInt(heightInput, 10);
  const recommendation = useMemo(() => {
    if (!heightInput) return null;
    return calculateSizeFromHeight(parsedHeight);
  }, [heightInput, parsedHeight]);

  const isOutOfRange =
    Boolean(heightInput) &&
    (Number.isNaN(parsedHeight) || parsedHeight < 140 || parsedHeight > 195);

  const isRecommendationSelected =
    recommendation != null && selectedSize === recommendation.size;

  const handleApply = () => {
    if (recommendation) {
      onSelectSize(recommendation.size);
    }
  };

  const handlePresetClick = (preset: number) => {
    setHeightInput(preset.toString());
    const res = calculateSizeFromHeight(preset);
    if (res) {
      onSelectSize(res.size);
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-muted/20 p-4 transition-all sm:p-4.5",
        className,
      )}
    >
      <div className="flex items-start gap-2.5">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-foreground ring-1 ring-primary/20">
          <Sparkles className="size-3.5 text-primary" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-xs sm:text-sm font-semibold text-foreground">
            {t("title")}
          </h3>
          <p className="mt-0.5 text-[11px] sm:text-xs text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        {/* Input field + quick presets */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex min-w-32 max-w-44 flex-1 items-center">
            <input
              type="number"
              min={140}
              max={195}
              value={heightInput}
              onChange={(e) => setHeightInput(e.target.value)}
              placeholder={t("placeholder")}
              className={cn(
                "h-9 w-full rounded-lg border border-border bg-card px-3 pe-9 text-xs sm:text-sm font-medium tabular-nums text-foreground shadow-2xs outline-none transition-all placeholder:text-muted-foreground/60",
                "focus:border-primary focus:ring-2 focus:ring-primary/20",
                isOutOfRange && "border-error/80 focus:border-error focus:ring-error/20",
              )}
            />
            <span className="pointer-events-none absolute end-2.5 text-xs font-medium text-muted-foreground">
              {t("unit")}
            </span>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-1.5" role="group">
            {QUICK_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={cn(
                  "rounded-md border px-2 py-1 text-[11px] font-medium tabular-nums transition-colors",
                  parsedHeight === preset
                    ? "border-foreground bg-foreground text-background shadow-xs"
                    : "border-border/70 bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                )}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Warning if out of range */}
        {isOutOfRange ? (
          <p className="text-xs text-error">{t("outOfRange")}</p>
        ) : null}

        {/* Recommendation Result Display */}
        {recommendation ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-3 shadow-2xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {t("recommended")}
                </span>
                <Badge
                  variant="secondary"
                  className="bg-primary/15 font-bold tabular-nums text-foreground"
                >
                  {recommendation.size}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {t("garmentLength", { length: recommendation.lengthCm })}
              </p>
            </div>

            <Button
              type="button"
              size="sm"
              onClick={handleApply}
              variant={isRecommendationSelected ? "outline" : "default"}
              className={cn(
                "h-8 gap-1.5 px-3 text-xs font-semibold shadow-xs transition-all",
                isRecommendationSelected &&
                  "border-success/40 bg-success-muted text-success hover:bg-success-muted/80",
              )}
            >
              {isRecommendationSelected ? (
                <>
                  <Check className="size-3.5" />
                  <span>{t("applied")}</span>
                </>
              ) : (
                <>
                  <span>{t("apply", { size: recommendation.size })}</span>
                  <ArrowRight className="size-3.5 rtl:rotate-180" />
                </>
              )}
            </Button>
          </div>
        ) : null}

        <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
          {t("heelsTip")}
        </p>
      </div>
    </div>
  );
}
