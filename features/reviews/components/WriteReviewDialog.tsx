"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Check,
  CheckCircle2,
  Package,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ReviewFeedbackTag, ReviewProductItem } from "../types";
import { submitProductReview } from "../api/submit-review";

interface WriteReviewDialogProps {
  item: ReviewProductItem;
  orderNumber: string;
  className?: string;
  onReviewSubmitted?: () => void;
}

const QUICK_TAG_KEYS: ReviewFeedbackTag[] = [
  "trueToSize",
  "luxuriousFabric",
  "flawlessCut",
  "breathable",
  "neatStitching",
];

export function WriteReviewDialog({
  item,
  orderNumber,
  className,
  onReviewSubmitted,
}: WriteReviewDialogProps) {
  const t = useTranslations("ProfilePage.orders.reviewModal");

  const storageKey = `ll_reviewed_${orderNumber}_${item.slug || item.name}`;

  const [open, setOpen] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<ReviewFeedbackTag[]>([]);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(storageKey);
        if (stored === "true") {
          setHasReviewed(true);
        }
      }
    } catch {
      // Ignore localStorage access errors
    }
  }, [storageKey]);

  const activeStars = hoverRating ?? rating;

  const handleToggleTag = (tagKey: ReviewFeedbackTag) => {
    setSelectedTags((prev) =>
      prev.includes(tagKey)
        ? prev.filter((k) => k !== tagKey)
        : [...prev, tagKey]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitProductReview({
        orderNumber,
        productName: item.name,
        productSlug: item.slug,
        rating,
        tags: selectedTags,
        comment,
      });

      try {
        localStorage.setItem(storageKey, "true");
      } catch {
        // Ignore
      }

      setHasReviewed(true);
      setIsSubmitted(true);
      onReviewSubmitted?.();

      setTimeout(() => {
        setOpen(false);
        setIsSubmitted(false);
      }, 1700);
    } catch {
      // Handle error gracefully
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          hasReviewed ? (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border border-success/30 bg-success-muted/20 px-2.5 py-1 text-xs font-medium text-success shadow-2xs select-none",
                className
              )}
              title={t("reviewed")}
            >
              <Check className="size-3.5 stroke-[2.5]" aria-hidden />
              <span>{t("reviewed")}</span>
            </span>
          ) : (
            <Button
              variant="outline"
              size="xs"
              className={cn(
                "gap-1.5 text-xs font-medium border-warning/40 bg-warning-muted/20 text-warning-900 transition-all hover:bg-warning-muted/40 hover:border-warning/60 hover:shadow-2xs dark:text-warning-200",
                className
              )}
            >
              <Star
                className="size-3.5 fill-warning stroke-warning shrink-0 transition-transform duration-200 group-hover:rotate-12"
                aria-hidden
              />
              <span>{t("button")}</span>
            </Button>
          )
        }
      />

      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-1.5rem)] max-w-lg p-0 overflow-hidden rounded-2xl border-border bg-card shadow-xl max-h-[90dvh] flex flex-col outline-none"
      >
        {isSubmitted ? (
          /* Success confirmation animation state */
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-3.5">
            <div className="relative flex size-14 items-center justify-center rounded-full bg-success-muted text-success">
              <CheckCircle2 className="size-8 animate-in zoom-in-50 duration-300" />
              <Sparkles className="absolute -top-1 -right-1 size-5 text-warning animate-bounce" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {t("successTitle")}
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              {t("successMessage")}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
            {/* Header with Product Preview & Dedicated Non-Overlapping Close Button */}
            <DialogHeader className="border-b border-border/60 bg-muted/25 px-4 py-3.5 sm:px-5 sm:py-4">
              <div className="flex items-start justify-between gap-3">
                {/* Product details */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative size-12 sm:size-14 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground">
                        <Package className="size-5" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-success-muted/50 px-2 py-0.5 text-[10px] font-semibold text-success ring-1 ring-success/30">
                        <CheckCircle2 className="size-2.5" />
                        {t("verifiedBadge")}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {t("orderRef", { number: orderNumber })}
                      </span>
                    </div>
                    <DialogTitle className="truncate text-sm font-semibold text-foreground sm:text-base">
                      {item.name}
                    </DialogTitle>
                  </div>
                </div>

                {/* Natural Header Close Button — Never Overlaps */}
                <DialogClose
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="size-7 sm:size-8 shrink-0 rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={t("cancel")}
                    />
                  }
                >
                  <X className="size-3.5 sm:size-4" />
                </DialogClose>
              </div>
            </DialogHeader>

            {/* Scrollable Body */}
            <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
              {/* 1. Star Rating with tactile interaction */}
              <div className="space-y-2 text-center">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  {t("ratingPrompt")}
                </p>

                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= activeStars;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="group p-1 transition-transform hover:scale-115 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                        aria-label={`${star} stars`}
                      >
                        <Star
                          className={cn(
                            "size-7 sm:size-8 transition-colors duration-150",
                            isFilled
                              ? "fill-warning stroke-warning"
                              : "fill-transparent stroke-muted-foreground/35 group-hover:stroke-warning/70"
                          )}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Rating Label Descriptor Badge */}
                <div className="flex items-center justify-center pt-0.5">
                  <span className="inline-flex items-center rounded-full bg-warning-muted/30 px-3 py-0.5 text-xs font-semibold text-warning-900 ring-1 ring-warning/30 dark:text-warning-200 transition-all">
                    {t(`ratingLabels.${activeStars}` as any)}
                  </span>
                </div>
              </div>

              {/* 2. Quick Impression Chips */}
              <div className="space-y-2">
                <p className="text-[11px] font-medium text-muted-foreground text-center">
                  {t("subtitle", { product: item.name })}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                  {QUICK_TAG_KEYS.map((tagKey) => {
                    const isSelected = selectedTags.includes(tagKey);
                    return (
                      <button
                        key={tagKey}
                        type="button"
                        onClick={() => handleToggleTag(tagKey)}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring select-none",
                          isSelected
                            ? "bg-primary text-primary-foreground shadow-xs ring-1 ring-primary"
                            : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground ring-1 ring-border/50"
                        )}
                      >
                        {isSelected && (
                          <Check className="size-3 stroke-[2.5]" />
                        )}
                        <span>{t(`quickTags.${tagKey}` as any)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Review Comment Textarea */}
              <div className="space-y-1.5">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t("reviewPlaceholder")}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border bg-background p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>

            {/* Pinned Footer Actions */}
            <div className="flex items-center justify-end gap-2 border-t border-border/60 bg-muted/20 px-4 py-3 sm:px-5 sm:py-3.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="gap-1.5 text-xs font-semibold px-4"
              >
                {isSubmitting ? (
                  <span>{t("submitting")}</span>
                ) : (
                  <>
                    <span>{t("submit")}</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
