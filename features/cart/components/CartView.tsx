"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { Link } from "@/i18n/routing";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { useCart } from "../hooks/useCart";
import { CartHeader } from "./CartHeader";
import { CartEmptyState } from "./CartEmptyState";
import { CartItemRow } from "./CartItemRow";
import { CartOrderSummary } from "./CartOrderSummary";
import { CartScrollToSummaryButton } from "./CartScrollToSummaryButton";

const FAST_SMOOTH_EASE = [0.23, 1, 0.32, 1] as const;

const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

export function CartView() {
  const tToasts = useTranslations("CartPage.toasts");
  const tCart = useTranslations("CartPage");
  const {
    items,
    itemCount,
    subtotalTRY,
    isHydrated,
    updateQuantity,
    removeItem,
    clear,
  } = useCart();

  const handleClearAll = () => {
    clear();
    gooeyToast.success(tToasts("cleared"));
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    gooeyToast.success(tToasts("removed"));
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    updateQuantity(id, qty);
  };

  if (!isHydrated) {
    return (
      <section className="w-full flex-1 py-4 sm:py-8 md:py-12">
        <div className="space-y-6 sm:space-y-10">
          <CartHeader itemCount={0} />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            <div className="lg:col-span-8 space-y-3 sm:space-y-4">
              <div className="h-12 sm:h-14 w-full animate-pulse rounded-2xl bg-muted/60" />
              <div className="h-28 sm:h-32 w-full animate-pulse rounded-2xl sm:rounded-3xl bg-muted/60" />
              <div className="h-28 sm:h-32 w-full animate-pulse rounded-2xl sm:rounded-3xl bg-muted/60" />
            </div>
            <div className="lg:col-span-4">
              <div className="h-96 w-full animate-pulse rounded-2xl sm:rounded-3xl bg-muted/60" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="w-full flex-1 py-4 sm:py-8 md:py-12">
        <div className="space-y-6 sm:space-y-10">
          <CartHeader itemCount={0} />
          <CartEmptyState />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex-1 py-4 sm:py-8 md:py-12">
      <div className="space-y-5 sm:space-y-8">
        <CartHeader
          itemCount={itemCount}
          onClearAll={handleClearAll}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-10 items-start">
          {/* Items first (summary last on mobile & in DOM) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-3 sm:space-y-5">
            {/* List of cart items with fluid choreographed entrance */}
            <motion.div
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2.5 sm:space-y-4"
            >
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    index={index}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Return to shop navigation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.25, ease: FAST_SMOOTH_EASE }}
              className="flex items-center justify-between pt-1 sm:pt-2"
            >
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft
                  className="size-4 rtl:rotate-180 transition-transform duration-200 group-hover:-translate-x-1 rtl:group-hover:translate-x-1"
                  aria-hidden
                />
                <span>{tCart("continueShopping")}</span>
              </Link>
            </motion.div>
          </div>

          {/* Order summary last */}
          <motion.aside
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.04, ease: FAST_SMOOTH_EASE }}
            className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28"
          >
            <CartOrderSummary
              subtotalTRY={subtotalTRY}
              itemCount={itemCount}
            />
          </motion.aside>
        </div>
      </div>

      {/* Floating Scroll-to-Summary button on small screens */}
      <CartScrollToSummaryButton
        totalTRY={subtotalTRY + Math.round(subtotalTRY * 0.1)}
      />
    </section>
  );
}
