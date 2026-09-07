"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, CheckCircle2, MessageSquarePlus, Star, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "../types";

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  sizePurchased?: string;
  helpfulCount: number;
}

const INITIAL_REVIEWS_AR: ReviewItem[] = [
  {
    id: "rev-ar-1",
    author: "فاطمة العامري",
    rating: 5,
    date: "منذ 3 أيام",
    title: "خامة كتان فاخرة وخياطة متقنة جداً",
    comment:
      "العباية تجنن بكل معنى الكلمة! قماش الكتان بارد وانسيابي وما يكرمش بسهولة. أخذت مقاس 56 وطلع طولها مضبوط بالملي مع كعب ناعم. التغليف فخم والتوصيل سريع جداً بالرياض.",
    verified: true,
    sizePurchased: "56",
    helpfulCount: 14,
  },
  {
    id: "rev-ar-2",
    author: "ريم العتيبي",
    rating: 5,
    date: "منذ أسبوع",
    title: "أناقة هادئة وسواد فاحم مذهل",
    comment:
      "أجمل ما في القطعة بساطتها ودقة تفاصيل الأكمام والحواف. الطرحة المتناسقة المرفقة ناعمة جداً وثابتة. تستاهل كل ريال وبكرر الشراء بدون تردد.",
    verified: true,
    sizePurchased: "54",
    helpfulCount: 9,
  },
  {
    id: "rev-ar-3",
    author: "نورة الدوسري",
    rating: 5,
    date: "منذ أسبوعين",
    title: "حاسبة المقاس فادتني كثير والقصة مريحة",
    comment:
      "استخدمت حاسبة الطول في الصفحة واقترحت لي مقاس 54 لطولي 159 سم، وجاءت ممتازة ومريحة للدوام والمناسبات. خياطة نظيفة وأقمشة تدوم.",
    verified: true,
    sizePurchased: "54",
    helpfulCount: 6,
  },
];

const INITIAL_REVIEWS_EN: ReviewItem[] = [
  {
    id: "rev-en-1",
    author: "Layla M.",
    rating: 5,
    date: "3 days ago",
    title: "Exquisite craftsmanship and fluid drape",
    comment:
      "The fabric feels extraordinary—breathable, refined linen blend that drapes with graceful poise. Size 56 was ideal for my stature. Arrived beautifully packaged with boutique client care.",
    verified: true,
    sizePurchased: "56",
    helpfulCount: 14,
  },
  {
    id: "rev-en-2",
    author: "Sara Al-Zahrani",
    rating: 5,
    date: "1 week ago",
    title: "Timeless quiet luxury & deep black tone",
    comment:
      "Impeccable seamwork and clean finishes. The included coordinating sheila is soft, perfectly matched, and lightweight. Truly worth every penny.",
    verified: true,
    sizePurchased: "54",
    helpfulCount: 9,
  },
  {
    id: "rev-en-3",
    author: "Amina K.",
    rating: 5,
    date: "2 weeks ago",
    title: "The height calculator was spot on!",
    comment:
      "I input 163 cm and was suggested size 56. The hemline rests gracefully at the ankles without dragging. Effortless elegance for travel and daily wear.",
    verified: true,
    sizePurchased: "56",
    helpfulCount: 6,
  },
];

const INITIAL_REVIEWS_TR: ReviewItem[] = [
  {
    id: "rev-tr-1",
    author: "Zeynep K.",
    rating: 5,
    date: "3 gün önce",
    title: "Kumaş dokusu ve dökümü olağanüstü",
    comment:
      "Saf keten kalitesi kendini hemen hissettiriyor; hafif, nefes alan ve zarif dökümlü. 56 beden tam boyuma göre oldu. Butik paketlemesi de çok özenliydi.",
    verified: true,
    sizePurchased: "56",
    helpfulCount: 14,
  },
  {
    id: "rev-tr-2",
    author: "Elif Demir",
    rating: 5,
    date: "1 hafta önce",
    title: "Zarif ve kusursuz işçilik",
    comment:
      "Dikiş kalitesi ve kol detayları tek kelimeyle kusursuz. Uyumlu şalın dokusu da çok rahat. Çok memnun kaldım, severek giyiyorum.",
    verified: true,
    sizePurchased: "54",
    helpfulCount: 9,
  },
  {
    id: "rev-tr-3",
    author: "Merve A.",
    rating: 5,
    date: "2 hafta önce",
    title: "Boy hesaplayıcı tam isabet oldu",
    comment:
      "Boyuma göre beden tavsiyesi çok yardımcı oldu. 54 beden bilek hizasında kusursuz durdu. Duruşu asil ve kumaşı asla terletmiyor.",
    verified: true,
    sizePurchased: "54",
    helpfulCount: 6,
  },
];

interface ProductReviewsProps {
  product: Product;
}

export function ProductReviews({ product }: ProductReviewsProps) {
  const locale = useLocale();
  const t = useTranslations("ProductDetails.reviewsSection");

  const initialList =
    locale === "ar"
      ? INITIAL_REVIEWS_AR
      : locale === "tr"
        ? INITIAL_REVIEWS_TR
        : INITIAL_REVIEWS_EN;

  const [reviews, setReviews] = useState<ReviewItem[]>(initialList);
  const [helpfulMap, setHelpfulMap] = useState<Record<string, boolean>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // New review form fields
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [sizePurchased, setSizePurchased] = useState<string>(
    product.sizes[0] ?? "56",
  );

  const handleToggleHelpful = (id: string) => {
    if (helpfulMap[id]) return;
    setHelpfulMap((prev) => ({ ...prev, [id]: true }));
    setReviews((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, helpfulCount: item.helpfulCount + 1 } : item,
      ),
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newReview: ReviewItem = {
      id: `rev-user-${Date.now()}`,
      author: name.trim(),
      rating,
      date: locale === "ar" ? "الآن" : locale === "tr" ? "Şimdi" : "Just now",
      title: title.trim() || (locale === "ar" ? "تقييم ممتاز" : locale === "tr" ? "Mükemmel" : "Wonderful abaya"),
      comment: comment.trim(),
      verified: true,
      sizePurchased,
      helpfulCount: 0,
    };

    setReviews([newReview, ...reviews]);
    setFormSubmitted(true);
    setName("");
    setTitle("");
    setComment("");
    setTimeout(() => {
      setFormSubmitted(false);
      setIsFormOpen(false);
    }, 1800);
  };

  const totalReviews = reviews.length;
  const averageRating = (
    reviews.reduce((acc, curr) => acc + curr.rating, 0) / (totalReviews || 1)
  ).toFixed(1);

  return (
    <div className="w-full space-y-8">
      {/* Overview Card: Score, Stars, Breakdown, Action */}
      <div className="rounded-2xl border border-border/80 bg-card/60 p-6 shadow-xs sm:p-8">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-3">
          {/* Left: Score & Stars */}
          <div className="flex flex-col items-center justify-center text-center lg:items-start lg:text-start">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {averageRating}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {t("outOf")}
              </span>
            </div>

            {/* Stars row */}
            <div className="mt-2 flex items-center gap-1 text-warning">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="size-5 fill-current stroke-warning"
                  aria-hidden
                />
              ))}
            </div>

            <p className="mt-2 text-xs font-medium text-muted-foreground">
              {t("basedOn", { count: totalReviews })}
            </p>
            <p className="mt-1 text-[11px] font-semibold text-success">
              {t("recommendation")}
            </p>
          </div>

          {/* Middle: Rating Breakdown Bars */}
          <div className="space-y-2 border-y border-border/60 py-4 lg:border-y-0 lg:border-x lg:px-6 lg:py-0">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = reviews.filter((r) => r.rating === stars).length;
              const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              return (
                <div key={stars} className="flex items-center gap-2 text-xs">
                  <div className="flex w-12 shrink-0 items-center justify-end gap-1">
                    <span className="font-semibold tabular-nums text-foreground">{stars}</span>
                    <Star className="size-3 fill-warning text-warning" />
                  </div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-warning transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-9 shrink-0 text-end text-[11px] tabular-nums text-muted-foreground">
                    {percent}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right: Write Review Trigger */}
          <div className="flex flex-col items-center justify-center gap-3 text-center lg:items-end lg:text-end">
            <Button
              type="button"
              onClick={() => setIsFormOpen((prev) => !prev)}
              className="gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-xs"
            >
              <MessageSquarePlus className="size-4" />
              <span>{isFormOpen ? t("cancel") : t("writeReview")}</span>
            </Button>
            <span className="text-xs text-muted-foreground">
              {t("filterAll", { count: totalReviews })}
            </span>
          </div>
        </div>

        {/* Expandable Write Review Form */}
        {isFormOpen ? (
          <form
            onSubmit={handleSubmitReview}
            className="mt-6 border-t border-border/60 pt-6 animate-in fade-in-0 duration-200"
          >
            {formSubmitted ? (
              <div className="flex items-center justify-center gap-2 rounded-xl bg-success-muted p-4 text-xs sm:text-sm font-semibold text-success">
                <CheckCircle2 className="size-5" />
                <span>{t("successMessage")}</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-foreground">
                    {t("ratingLabel")}
                  </span>
                  <div className="flex items-center gap-1.5" role="radiogroup">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled =
                        hoverRating != null ? star <= hoverRating : star <= rating;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setRating(star)}
                          className="p-1 text-warning transition-transform hover:scale-115 focus:outline-none"
                          aria-label={t("starsLabel", { stars: star })}
                        >
                          <Star
                            className={cn(
                              "size-6 transition-colors",
                              isFilled
                                ? "fill-warning text-warning"
                                : "fill-transparent text-muted-foreground/40",
                            )}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      {t("nameLabel")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("namePlaceholder")}
                      className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs sm:text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      {t("sizeLabel")}
                    </label>
                    <select
                      value={sizePurchased}
                      onChange={(e) => setSizePurchased(e.target.value)}
                      className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs sm:text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      {product.sizes.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    {t("titleLabel")}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t("titlePlaceholder")}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs sm:text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    {t("commentLabel")} *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t("commentPlaceholder")}
                    className="w-full rounded-lg border border-border bg-background p-3 text-xs sm:text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFormOpen(false)}
                    className="rounded-lg text-xs font-medium"
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-lg text-xs font-semibold shadow-xs"
                  >
                    {t("submit")}
                  </Button>
                </div>
              </div>
            )}
          </form>
        ) : null}
      </div>

      {/* Reviews Comments List */}
      <div className="space-y-4">
        {reviews.map((rev) => {
          const isHelpful = helpfulMap[rev.id];
          return (
            <article
              key={rev.id}
              className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 sm:p-6 shadow-2xs transition-all hover:border-border"
            >
              {/* Top Row: Author, Verified Badge, Rating, Date */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 font-semibold text-foreground ring-1 ring-primary/20 text-xs sm:text-sm">
                    {rev.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                        {rev.author}
                      </h4>
                      {rev.verified ? (
                        <Badge
                          variant="secondary"
                          className="gap-1 bg-success-muted text-success border-0 text-[10px] px-2 py-0.5 font-medium"
                        >
                          <Check className="size-3" />
                          {t("verifiedBuyer")}
                        </Badge>
                      ) : null}
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {rev.date}
                    </span>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 text-warning" aria-label={`${rev.rating} stars`}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        "size-4",
                        s <= rev.rating
                          ? "fill-warning text-warning"
                          : "fill-transparent text-muted-foreground/30",
                      )}
                      aria-hidden
                    />
                  ))}
                </div>
              </div>

              {/* Title & Comment Text */}
              <div className="space-y-1.5">
                {rev.title ? (
                  <h5 className="text-sm font-semibold text-foreground">
                    {rev.title}
                  </h5>
                ) : null}
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {rev.comment}
                </p>
              </div>

              {/* Bottom Meta: Purchased Size & Helpful Counter */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-3 text-xs">
                {rev.sizePurchased ? (
                  <span className="inline-flex items-center rounded-md bg-muted/60 px-2 py-1 text-[11px] font-medium text-foreground">
                    {t("sizePurchased", { size: rev.sizePurchased })}
                  </span>
                ) : <span />}

                <button
                  type="button"
                  onClick={() => handleToggleHelpful(rev.id)}
                  disabled={isHelpful}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors",
                    isHelpful
                      ? "border-success/40 bg-success-muted text-success"
                      : "border-border/80 bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <ThumbsUp className="size-3" />
                  <span>
                    {t("helpful")} ({rev.helpfulCount})
                  </span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
