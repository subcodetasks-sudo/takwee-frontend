"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { Link } from "@/i18n/routing";

const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

interface WishlistHeaderProps {
  itemCount?: number;
}

const headerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const headerItemVariants: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: LUXURY_EASE,
    },
  },
};

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: LUXURY_EASE,
    },
  },
};

export function WishlistHeader({ itemCount = 0 }: WishlistHeaderProps) {
  const t = useTranslations("WishlistPage");

  return (
    <motion.div
      variants={headerContainerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2 sm:space-y-3"
    >
      <motion.div variants={headerItemVariants}>
        <Link
          href="/shop"
          className="group inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft
            className="size-3.5 rtl:rotate-180 transition-transform duration-200 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5"
            aria-hidden
          />
          {t("backToShop")}
        </Link>
      </motion.div>

      <motion.div
        variants={titleVariants}
        className="flex flex-wrap items-end justify-between gap-3 sm:gap-4"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">
              {t("title")}
            </h1>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.18, duration: 0.4, ease: LUXURY_EASE }}
              className="rounded-full border border-border/70 bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground shadow-2xs"
            >
              {t("itemCount", { count: itemCount })}
            </motion.span>
          </div>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {t("subtitle")}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
