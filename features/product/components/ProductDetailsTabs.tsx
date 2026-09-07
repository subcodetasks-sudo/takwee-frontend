"use client";

import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { Product } from "../types";
import { ProductReviews } from "./ProductReviews";

interface ProductDetailsTabsProps {
  product: Product;
}

export function ProductDetailsTabs({ product }: ProductDetailsTabsProps) {
  const t = useTranslations("ProductDetails");
  const tProduct = useTranslations(
    `ProductDetails.products.${product.nameKey}`,
  );

  return (
    <Tabs defaultValue="details" className="w-full gap-0">
      {/* Luxury Segmented Tabs Header - Full Width with Strict Containment */}
      <div className="w-full border-b border-border/70 pb-6">
        <div className="w-full overflow-hidden rounded-2xl border border-border/80 bg-muted/35 p-1 sm:p-1.5 shadow-2xs">
          <TabsList
            variant="default"
            className="grid !h-auto group-data-horizontal/tabs:!h-auto w-full !w-full grid-cols-2 items-stretch gap-1 sm:gap-1.5 rounded-xl border-0 bg-transparent p-0 overflow-hidden"
          >
            <TabsTrigger
              value="details"
              className="flex !h-auto w-full min-w-0 items-center justify-center rounded-xl border-0 px-2 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold shadow-none outline-none transition-all hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 data-active:bg-background data-active:text-foreground data-active:shadow-xs text-muted-foreground"
            >
              <span className="truncate">{t("tabs.details")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="flex !h-auto w-full min-w-0 items-center justify-center gap-1.5 sm:gap-2 rounded-xl border-0 px-2 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold shadow-none outline-none transition-all hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 data-active:bg-background data-active:text-foreground data-active:shadow-xs text-muted-foreground"
            >
              <span className="truncate">{t("tabs.reviews")}</span>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-warning/15 px-1.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-foreground sm:px-2">
                <Star className="size-3 fill-warning text-warning" />
                4.9
              </span>
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      {/* Product Details Content */}
      <TabsContent value="details" className="pt-6 sm:pt-8 animate-in fade-in-0 duration-200">
        <div className="w-full space-y-6">
          <p className="text-base text-muted-foreground leading-relaxed">
            {tProduct("description")}
          </p>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {t("detailsHeading")}
            </h2>

            <dl className="grid gap-3 sm:grid-cols-2">
              {product.specs.map((spec) => {
                const title = tProduct(`specs.${spec.id}.title`);
                const body = tProduct(`specs.${spec.id}.body`);

                return (
                  <div
                    key={spec.id}
                    className="flex flex-col gap-1.5 rounded-xl border border-border/70 bg-card/60 p-4 transition-all"
                  >
                    <dt className="text-sm font-semibold text-foreground">
                      {title}
                    </dt>
                    <dd className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {body}
                      {spec.hasBullets ? (
                        <ul className="mt-2.5 list-disc space-y-1 ps-4 text-xs leading-relaxed text-muted-foreground">
                          {(
                            tProduct.raw(`specs.${spec.id}.bullets`) as string[]
                          ).map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      ) : null}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </TabsContent>

      {/* Reviews Content: Stars, Breakdown, Interactive Form, and Comments */}
      <TabsContent value="reviews" className="pt-6 sm:pt-8 animate-in fade-in-0 duration-200">
        <ProductReviews product={product} />
      </TabsContent>
    </Tabs>
  );
}
