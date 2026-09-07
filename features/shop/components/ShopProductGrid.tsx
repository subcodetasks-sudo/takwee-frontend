"use client";

import { useTranslations } from "next-intl";
import { motion, type Variants } from "motion/react";
import { ProductCard } from "@/features/product";
import type { Product } from "@/features/product/types";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

interface ShopProductGridProps {
  products: Product[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

export function ShopProductGrid({ products }: ShopProductGridProps) {
  const t = useTranslations("ShopPage.catalog");
  const gridKey = products.map((product) => product.id).join("|");

  if (products.length === 0) {
    return (
      <Empty className="min-h-72 border border-dashed border-border bg-muted/30">
        <EmptyHeader>
          <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
          <EmptyDescription>{t("emptyDescription")}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <motion.div
      key={gridKey}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={cn("grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3")}
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants} className="h-full">
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
