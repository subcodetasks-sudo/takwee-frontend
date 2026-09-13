"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Minus, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ProductPrice } from "@/features/product";
import { PRODUCT_SWATCH_CLASSES } from "@/features/product/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ProductColor } from "@/features/product/types";
import type { CartItem } from "../types";

interface CartItemRowProps {
  item: CartItem;
  index?: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const FAST_SMOOTH_EASE = [0.23, 1, 0.32, 1] as const;

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: FAST_SMOOTH_EASE,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -6,
    transition: {
      duration: 0.18,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export function CartItemRow({
  item,
  index = 0,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  const tProducts = useTranslations("Products");
  const tColors = useTranslations("ProductCard.colors");
  const tItem = useTranslations("CartPage.item");

  const selectedColor =
    item.product.colors.find((c) => c.id === item.selectedColorId) ??
    item.product.colors[0];

  const swatchClass = selectedColor?.swatch
    ? PRODUCT_SWATCH_CLASSES[selectedColor.swatch] ?? "bg-foreground"
    : "bg-foreground";

  const thumbnail =
    selectedColor?.images[0] ??
    item.product.colors[0]?.images[0] ??
    "/imgs/hero-slide-1.jpg";

  const productName =
    item.product.name?.trim() ||
    (tProducts.has(item.product.nameKey)
      ? tProducts(item.product.nameKey)
      : item.product.nameKey);

  const getColorName = (color?: ProductColor) => {
    if (!color) return "";
    if (tColors.has(color.nameKey)) return tColors(color.nameKey);
    return color.name?.trim() || color.nameKey || color.id;
  };

  return (
    <motion.div
      layout
      variants={itemVariants}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.995 }}
      transition={{ layout: { duration: 0.22, ease: FAST_SMOOTH_EASE } }}
      className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 rounded-2xl sm:rounded-3xl border border-border/80 bg-card/90 p-3.5 sm:p-5 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-primary/30 hover:shadow-md"
    >
      {/* Product Image & Main Details (Side-by-side on mobile & desktop) */}
      <div className="flex w-full sm:w-auto items-start gap-3 sm:gap-5 flex-1 min-w-0">
        {/* Product Image Thumbnail */}
        <Link
          href={`/products/${item.product.slug}`}
          className="relative aspect-3/4 w-18 sm:w-24 shrink-0 overflow-hidden rounded-xl sm:rounded-2xl border border-border/60 bg-muted/40 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Image
            src={thumbnail}
            alt={productName}
            fill
            sizes="(max-width: 640px) 72px, 96px"
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-108"
          />
        </Link>

        {/* Product Info & Attributes */}
        <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/products/${item.product.slug}`}
              className="font-medium text-xs sm:text-base text-foreground hover:text-primary transition-colors line-clamp-1"
            >
              {productName}
            </Link>

            {/* Mobile Remove button */}
            <div className="sm:hidden -mt-0.5 -me-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(item.id)}
                aria-label={tItem("remove")}
                className="size-7 rounded-lg text-muted-foreground hover:text-error hover:bg-error/10 active:scale-90 transition-transform"
              >
                <Trash2 className="size-3.5" aria-hidden />
              </Button>
            </div>
          </div>

          {/* In stock status indicator */}
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-success font-medium">
            <CheckCircle2 className="size-3 sm:size-3.5 shrink-0" aria-hidden />
            <span>{tItem("inStock")}</span>
          </div>

          {/* Selected Variations (Size & Color) */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs pt-0.5">
            {item.selectedSize ? (
              <span className="inline-flex items-center rounded-md sm:rounded-lg border border-border/70 bg-muted/50 px-2 sm:px-2.5 py-0.5 text-muted-foreground">
                <span className="font-medium me-1">{tItem("size")}:</span>
                <span className="font-semibold text-foreground">{item.selectedSize}</span>
              </span>
            ) : null}

            {selectedColor ? (
              <span className="inline-flex items-center gap-1.5 rounded-md sm:rounded-lg border border-border/70 bg-muted/50 px-2 sm:px-2.5 py-0.5 text-muted-foreground">
                <span
                  className={cn("size-2 sm:size-2.5 rounded-full ring-1 ring-border/80", !selectedColor.hex && swatchClass)}
                  style={selectedColor.hex ? { backgroundColor: selectedColor.hex } : undefined}
                  aria-hidden
                />
                <span className="font-medium me-0.5">{tItem("color")}:</span>
                <span className="font-semibold text-foreground">
                  {getColorName(selectedColor)}
                </span>
              </span>
            ) : null}
          </div>

          {/* Unit price */}
          <div className="text-[11px] sm:text-xs text-muted-foreground pt-0.5">
            <span>{tItem("unitPrice")}: </span>
            <ProductPrice amountTRY={item.product.priceTRY} className="font-medium" />
          </div>
        </div>
      </div>

      {/* Quantity Stepper & Line Price */}
      <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-3 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60 shrink-0">
        {/* Stepper with tactile micro-interactions */}
        <div className="inline-flex items-center rounded-xl border border-border/80 bg-background/80 p-0.5 shadow-2xs">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            aria-label={item.quantity === 1 ? tItem("remove") : tItem("decrease")}
            className="size-7 sm:size-8 rounded-lg text-foreground hover:bg-muted active:scale-90 transition-transform"
          >
            {item.quantity === 1 ? (
              <Trash2 className="size-3 sm:size-3.5 text-muted-foreground hover:text-error" />
            ) : (
              <Minus className="size-3 sm:size-3.5" />
            )}
          </Button>

          {/* Animated Quantity Counter */}
          <motion.span
            key={item.quantity}
            initial={{ scale: 1.25, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="min-w-7 sm:min-w-8 text-center text-xs sm:text-sm font-semibold tabular-nums text-foreground select-none"
          >
            {item.quantity}
          </motion.span>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            aria-label={tItem("increase")}
            className="size-7 sm:size-8 rounded-lg text-foreground hover:bg-muted active:scale-90 transition-transform"
          >
            <Plus className="size-3 sm:size-3.5" />
          </Button>
        </div>

        {/* Total Price for this item with responsive scale bounce */}
        <motion.div
          key={item.product.priceTRY * item.quantity}
          initial={{ scale: 0.96, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="text-end min-w-20 sm:min-w-24"
        >
          <ProductPrice
            amountTRY={item.product.priceTRY * item.quantity}
            className="text-sm sm:text-lg font-bold sm:font-semibold text-foreground tracking-tight"
          />
        </motion.div>

        {/* Desktop Remove Button with Tooltip */}
        <div className="hidden sm:block">
          <TooltipProvider delay={100}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(item.id)}
                    aria-label={tItem("remove")}
                    className="size-8 rounded-xl text-muted-foreground hover:text-error hover:bg-error/10 active:scale-90 transition-all"
                  />
                }
              >
                <Trash2 className="size-4" aria-hidden />
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6} className="text-xs">
                {tItem("remove")}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  );
}
