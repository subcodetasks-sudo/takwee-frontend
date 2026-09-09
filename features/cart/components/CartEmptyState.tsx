"use client";

import { useTranslations } from "next-intl";
import { ShoppingBag, Sparkles, ArrowRight, Truck, Gift, ShieldCheck } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: LUXURY_EASE,
      staggerChildren: 0.07,
      delayChildren: 0.08,
    },
  },
};

const badgeBoxVariants: Variants = {
  hidden: { opacity: 0, scale: 0.78, y: 14 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: LUXURY_EASE,
    },
  },
};

const sparklePopVariants: Variants = {
  hidden: { opacity: 0, scale: 0, rotate: -25 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 340,
      damping: 18,
      delay: 0.28,
    },
  },
};

const itemFadeVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: LUXURY_EASE,
    },
  },
};

const pillsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.22,
    },
  },
};

const pillVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.42,
      ease: LUXURY_EASE,
    },
  },
};

const perksContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.35,
    },
  },
};

const perkCardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.52,
      ease: LUXURY_EASE,
    },
  },
};

export function CartEmptyState() {
  const t = useTranslations("CartPage");

  const quickLinks = [
    { href: "/shop/new-in", label: t("empty.quickLinks.newIn") },
    { href: "/shop/linen", label: t("empty.quickLinks.linen") },
    { href: "/shop/casual", label: t("empty.quickLinks.casual") },
    { href: "/shop/formal", label: t("empty.quickLinks.formal") },
  ];

  const perks = [
    {
      icon: Truck,
      title: t("empty.features.shipping.title"),
      description: t("empty.features.shipping.description"),
    },
    {
      icon: Gift,
      title: t("empty.features.packaging.title"),
      description: t("empty.features.packaging.description"),
    },
    {
      icon: ShieldCheck,
      title: t("empty.features.craft.title"),
      description: t("empty.features.craft.description"),
    },
  ];

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="relative isolate overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-b from-card/90 via-card/70 to-muted/20 p-6 sm:p-10 md:p-16 shadow-xs backdrop-blur-sm"
    >
      {/* Soft atmospheric ambient glow with smooth breath transition */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: LUXURY_EASE }}
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-72 sm:size-96 rounded-full bg-primary-200/35 dark:bg-primary-900/15 blur-3xl"
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.3, ease: LUXURY_EASE, delay: 0.1 }}
        className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 size-64 sm:size-80 rounded-full bg-secondary-200/25 dark:bg-secondary-900/10 blur-3xl"
        aria-hidden
      />

      {/* Central Content */}
      <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
        {/* Layered Luxury Icon Badge with gentle hover and subtle micro-float */}
        <motion.div variants={badgeBoxVariants} className="relative mb-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.35, ease: LUXURY_EASE }}
            className="flex size-20 sm:size-24 items-center justify-center rounded-3xl border border-border/80 bg-background/85 shadow-xs backdrop-blur-md cursor-default"
          >
            <div className="flex size-14 sm:size-16 items-center justify-center rounded-2xl bg-primary-100/60 dark:bg-primary-950/70 text-primary-800 dark:text-primary-200">
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <ShoppingBag className="size-7 sm:size-8 stroke-[1.4]" aria-hidden />
              </motion.div>
            </div>
          </motion.div>

          {/* Floating micro sparkle badge */}
          <motion.span
            variants={sparklePopVariants}
            className="absolute -top-1.5 -end-1.5 flex size-6 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-xs ring-2 ring-background"
            aria-hidden
          >
            <Sparkles className="size-3" />
          </motion.span>
        </motion.div>

        {/* Eyebrow Label */}
        <motion.div variants={itemFadeVariants}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/60 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground shadow-2xs backdrop-blur-xs">
            {t("empty.eyebrow")}
          </span>
        </motion.div>

        {/* Title & Editorial Description */}
        <motion.h2
          variants={itemFadeVariants}
          className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl"
        >
          {t("empty.title")}
        </motion.h2>

        <motion.p
          variants={itemFadeVariants}
          className="mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-muted-foreground"
        >
          {t("empty.description")}
        </motion.p>

        {/* Primary Action Button with interactive micro-lift */}
        <motion.div
          variants={itemFadeVariants}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.div
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href="/shop"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "group h-11 px-8 rounded-xl font-medium shadow-xs hover:shadow-md transition-shadow gap-2",
              )}
            >
              <ShoppingBag className="size-4" aria-hidden />
              <span>{t("empty.cta")}</span>
              <ArrowRight
                className="size-3.5 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                aria-hidden
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* Curated Collection Discovery Pills */}
        <motion.div
          variants={pillsContainerVariants}
          className="mt-8 flex flex-col items-center gap-2.5"
        >
          <span className="text-[11px] font-medium tracking-wide uppercase text-muted-foreground/80">
            {t("empty.curatedTitle")}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {quickLinks.map((item) => (
              <motion.div
                key={item.href}
                variants={pillVariants}
                whileHover={{ y: -2, scale: 1.025 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={item.href}
                  className="inline-flex items-center rounded-full border border-border/80 bg-background/80 px-3.5 py-1.5 text-xs font-medium text-foreground shadow-2xs backdrop-blur-xs transition-colors hover:border-primary-300 hover:bg-muted/70 dark:hover:border-primary-700"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Feature Value Props / Boutique Perks */}
      <div className="relative mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-border/60">
        <motion.div
          variants={perksContainerVariants}
          className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
        >
          {perks.map((perk, index) => {
            const Icon = perk.icon;
            return (
              <motion.div
                key={index}
                variants={perkCardVariants}
                whileHover={{ y: -2.5 }}
                transition={{ duration: 0.22 }}
                className="flex flex-col items-center sm:items-start rounded-2xl border border-border/50 bg-background/40 p-4 sm:p-5 text-center sm:text-start backdrop-blur-xs transition-colors hover:bg-background/80 hover:border-border/80 shadow-2xs"
              >
                <div className="mb-2.5 flex size-9 items-center justify-center rounded-xl bg-primary-100/70 dark:bg-primary-950/70 text-primary-800 dark:text-primary-200 shadow-2xs">
                  <Icon className="size-4.5 stroke-[1.6]" aria-hidden />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-foreground">
                  {perk.title}
                </span>
                <p className="mt-1 text-[11px] sm:text-xs leading-relaxed text-muted-foreground">
                  {perk.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}
