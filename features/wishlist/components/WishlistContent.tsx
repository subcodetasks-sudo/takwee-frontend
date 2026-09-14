"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "@/i18n/routing";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { ProductCard } from "@/features/product";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { useWishlist } from "../hooks/useWishlist";
import { WishlistHeader } from "./WishlistHeader";
import { WishlistEmptyState } from "./WishlistEmptyState";

export function WishlistContent() {
  const t = useTranslations("WishlistPage");
  const tToasts = useTranslations("WishlistPage.toasts");
  const { items, itemCount, isHydrated, clear } = useWishlist();

  const handleClearAll = () => {
    clear();
    gooeyToast.success(tToasts("cleared"));
  };

  return (
    <div className="space-y-6 sm:space-y-10">
      {isHydrated && itemCount > 0 ? (
        <WishlistHeader
          actionsOnly
          itemCount={itemCount}
          onClearAll={handleClearAll}
        />
      ) : null}

      <AnimatePresence mode="wait">
        {!isHydrated ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            aria-hidden
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="aspect-3/4 w-full animate-pulse rounded-2xl bg-muted/60" />
                <div className="space-y-2 px-1">
                  <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted/50" />
                  <div className="h-3.5 w-1/3 animate-pulse rounded-md bg-muted/40" />
                </div>
              </div>
            ))}
          </motion.div>
        ) : itemCount === 0 ? (
          <motion.div
            key="empty"
            exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
          >
            <WishlistEmptyState />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
            className="space-y-8 sm:space-y-10"
          >
            <StaggerContainer
              staggerDelay={0.06}
              delayChildren={0.02}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <StaggerItem
                    key={item.id}
                    layout
                    exit={{
                      opacity: 0,
                      y: -10,
                      transition: {
                        duration: 0.2,
                        ease: [0.21, 0.47, 0.32, 0.98],
                      },
                    }}
                    className="h-full"
                  >
                    <ProductCard product={item.product} />
                  </StaggerItem>
                ))}
              </AnimatePresence>
            </StaggerContainer>

            <FadeIn direction="up">
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6">
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft
                    className="size-3.5 rtl:rotate-180 transition-transform duration-200 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5"
                    aria-hidden
                  />
                  {t("backToShop")}
                </Link>
                <span className="text-xs text-muted-foreground">
                  {t("itemCount", { count: itemCount })}
                </span>
              </div>
            </FadeIn>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
