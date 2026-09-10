"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useHomePage } from "@/features/home/hooks/useHomePage";
import { useCategories } from "@/features/categories/hooks/useCategories";
import type { StorefrontCategory } from "@/features/categories/types";
import { isShopFilter } from "@/features/product/utils/shop-filters";
import { findCategoryForFilter } from "../utils/resolve-shop-path";

const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

const HERO_FALLBACK_IMAGE = "/imgs/hero-slide-1.jpg";

interface ShopHeroProps {
  pathFilter?: string;
  /** RSC-resolved category (preferred); client hook used as fallback. */
  category?: StorefrontCategory | null;
}

export function ShopHero({ pathFilter, category: categoryProp }: ShopHeroProps) {
  const t = useTranslations("ShopPage");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const { heroes } = useHomePage();
  const { categories } = useCategories();

  const category =
    categoryProp ?? findCategoryForFilter(pathFilter, categories) ?? null;

  const title = category
    ? category.name
    : pathFilter && isShopFilter(pathFilter)
      ? t(`filters.${pathFilter}.title`)
      : t("hero.title");

  const subtitle = pathFilter
    ? !category && isShopFilter(pathFilter)
      ? t(`filters.${pathFilter}.subtitle`)
      : null
    : t("hero.subtitle");

  // All-products `/shop`: prefer the first home hero image.
  // Category routes: prefer the category image from `useCategories` / RSC.
  const homeHeroImage = !pathFilter ? heroes[0]?.image?.trim() : undefined;
  const categoryImage = category?.image?.trim() || undefined;
  const image = homeHeroImage || categoryImage || HERO_FALLBACK_IMAGE;

  return (
    <section
      aria-labelledby="shop-hero-heading"
      className="relative flex min-h-[42vh] w-full items-center justify-center overflow-hidden bg-background sm:min-h-[48vh] md:min-h-[52vh]"
    >
      {/* Subtle luxury light sweep on entry */}
      <motion.div
        key={`sweep-${pathFilter ?? "default"}`}
        initial={{ x: isRtl ? "100%" : "-100%", opacity: 0.5 }}
        animate={{ x: isRtl ? "-100%" : "100%", opacity: 0 }}
        transition={{ duration: 1.6, ease: LUXURY_EASE, delay: 0.15 }}
        className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-transparent via-primary-100/15 to-transparent dark:via-primary-900/15"
      />

      {/* Background Image with Ambient Scrim & Ken Burns zoom entrance */}
      <motion.div
        key={`bg-${pathFilter ?? "default"}-${category?.id ?? "none"}`}
        className="absolute inset-0 z-0 select-none overflow-hidden"
        initial={{ scale: 1.12, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          scale: { duration: 1.8, ease: LUXURY_EASE },
          opacity: { duration: 0.8, ease: "easeOut" },
        }}
      >
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-muted" aria-hidden />
        )}
        {/* Directional scrim for optimal contrast and readability */}
        <div
          className={cn(
            "absolute inset-0 pointer-events-none",
            isRtl
              ? "bg-gradient-to-l from-background/70 via-background/35 to-transparent/10 md:from-background/60 md:via-background/25 md:to-transparent/5"
              : "bg-gradient-to-r from-background/70 via-background/35 to-transparent/10 md:from-background/60 md:via-background/25 md:to-transparent/5",
          )}
        />
        {/* Soft vertical depth gradient blending into page background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/25 via-background/45 to-background pointer-events-none" />
      </motion.div>

      {/* Staggered Luxury Content Overlay */}
      <div className="page-shell relative z-10 flex w-full flex-col items-center py-16 text-center sm:py-20 md:py-24">
        <div className="mx-auto flex max-w-2xl flex-col items-center space-y-4">
          {/* Badge Tag */}
          <motion.div
            key={`badge-${pathFilter ?? "default"}`}
            initial={{ opacity: 0, y: 18, filter: "blur(4px)", scale: 0.94 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: LUXURY_EASE }}
            className="flex items-center gap-2"
          >
            <Badge
              variant="secondary"
              className="px-3.5 py-1 text-xs font-semibold uppercase tracking-widest bg-secondary-900/80 text-secondary-50 dark:bg-secondary-100/90 dark:text-secondary-900 backdrop-blur-md border border-secondary-800/30 shadow-xs"
            >
              {t("meta.title")}
            </Badge>
          </motion.div>

          {/* Hero Title */}
          <motion.h1
            key={`title-${pathFilter ?? "default"}-${title}`}
            id="shop-hero-heading"
            initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.85, delay: 0.35, ease: LUXURY_EASE }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl drop-shadow-xs"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          {subtitle ? (
            <motion.p
              key={`sub-${pathFilter ?? "default"}`}
              initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.75, delay: 0.5, ease: LUXURY_EASE }}
              className="mx-auto max-w-xl text-sm font-medium leading-relaxed text-foreground/85 dark:text-foreground/90 sm:text-base md:text-lg drop-shadow-xs"
            >
              {subtitle}
            </motion.p>
          ) : null}

          {/* Decorative luxury accent line */}
          <motion.div
            key={`line-${pathFilter ?? "default"}`}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.65, ease: LUXURY_EASE }}
            className="h-0.5 w-12 rounded-full bg-primary-500/60"
          />
        </div>
      </div>
    </section>
  );
}
