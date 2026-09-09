"use client";

import { useTranslations } from "next-intl";
import { StaggerContainer, StaggerItem } from "@/components/animations";
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
    <StaggerContainer
      key={gridKey}
      staggerDelay={0.06}
      delayChildren={0.02}
      className={cn("grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3")}
    >
      {products.map((product) => (
        <StaggerItem key={product.id} className="h-full">
          <ProductCard product={product} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}

