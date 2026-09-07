"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Check, Minus, Plus, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations";
import { cn } from "@/lib/utils";
import {
  PRODUCT_SWATCH_CLASSES,
  type AbayaSize,
  type Product,
} from "../types";
import { ProductPrice } from "./ProductPrice";
import { SizeGuideDialog } from "./SizeGuideDialog";
import { HeightSizeCalculator } from "./HeightSizeCalculator";
import { useProductDetails } from "../context/ProductDetailsContext";
import { ProductImageZoom } from "./ProductImageZoom";

const SIZE_ROWS = [
  { size: "52", length: "130", bust: "52" },
  { size: "54", length: "135", bust: "54" },
  { size: "56", length: "140", bust: "56" },
  { size: "58", length: "145", bust: "58" },
  { size: "60", length: "150", bust: "60" },
] as const;

interface ProductDetailsHeroProps {
  product: Product;
  productName: string;
  onAddToCart?: (payload: {
    product: Product;
    colorId: string;
    size: AbayaSize;
    quantity: number;
  }) => void;
}

export function ProductDetailsHero({
  product,
  productName,
  onAddToCart,
}: ProductDetailsHeroProps) {
  const t = useTranslations("ProductDetails");
  const tColors = useTranslations("ProductCard.colors");
  const tGuide = useTranslations("ProductDetails.sizeGuide");

  const context = useProductDetails();

  const [localColorId, setLocalColorId] = useState(product.colors[0]?.id);
  const [localImageIndex, setLocalImageIndex] = useState(0);
  const [localSize, setLocalSize] = useState<AbayaSize | null>(
    product.sizes[0] ?? null,
  );
  const [localQuantity, setLocalQuantity] = useState(1);
  const [localIsAdded, setLocalIsAdded] = useState(false);

  const selectedColorId = context ? context.selectedColorId : localColorId;
  const setSelectedColorId = context
    ? context.setSelectedColorId
    : setLocalColorId;
  const activeImageIndex = context
    ? context.activeImageIndex
    : localImageIndex;
  const setActiveImageIndex = context
    ? context.setActiveImageIndex
    : setLocalImageIndex;
  const selectedSize = context ? context.selectedSize : localSize;
  const setSelectedSize = context ? context.setSelectedSize : setLocalSize;
  const quantity = context ? context.quantity : localQuantity;
  const setQuantity = context ? context.setQuantity : setLocalQuantity;
  const isAdded = context ? context.isAdded : localIsAdded;
  const setIsAdded = context ? context.setIsAdded : setLocalIsAdded;

  const selectedColor =
    product.colors.find((color) => color.id === selectedColorId) ??
    product.colors[0];
  const images = selectedColor?.images ?? [];
  const activeImage = images[activeImageIndex] ?? images[0];

  const isOnSale =
    product.badge === "sale" ||
    (product.compareAtPriceTRY != null &&
      product.compareAtPriceTRY > product.priceTRY);

  const savingsTRY =
    product.compareAtPriceTRY != null &&
    product.compareAtPriceTRY > product.priceTRY
      ? product.compareAtPriceTRY - product.priceTRY
      : 0;

  const discountPercent =
    product.compareAtPriceTRY != null &&
    product.compareAtPriceTRY > product.priceTRY
      ? Math.round(
          ((product.compareAtPriceTRY - product.priceTRY) /
            product.compareAtPriceTRY) *
            100,
        )
      : 0;

  useEffect(() => {
    if (context) return;
    if (!localIsAdded) return;
    const timer = setTimeout(() => setLocalIsAdded(false), 1600);
    return () => clearTimeout(timer);
  }, [context, localIsAdded]);

  const handleSelectColor = (colorId: string) => {
    setSelectedColorId(colorId);
    setActiveImageIndex(0);
  };

  const handleAddToCart = () => {
    if (context) {
      context.handleAddToCart();
      return;
    }
    if (!selectedSize || !product.inStock) return;
    onAddToCart?.({
      product,
      colorId: selectedColor?.id ?? product.colors[0]?.id,
      size: selectedSize,
      quantity,
    });
    setIsAdded(true);
  };

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-14">
      <div className="w-full min-w-0 self-start">
        <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-start">
          {images.length > 1 ? (
            <ul
              className="order-2 flex gap-2 overflow-x-auto pb-1 lg:order-1 lg:w-20 lg:shrink-0 lg:flex-col lg:overflow-x-hidden lg:pb-0"
              role="list"
            >
              {images.map((src, index) => {
                const isActive = index === activeImageIndex;
                return (
                  <li key={`${src}-${index}`} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      aria-label={t("goToImage", { index: index + 1 })}
                      aria-pressed={isActive}
                      className={cn(
                        "relative block size-16 overflow-hidden rounded-md ring-1 transition-all lg:size-20",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        isActive
                          ? "ring-2 ring-ring ring-offset-2 ring-offset-background"
                          : "ring-border/70 hover:ring-border",
                      )}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover object-center"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}

          {activeImage ? (
            <ProductImageZoom
              className="order-1 lg:order-2 lg:flex-1"
              src={activeImage}
              alt={
                images.length > 1
                  ? `${productName} — ${t("imageIndex", {
                      current: activeImageIndex + 1,
                      total: images.length,
                    })}`
                  : productName
              }
              priority
            />
          ) : (
            <div className="order-1 aspect-3/4 min-w-0 rounded-xl bg-muted lg:order-2 lg:flex-1" />
          )}
        </div>
      </div>

      <FadeIn direction="up" delay={0.08} className="min-w-0">
        <div className="flex flex-col gap-6 lg:pt-1">
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {productName}
            </h1>

            {/* Product Rating Stars */}
            <div className="flex items-center gap-1.5">
              <div
                className="flex items-center gap-0.5 text-warning"
                aria-label="4.9 out of 5 stars"
              >
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="size-4 fill-warning stroke-warning"
                    aria-hidden
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm font-bold tabular-nums text-foreground">
                4.9
              </span>
            </div>

            {/* Elevated Price & Stock Showcase */}
            <div className="rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 shadow-xs">
              <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3.5">
                <ProductPrice
                  amountTRY={product.priceTRY}
                  className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                  iconClassName="size-7 sm:size-8 stroke-[2.4]"
                />
                {product.compareAtPriceTRY != null && isOnSale ? (
                  <ProductPrice
                    amountTRY={product.compareAtPriceTRY}
                    className="text-base sm:text-lg text-muted-foreground line-through decoration-muted-foreground/60 tabular-nums"
                  />
                ) : null}
                {savingsTRY > 0 ? (
                  <Badge className="rounded-full border-0 bg-success-muted px-2.5 py-1 text-xs font-semibold text-success">
                    {discountPercent > 0
                      ? t("discount", { percent: discountPercent })
                      : t("save")}
                  </Badge>
                ) : null}
                {product.badge === "new" ? (
                  <Badge
                    variant="outline"
                    className="rounded-full border-secondary-300 bg-secondary-50/70 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-secondary-800 dark:border-secondary-800 dark:bg-secondary-950 dark:text-secondary-200"
                  >
                    {t("new")}
                  </Badge>
                ) : null}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex size-2 rounded-full",
                      product.inStock
                        ? "bg-success ring-4 ring-success/20 animate-pulse"
                        : "bg-error ring-4 ring-error/20",
                    )}
                  />
                  <span
                    className={cn(
                      "font-semibold",
                      product.inStock ? "text-success" : "text-error",
                    )}
                  >
                    {product.inStock ? t("inStock") : t("outOfStock")}
                  </span>
                </div>
                <span className="font-medium text-muted-foreground">
                  {t("inclusiveVat")}
                </span>
              </div>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-3 rounded-xl border border-border/70 bg-muted/25 p-3.5 text-xs sm:text-sm">
            <div className="flex flex-col gap-0.5">
              <dt className="text-muted-foreground">{t("modelNumber")}</dt>
              <dd className="font-semibold tabular-nums text-foreground">
                {product.sku}
              </dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-muted-foreground">{t("weight")}</dt>
              <dd className="font-semibold text-foreground">
                {t("weightValue", { value: product.weightKg })}
              </dd>
            </div>
          </dl>

          {product.colors.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {t("color")}
                  </span>
                  {selectedColor ? (
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
                      {tColors(selectedColor.nameKey)}
                    </span>
                  ) : null}
                </div>
                <span className="text-xs text-muted-foreground">
                  {product.colors.length} {t("color").toLowerCase()}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5" role="list">
                {product.colors.map((color) => {
                  const isSelected = color.id === selectedColor?.id;
                  const colorName = tColors(color.nameKey);
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => handleSelectColor(color.id)}
                      aria-label={t("selectColor", { color: colorName })}
                      aria-pressed={isSelected}
                      className={cn(
                        "group relative flex size-9 items-center justify-center rounded-full transition-all",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        isSelected
                          ? "scale-105 ring-2 ring-foreground ring-offset-2 ring-offset-background"
                          : "ring-1 ring-border/80 hover:scale-105 hover:ring-foreground/50",
                      )}
                    >
                      <span
                        className={cn(
                          "size-7 rounded-full ring-1 ring-black/15 shrink-0 transition-transform",
                          PRODUCT_SWATCH_CLASSES[color.swatch],
                          isSelected && "ring-1 ring-black/25",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Height-Based Size Calculator */}
          <HeightSizeCalculator
            selectedSize={selectedSize}
            onSelectSize={(size) => setSelectedSize(size)}
          />

          <div id="size-selector" className="space-y-3 scroll-mt-24">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {t("selectSize")}
                </span>
                {selectedSize ? (
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold tabular-nums text-foreground">
                    {selectedSize}
                  </span>
                ) : null}
              </div>
              <SizeGuideDialog
                selectedSize={selectedSize}
                onSelectSize={(size) => setSelectedSize(size)}
              />
            </div>

            <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
              {product.sizes.map((size) => {
                const isSelected = size === selectedSize;
                const sizeRow = SIZE_ROWS.find((r) => r.size === size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={isSelected}
                    className={cn(
                      "group flex flex-col items-center justify-center rounded-xl border py-2.5 px-2 text-center transition-all",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      isSelected
                        ? "border-foreground bg-foreground text-background shadow-xs ring-1 ring-foreground"
                        : "border-border bg-card text-foreground hover:border-foreground/40 hover:bg-muted/60",
                    )}
                  >
                    <span className="text-sm sm:text-base font-bold tabular-nums">
                      {size}
                    </span>
                    {sizeRow ? (
                      <span
                        className={cn(
                          "text-[10px] sm:text-[11px] font-normal tabular-nums mt-0.5",
                          isSelected
                            ? "text-background/80"
                            : "text-muted-foreground",
                        )}
                      >
                        {sizeRow.length} cm
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2.5">
            <p className="text-sm font-semibold text-foreground">{t("quantity")}</p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-xl border border-border bg-card shadow-2xs">
                <button
                  type="button"
                  aria-label={t("decreaseQuantity")}
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex size-11 items-center justify-center rounded-s-xl text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-30"
                >
                  <Minus className="size-4" />
                </button>
                <span
                  className="min-w-10 text-center text-sm font-bold tabular-nums"
                  aria-live="polite"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label={t("increaseQuantity")}
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="flex size-11 items-center justify-center rounded-e-xl text-foreground transition-colors hover:bg-muted"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              <Button
                type="button"
                size="lg"
                disabled={!product.inStock || !selectedSize}
                onClick={handleAddToCart}
                className={cn(
                  "min-h-11 flex-1 rounded-xl px-6 text-sm font-semibold sm:min-w-48 sm:flex-none transition-all shadow-xs",
                  isAdded &&
                    "bg-success text-success-foreground hover:bg-success/90",
                )}
              >
                {isAdded ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="size-4" />
                    {t("addedToCart")}
                  </span>
                ) : (
                  t("addToCart")
                )}
              </Button>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
