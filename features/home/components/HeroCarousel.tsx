"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HERO_SLIDES } from "../utils/hero-slides";
import { cn } from "@/lib/utils";

export function HeroCarousel() {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Auto-scroll timer (every 5 seconds), paused on hover
  useEffect(() => {
    if (!api || isPaused) return;

    const timer = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [api, isPaused]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  return (
    <section
      className="relative w-full overflow-hidden bg-background"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          direction: isRtl ? "rtl" : "ltr",
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {HERO_SLIDES.map((slide, index) => (
            <CarouselItem key={slide.id} className="relative pl-0 w-full">
              <div className="relative w-full min-h-[650px] md:min-h-[850px] flex items-center">
                {/* Background Image with Ambient Overlay */}
                <div className="absolute inset-0 z-0 select-none">
                  <Image
                    src={slide.image}
                    alt={t(slide.titleKey as any)}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover object-center transform scale-100 duration-1000 transition-transform"
                  />
                  {/* Subtle directional scrim to ensure text legibility without foggy haze */}
                  <div
                    className={cn(
                      "absolute inset-0 pointer-events-none",
                      isRtl
                        ? "bg-gradient-to-l from-background/70 via-background/35 to-transparent/10 md:from-background/60 md:via-background/25 md:to-transparent/5"
                        : "bg-gradient-to-r from-background/70 via-background/35 to-transparent/10 md:from-background/60 md:via-background/25 md:to-transparent/5",
                    )}
                  />
                  {/* Gentle top/bottom depth gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/50 pointer-events-none" />
                </div>

                {/* Content Overlay */}
                <div className="container relative z-10 mx-auto px-6 sm:px-10 lg:px-16 py-20">
                  <div className="max-w-xl lg:max-w-2xl space-y-5 sm:space-y-6">
                    {/* Slide Tag / Category */}
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="px-3.5 py-1 text-xs tracking-widest uppercase font-semibold bg-secondary-900/80 text-secondary-50 dark:bg-secondary-100/90 dark:text-secondary-900 backdrop-blur-md border border-secondary-800/30 shadow-sm"
                      >
                        {t(slide.tagKey as any)}
                      </Badge>
                    </div>

                    {/* Slide Title */}
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15] drop-shadow-xs">
                      {t(slide.titleKey as any)}
                    </h1>

                    {/* Slide Description */}
                    <p className="text-sm sm:text-base lg:text-lg text-foreground/85 dark:text-foreground/90 font-medium leading-relaxed max-w-xl drop-shadow-xs">
                      {t(slide.descriptionKey as any)}
                    </p>

                    {/* Action Navigation Button */}
                    <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-4">
                      <Button
                        size="lg"
                        className="px-6 py-5 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl group"
                        nativeButton={false}
                        render={(props) => (
                          <Link href={slide.href} {...props} />
                        )}
                      >
                        <span>{t(slide.ctaKey as any)}</span>
                        {isRtl ? (
                          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        ) : (
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Controllers (shadcn CarouselPrevious & CarouselNext) */}
        <div className="hidden sm:block">
          <CarouselPrevious
            variant="default"
            size="icon"
            className={cn(
              "z-20 h-11 w-11 bg-background text-foreground hover:bg-background/85 border-transparent shadow-xl transition-transform duration-200 hover:scale-105 active:scale-95",
              isRtl
                ? "right-6 sm:right-10 left-auto"
                : "left-6 sm:left-10 right-auto",
            )}
          />
          <CarouselNext
            variant="default"
            size="icon"
            className={cn(
              "z-20 h-11 w-11 bg-background text-foreground hover:bg-background/85 border-transparent shadow-xl transition-transform duration-200 hover:scale-105 active:scale-95",
              isRtl
                ? "left-6 sm:left-10 right-auto"
                : "right-6 sm:right-10 left-auto",
            )}
          />
        </div>
      </Carousel>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-6 inset-x-0 z-20 flex justify-center items-center gap-2 pointer-events-auto">
        {Array.from({ length: count }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => scrollTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={cn(
              "h-2 rounded-full transition-all duration-300 cursor-pointer",
              current === idx
                ? "w-8 bg-primary shadow-sm"
                : "w-2 bg-foreground/30 hover:bg-foreground/60",
            )}
          />
        ))}
      </div>
    </section>
  );
}
