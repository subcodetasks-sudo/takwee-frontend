"use client";

import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import type { Product, ProductReview } from "../types";
import { ProductReviews } from "./ProductReviews";
import { ProductRichText } from "./ProductRichText";

interface ProductDetailsTabsProps {
  product: Product;
  reviews?: ProductReview[];
}

function formatRatingBadge(
  product: Product,
  reviews: ProductReview[],
): string | null {
  if (typeof product.rating === "number" && product.rating > 0) {
    return product.rating.toFixed(1);
  }

  if (reviews.length === 0) return null;

  const avg =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  return avg.toFixed(1);
}

export function ProductDetailsTabs({
  product,
  reviews = [],
}: ProductDetailsTabsProps) {
  const t = useTranslations("ProductDetails");

  const description = product.description?.trim() || null;
  const features =
    product.features && product.features.length > 0 ? product.features : [];
  const ratingBadge = formatRatingBadge(product, reviews);

  return (
    <Tabs defaultValue="details" className="w-full gap-0">
      <FadeIn direction="up" duration={0.5} distance={20}>
        <div className="w-full border-b border-border/70 pb-6">
          <div className="w-full overflow-hidden rounded-2xl border border-border/80 bg-muted/35 p-1 shadow-2xs sm:p-1.5">
            <TabsList
              variant="default"
              className="grid !h-auto group-data-horizontal/tabs:!h-auto w-full !w-full grid-cols-2 items-stretch gap-1 overflow-hidden rounded-xl border-0 bg-transparent p-0 sm:gap-1.5"
            >
              <TabsTrigger
                value="details"
                className="flex !h-auto w-full min-w-0 items-center justify-center rounded-xl border-0 px-2 py-2.5 text-xs font-semibold text-muted-foreground shadow-none outline-none transition-all hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 data-active:bg-background data-active:text-foreground data-active:shadow-xs sm:px-6 sm:py-3 sm:text-sm"
              >
                <span className="truncate">{t("tabs.details")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="flex !h-auto w-full min-w-0 items-center justify-center gap-1.5 rounded-xl border-0 px-2 py-2.5 text-xs font-semibold text-muted-foreground shadow-none outline-none transition-all hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 data-active:bg-background data-active:text-foreground data-active:shadow-xs sm:gap-2 sm:px-6 sm:py-3 sm:text-sm"
              >
                <span className="truncate">{t("tabs.reviews")}</span>
                {ratingBadge ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-warning/15 px-1.5 py-0.5 text-[10px] font-bold text-foreground sm:px-2 sm:text-[11px]">
                    <Star className="size-3 fill-warning text-warning" />
                    {ratingBadge}
                  </span>
                ) : null}
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
      </FadeIn>

      <TabsContent
        value="details"
        className="pt-6 sm:pt-8 animate-in fade-in-0 duration-200"
      >
        <StaggerContainer
          staggerDelay={0.08}
          delayChildren={0.06}
          className="w-full space-y-6"
        >
          {description ? (
            <StaggerItem>
              <ProductRichText content={description} />
            </StaggerItem>
          ) : null}

          {features.length > 0 ? (
            <StaggerItem>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {t("detailsHeading")}
                </h2>

                <StaggerContainer
                  staggerDelay={0.07}
                  delayChildren={0.05}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  {features.map((feature) => (
                    <StaggerItem key={feature.id}>
                      <div className="flex h-full flex-col gap-1.5 rounded-xl border border-border/70 bg-card/60 p-4 transition-all">
                        <ProductRichText
                          content={feature.name}
                          className="text-sm font-semibold text-foreground [&_p]:mb-0 [&_*]:text-foreground"
                        />
                        {feature.value ? (
                          <ProductRichText
                            content={feature.value}
                            className="text-xs leading-relaxed sm:text-sm [&_p]:mb-1.5 [&_p:last-child]:mb-0"
                          />
                        ) : null}
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </StaggerItem>
          ) : null}
        </StaggerContainer>
      </TabsContent>

      <TabsContent
        value="reviews"
        className="pt-6 sm:pt-8 animate-in fade-in-0 duration-200"
      >
        <FadeIn direction="up" delay={0.05} duration={0.5} distance={20}>
          <ProductReviews product={product} initialReviews={reviews} />
        </FadeIn>
      </TabsContent>
    </Tabs>
  );
}
