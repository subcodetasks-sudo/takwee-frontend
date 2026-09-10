"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, ArrowLeft, Package } from "lucide-react";
import { motion } from "motion/react";
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
import { useHomePage } from "../hooks/useHomePage";
import { cn } from "@/lib/utils";

const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

export function HeroCarousel() {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const { heroes, isLoading } = useHomePage();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = heroes;
  const count = slides.length;

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || isPaused || count <= 1) return;

    const timer = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [api, isPaused, count]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  if (isLoading && count === 0) {
    return (
      <section
        className="relative w-full min-h-[650px] md:min-h-[850px] bg-muted/40"
        aria-busy="true"
        aria-label={t("loading")}
      />
    );
  }

  if (count === 0) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: LUXURY_EASE }}
      className="relative w-full overflow-hidden bg-background"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <motion.div
        initial={{ x: isRtl ? "100%" : "-100%", opacity: 0.5 }}
        animate={{ x: isRtl ? "-100%" : "100%", opacity: 0 }}
        transition={{ duration: 1.6, ease: LUXURY_EASE, delay: 0.15 }}
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-transparent via-primary-100/10 to-transparent dark:via-primary-900/10"
      />

      <Carousel
        setApi={setApi}
        opts={{
          loop: count > 1,
          direction: isRtl ? "rtl" : "ltr",
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {slides.map((slide, index) => {
            const isInitialSlide = index === 0;

            return (
              <CarouselItem key={slide.id} className="relative pl-0 w-full">
                <div className="relative w-full min-h-[650px] md:min-h-[850px] flex items-center">
                  <motion.div
                    className="absolute inset-0 z-0 select-none overflow-hidden"
                    initial={
                      isInitialSlide
                        ? { scale: 1.1, opacity: 0.5 }
                        : { scale: 1, opacity: 1 }
                    }
                    animate={{
                      scale: current === index ? 1 : 1.05,
                      opacity: 1,
                    }}
                    transition={{
                      scale: {
                        duration: isInitialSlide ? 1.8 : 1.2,
                        ease: LUXURY_EASE,
                      },
                      opacity: {
                        duration: 0.8,
                        ease: "easeOut",
                      },
                    }}
                  >
                    {slide.image?.trim() ? (
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        priority={isInitialSlide}
                        sizes="100vw"
                        className="object-cover object-center"
                      />
                    ) : null}
                    <div
                      className={cn(
                        "absolute inset-0 pointer-events-none",
                        isRtl
                          ? "bg-gradient-to-l from-background/70 via-background/35 to-transparent/10 md:from-background/60 md:via-background/25 md:to-transparent/5"
                          : "bg-gradient-to-r from-background/70 via-background/35 to-transparent/10 md:from-background/60 md:via-background/25 md:to-transparent/5",
                      )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/50 pointer-events-none" />
                  </motion.div>

                  <div className="container relative z-10 mx-auto px-6 sm:px-10 lg:px-16 py-20">
                    <div className="max-w-xl lg:max-w-2xl space-y-5 sm:space-y-6">
                      {slide.tag ? (
                        <motion.div
                          initial={
                            isInitialSlide
                              ? {
                                  opacity: 0,
                                  y: 18,
                                  filter: "blur(4px)",
                                  scale: 0.94,
                                }
                              : false
                          }
                          animate={{
                            opacity: 1,
                            y: 0,
                            filter: "blur(0px)",
                            scale: 1,
                          }}
                          transition={{
                            duration: 0.6,
                            delay: isInitialSlide ? 0.25 : 0,
                            ease: LUXURY_EASE,
                          }}
                          className="flex items-center gap-2"
                        >
                          <Badge
                            variant="secondary"
                            className="px-3.5 py-1 text-xs tracking-widest uppercase font-semibold bg-secondary-900/80 text-secondary-50 dark:bg-secondary-100/90 dark:text-secondary-900 backdrop-blur-md border border-secondary-800/30 shadow-sm"
                          >
                            {slide.tag}
                          </Badge>
                        </motion.div>
                      ) : null}

                      <motion.h1
                        initial={
                          isInitialSlide
                            ? { opacity: 0, y: 32, filter: "blur(8px)" }
                            : false
                        }
                        animate={{
                          opacity: 1,
                          y: 0,
                          filter: "blur(0px)",
                        }}
                        transition={{
                          duration: 0.85,
                          delay: isInitialSlide ? 0.4 : 0,
                          ease: LUXURY_EASE,
                        }}
                        className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15] drop-shadow-xs"
                      >
                        {slide.title}
                      </motion.h1>

                      <motion.p
                        initial={
                          isInitialSlide
                            ? { opacity: 0, y: 22, filter: "blur(4px)" }
                            : false
                        }
                        animate={{
                          opacity: 1,
                          y: 0,
                          filter: "blur(0px)",
                        }}
                        transition={{
                          duration: 0.75,
                          delay: isInitialSlide ? 0.55 : 0,
                          ease: LUXURY_EASE,
                        }}
                        className="text-sm sm:text-base lg:text-lg text-foreground/85 dark:text-foreground/90 font-medium leading-relaxed max-w-xl drop-shadow-xs"
                      >
                        {slide.description}
                      </motion.p>

                      <motion.div
                        initial={
                          isInitialSlide
                            ? { opacity: 0, y: 20, scale: 0.95 }
                            : false
                        }
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        transition={{
                          duration: 0.65,
                          delay: isInitialSlide ? 0.7 : 0,
                          ease: LUXURY_EASE,
                        }}
                        className="pt-2 sm:pt-4 flex flex-wrap items-center gap-4"
                      >
                        <Button
                          size="lg"
                          className="px-6 py-5 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl group"
                          nativeButton={false}
                          render={(props) => (
                            <Link href={slide.href || "/shop"} {...props} />
                          )}
                        >
                          <span>{t("cta")}</span>
                          {isRtl ? (
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                          ) : (
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          )}
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="px-6 py-5 text-sm sm:text-base font-semibold rounded-xl border-foreground/20 bg-background/60 text-foreground backdrop-blur-md shadow-md hover:bg-background/80 hover:shadow-lg transition-all duration-300 group"
                          nativeButton={false}
                          render={(props) => (
                            <Link href="/me/orders" {...props} />
                          )}
                        >
                          <Package className="h-4 w-4" />
                          <span>{t("ordersCta")}</span>
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {count > 1 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.85, duration: 0.5, ease: LUXURY_EASE }}
            className="hidden sm:block"
          >
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
          </motion.div>
        ) : null}
      </Carousel>

      {count > 1 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5, ease: LUXURY_EASE }}
          className="absolute bottom-6 inset-x-0 z-20 flex justify-center items-center gap-2 pointer-events-auto"
        >
          {Array.from({ length: count }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollTo(idx)}
              aria-label={t("goToSlide", { index: idx + 1 })}
              className={cn(
                "relative h-2.5 rounded-full transition-all duration-300 cursor-pointer overflow-hidden",
                current === idx
                  ? "w-9 bg-primary/20 ring-1 ring-primary/30"
                  : "w-2.5 bg-foreground/30 hover:bg-foreground/60",
              )}
            >
              {current === idx && (
                <motion.span
                  layoutId="heroActiveDot"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
            </button>
          ))}
        </motion.div>
      ) : null}
    </motion.section>
  );
}
