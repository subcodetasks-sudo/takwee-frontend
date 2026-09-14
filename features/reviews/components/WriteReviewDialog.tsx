"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
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
import { gooeyToast } from "@/components/ui/goey-toaster";
import { useAuth } from "@/features/auth";
import { cn } from "@/lib/utils";
import { submitProductReviewAction } from "../api/submit-review";
import type { ReviewProductItem } from "../types";

interface WriteReviewDialogProps {
  item: ReviewProductItem;
  orderNumber: string;
  className?: string;
  onReviewSubmitted?: () => void;
}

export function WriteReviewDialog({
  item,
  orderNumber,
  className,
  onReviewSubmitted,
}: WriteReviewDialogProps) {
  const t = useTranslations("ProfilePage.orders.reviewModal");
  const locale = useLocale();
  const { user } = useAuth();

  const storageKey = `ll_reviewed_${orderNumber}_${item.productId || item.slug || item.name}`;

  const [open, setOpen] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [title, setTitle] = useState("");
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

  useEffect(() => {
    if (user?.name?.trim()) {
      setCustomerName(user.name.trim());
    }
  }, [user?.name]);

  const activeStars = hoverRating ?? rating;
  const canSubmit =
    Boolean(item.productId) &&
    customerName.trim().length > 0 &&
    title.trim().length > 0 &&
    comment.trim().length > 0 &&
    !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !item.productId ||
      !customerName.trim() ||
      !title.trim() ||
      !comment.trim()
    ) {
      gooeyToast.error(t("submitError"));
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitProductReviewAction({
        productId: item.productId,
        rating,
        customerName: customerName.trim(),
        size: item.size?.trim() || null,
        title: title.trim(),
        comment: comment.trim(),
        locale,
      });

      if (!result.success) {
        gooeyToast.error(result.message || t("submitError"));
        return;
      }

      try {
        localStorage.setItem(storageKey, "true");
      } catch {
        // Ignore
      }

      setHasReviewed(true);
      setIsSubmitted(true);
      onReviewSubmitted?.();
      gooeyToast.success(t("submitSuccess"));

      setTimeout(() => {
        setOpen(false);
        setIsSubmitted(false);
      }, 1700);
    } catch {
      gooeyToast.error(t("submitError"));
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
                className,
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
              disabled={!item.productId}
              className={cn(
                "gap-1.5 text-xs font-medium border-warning/40 bg-warning-muted/20 text-warning-900 transition-all hover:bg-warning-muted/40 hover:border-warning/60 hover:shadow-2xs dark:text-warning-200",
                className,
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
            <DialogHeader className="border-b border-border/60 bg-muted/25 px-4 py-3.5 sm:px-5 sm:py-4">
              <div className="flex items-start justify-between gap-3">
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

            <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
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
                              : "fill-transparent stroke-muted-foreground/35 group-hover:stroke-warning/70",
                          )}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-center pt-0.5">
                  <span className="inline-flex items-center rounded-full bg-warning-muted/30 px-3 py-0.5 text-xs font-semibold text-warning-900 ring-1 ring-warning/30 dark:text-warning-200 transition-all">
                    {t(`ratingLabels.${activeStars}` as "ratingLabels.5")}
                  </span>
                </div>
              </div>

              <p className="text-[11px] font-medium text-muted-foreground text-center">
                {t("subtitle", { product: item.name })}
              </p>

              <div className="space-y-1.5">
                <label
                  htmlFor={`review-name-${storageKey}`}
                  className="block text-[11px] font-medium text-muted-foreground"
                >
                  {t("nameLabel")}
                </label>
                <input
                  id={`review-name-${storageKey}`}
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={t("namePlaceholder")}
                  autoComplete="name"
                  required
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor={`review-title-${storageKey}`}
                  className="block text-[11px] font-medium text-muted-foreground"
                >
                  {t("titleLabel")}
                </label>
                <input
                  id={`review-title-${storageKey}`}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("titlePlaceholder")}
                  required
                  maxLength={160}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor={`review-comment-${storageKey}`}
                  className="block text-[11px] font-medium text-muted-foreground"
                >
                  {t("commentLabel")}
                </label>
                <textarea
                  id={`review-comment-${storageKey}`}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t("reviewPlaceholder")}
                  rows={4}
                  required
                  maxLength={2000}
                  className="w-full resize-none rounded-xl border border-border bg-background p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>

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
                disabled={!canSubmit}
                className="gap-1.5 text-xs font-semibold px-4"
              >
                {isSubmitting ? (
                  <span>{t("submitting")}</span>
                ) : (
                  <span>{t("submit")}</span>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
