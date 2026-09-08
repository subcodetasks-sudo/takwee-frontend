"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FadeIn } from "@/components/animations";
import { cn } from "@/lib/utils";
import type { Product } from "../types";
import { ProductCard } from "./ProductCard";

interface RelatedProductsCarouselProps {
  title: string;
  subtitle: string;
  products: Product[];
  previousLabel: string;
  nextLabel: string;
}

export function RelatedProductsCarousel({
  title,
  subtitle,
  products,
  previousLabel,
  nextLabel,
}: RelatedProductsCarouselProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    onSelect();
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api.off("reInit", onSelect);
      api.off("select", onSelect);
    };
  }, [api]);

  const showNav = canScrollPrev || canScrollNext;

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8">
      <FadeIn direction="up" duration={0.5} distance={20}>
        <div className="flex items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <h2
              id="related-products-heading"
              className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
            >
              {title}
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              {subtitle}
            </p>
          </div>

          {showNav ? (
            <TooltipProvider delay={100}>
              <div className="flex shrink-0 items-center gap-2 pb-0.5">
                <Tooltip>
                  <TooltipTrigger
                    type="button"
                    disabled={!canScrollPrev}
                    aria-label={previousLabel}
                    onClick={() => api?.scrollPrev()}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors",
                      "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      "disabled:pointer-events-none disabled:opacity-40",
                    )}
                  >
                    <ChevronLeft className="size-4 rtl:rotate-180" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    sideOffset={6}
                    className="text-xs font-medium"
                  >
                    {previousLabel}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger
                    type="button"
                    disabled={!canScrollNext}
                    aria-label={nextLabel}
                    onClick={() => api?.scrollNext()}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors",
                      "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      "disabled:pointer-events-none disabled:opacity-40",
                    )}
                  >
                    <ChevronRight className="size-4 rtl:rotate-180" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    sideOffset={6}
                    className="text-xs font-medium"
                  >
                    {nextLabel}
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          ) : null}
        </div>
      </FadeIn>

      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          direction: isRtl ? "rtl" : "ltr",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-3 sm:-ml-4 lg:-ml-6">
          {products.map((product, index) => (
            <CarouselItem
              key={product.id}
              className="basis-1/2 pl-3 sm:basis-1/3 sm:pl-4 lg:basis-1/4 lg:pl-6"
            >
              <FadeIn
                direction="up"
                delay={0.08 + index * 0.08}
                duration={0.5}
                distance={24}
              >
                <ProductCard product={product} />
              </FadeIn>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
