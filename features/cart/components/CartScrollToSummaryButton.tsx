"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowDown, ReceiptText } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ProductPrice } from "@/features/product";

interface CartScrollToSummaryButtonProps {
  totalTRY: number;
  /** Element id of the order summary section to observe and scroll to. */
  targetId?: string;
  /** next-intl namespace providing `scrollToSummary` and `total`. */
  labelsNamespace?: string;
}

const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

export function CartScrollToSummaryButton({
  totalTRY,
  targetId = "cart-order-summary",
  labelsNamespace = "CartPage.summary",
}: CartScrollToSummaryButtonProps) {
  const t = useTranslations(labelsNamespace);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    // Show when the summary (at the bottom) is not yet in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px 0px 0px",
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  const handleScrollToSummary = () => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.94 }}
          transition={{ duration: 0.32, ease: LUXURY_EASE }}
          className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:end-6 z-40 lg:hidden pointer-events-auto"
        >
          <motion.button
            type="button"
            onClick={handleScrollToSummary}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            aria-label={t("scrollToSummary")}
            className="group flex w-full sm:w-auto items-center justify-between sm:justify-start gap-3.5 rounded-2xl border border-primary-700/30 bg-primary px-4 sm:px-5 py-3 text-primary-foreground shadow-lg backdrop-blur-md transition-shadow hover:shadow-xl cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary-foreground/15 text-primary-foreground">
                <ReceiptText className="size-4" aria-hidden />
              </span>
              <div className="text-start">
                <span className="block text-xs font-semibold tracking-tight">
                  {t("scrollToSummary")}
                </span>
                <span className="block text-[10px] text-primary-foreground/80 -mt-0.5">
                  {t("total")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 ps-2 border-s border-primary-foreground/20">
              <ProductPrice
                amountTRY={totalTRY}
                className="text-sm font-bold tracking-tight text-primary-foreground"
              />
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="flex size-6 items-center justify-center rounded-lg bg-primary-foreground/20 text-primary-foreground"
              >
                <ArrowDown className="size-3.5" aria-hidden />
              </motion.div>
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
