"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { ArrowRight, Check, Minus, Plus, Sparkles, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { getMaxSelectableQuantity, useCart } from "@/features/cart";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { cn } from "@/lib/utils";
import {
  PRODUCT_SWATCH_CLASSES,
  type AbayaSize,
  type Product,
  type ProductColor,
} from "../types";
import { ProductPrice } from "./ProductPrice";
import { HeightSizeCalculator } from "./HeightSizeCalculator";
import { useProductDetails } from "../context/ProductDetailsContext";
import { ProductImageZoom } from "./ProductImageZoom";
import { ProductDetailsWishlistButton } from "./ProductDetailsWishlistButton";
import { useAbayaSizeGuide } from "../hooks/useAbayaSizeGuide";
import { ProductRichText } from "./ProductRichText";

const COLOR_IMAGE_EASE = [0.21, 0.47, 0.32, 0.98] as const;

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

  const { isInCart: isCartInCart, getItemQuantity, isHydrated } = useCart();
  const context = useProductDetails();
  const { data: sizeGuide } = useAbayaSizeGuide();

  const sizeRows = useMemo(() => {
    if (sizeGuide?.rows && sizeGuide.rows.length > 0) {
      return sizeGuide.rows.map((r) => ({
        size: r.size,
        length: String(r.abaya_length),
        bust: String(r.chest_width),
      }));
    }
    return SIZE_ROWS;
  }, [sizeGuide?.rows]);

  const [localColorId, setLocalColorId] = useState(product.colors[0]?.id);
  const [localImageIndex, setLocalImageIndex] = useState(0);
  const [localSize, setLocalSize] = useState<AbayaSize | null>(
    product.sizes[0]?.name ?? null,
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
  const maxQuantity = context
    ? context.maxQuantity
    : getMaxSelectableQuantity(
        product,
        isHydrated ? getItemQuantity(product.id) : 0,
      );
  const isAdded = context ? context.isAdded : localIsAdded;
  const setIsAdded = context ? context.setIsAdded : setLocalIsAdded;
  const inCart = context
    ? context.isInCart
    : (isHydrated && isCartInCart(product.id)) || isAdded;

  const selectedColor =
    product.colors.find((color) => color.id === selectedColorId) ??
    product.colors[0];
  const selectedSizeOption =
    product.sizes.find((size) => size.name === selectedSize) ??
    product.sizes[0];
  const hasGuideCompatibleSizes = product.sizes.some((option) =>
    sizeRows.some((row) => row.size === option.name),
  );
  const images =
    selectedColor?.images && selectedColor.images.length > 0
      ? selectedColor.images
      : product.images && product.images.length > 0
        ? product.images
        : [];
  const activeImage = images[activeImageIndex] ?? images[0];

  const getColorName = (color?: ProductColor) => {
    if (!color) return "";
    if (color.name?.trim()) return color.name.trim();
    return tColors.has(color.nameKey) ? tColors(color.nameKey) : color.nameKey;
  };

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

  const handleAddToCart = (
    e?: MouseEvent<HTMLElement> | HTMLElement | null,
  ) => {
    const origin =
      e && typeof e === "object" && "currentTarget" in e
        ? e.currentTarget
        : e instanceof HTMLElement
          ? e
          : null;
    if (context) {
      context.handleAddToCart(origin);
      return;
    }
    if ((product.sizes.length > 0 && !selectedSize) || !product.inStock) return;
    onAddToCart?.({
      product,
      colorId: selectedColor?.id ?? product.colors[0]?.id ?? "",
      size: (selectedSize ?? "") as AbayaSize,
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
              className="order-2 -m-1.5 flex gap-2 overflow-x-auto p-1.5 scrollbar-none lg:order-1 lg:w-fit lg:shrink-0 lg:flex-col lg:overflow-visible"
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

          <div className="order-1 min-w-0 lg:order-2 lg:flex-1">
            <div className="relative aspect-3/4 min-w-0 overflow-hidden rounded-xl bg-muted">
              <AnimatePresence initial={false}>
                <motion.div
                  key={selectedColor?.id ?? "no-color"}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: COLOR_IMAGE_EASE }}
                >
                  {activeImage ? (
                    <ProductImageZoom
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
                      className="size-full rounded-xl aspect-auto"
                    />
                  ) : (
                    <div className="flex size-full flex-col items-center justify-center gap-3 bg-muted/40 p-6 text-center text-muted-foreground">
                      <div className="flex size-14 items-center justify-center rounded-2xl border border-border/80 bg-background/80 shadow-xs">
                        <Sparkles className="size-6 text-muted-foreground/60" />
                      </div>
                      <p className="text-xs font-medium text-foreground">
                        {productName}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {t("noImagePlaceholder")}
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <StaggerContainer
        staggerDelay={0.08}
        delayChildren={0.1}
        className="flex min-w-0 flex-col gap-6 lg:pt-1"
      >
        <StaggerItem>
          <div className="flex items-start justify-between gap-3">
            <h1 className="min-w-0 flex-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {productName}
            </h1>
            <ProductDetailsWishlistButton />
          </div>
        </StaggerItem>

        <StaggerItem>
          {(product.rating ?? 0) > 0 || (product.reviewsCount ?? 0) > 0 ? (
            <div className="flex items-center gap-1.5">
              <div
                className="flex items-center gap-0.5 text-warning"
                aria-label={`${(product.rating ?? 0).toFixed(1)} out of 5 stars`}
              >
                {[1, 2, 3, 4, 5].map((s) => {
                  const value = product.rating ?? 0;
                  const filled = value >= s - 0.25;
                  return (
                    <Star
                      key={s}
                      className={cn(
                        "size-4",
                        filled
                          ? "fill-warning stroke-warning"
                          : "fill-transparent stroke-warning/50",
                      )}
                      aria-hidden
                    />
                  );
                })}
              </div>
              <span className="text-xs font-bold tabular-nums text-foreground sm:text-sm">
                {(product.rating ?? 0).toFixed(1)}
              </span>
              {typeof product.reviewsCount === "number" &&
              product.reviewsCount > 0 ? (
                <span className="text-xs text-muted-foreground tabular-nums">
                  ({product.reviewsCount})
                </span>
              ) : null}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-100/80 px-2.5 py-0.5 text-xs font-medium text-secondary-900 dark:bg-secondary-950 dark:text-secondary-200">
                <Sparkles className="size-3 text-secondary-600 dark:text-secondary-400" />
                <span>{t("newRelease")}</span>
              </span>
              {product.categoryName ? (
                <span className="text-xs text-muted-foreground">
                  • {product.categoryName}
                </span>
              ) : null}
            </div>
          )}
        </StaggerItem>

        <StaggerItem>
          <div className="rounded-2xl border border-border/80 bg-card/60 p-4 shadow-xs sm:p-5">
            <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3.5">
              <ProductPrice
                amountTRY={product.priceTRY}
                className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                iconClassName="size-7 sm:size-8 stroke-[2.4]"
              />
              {product.compareAtPriceTRY != null && isOnSale ? (
                <ProductPrice
                  amountTRY={product.compareAtPriceTRY}
                  className="text-base text-muted-foreground line-through decoration-muted-foreground/60 tabular-nums sm:text-lg"
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

            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-border/50 pt-2.5 text-xs">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "flex size-2 shrink-0 rounded-full",
                    product.inStock
                      ? "bg-success ring-4 ring-success/20 animate-pulse"
                      : "bg-error ring-4 ring-error/20",
                  )}
                  aria-hidden
                />
                <span
                  className={cn(
                    "font-semibold",
                    product.inStock ? "text-success" : "text-error",
                  )}
                >
                  {product.inStock ? t("inStock") : t("outOfStock")}
                </span>
                {typeof product.stockQuantity === "number" ? (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
                      product.inStock && product.stockQuantity > 0
                        ? product.stockQuantity <= 5
                          ? "bg-warning-muted text-warning"
                          : "bg-muted text-muted-foreground"
                        : "bg-error-muted text-error",
                    )}
                  >
                    {product.inStock && product.stockQuantity > 0
                      ? product.stockQuantity <= 5
                        ? t("lowStock", { count: product.stockQuantity })
                        : t("stockCount", { count: product.stockQuantity })
                      : t("stockCount", { count: product.stockQuantity })}
                  </span>
                ) : null}
              </div>
              <span className="shrink-0 font-medium text-muted-foreground">
                {t("inclusiveVat")}
              </span>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <dl
            className={cn(
              "grid gap-3 rounded-xl border border-border/70 bg-muted/25 p-3.5 text-xs sm:text-sm",
              product.weightKg > 0 || product.categoryName
                ? "grid-cols-2"
                : "grid-cols-1",
            )}
          >
            <div className="flex flex-col gap-0.5">
              <dt className="text-muted-foreground">{t("modelNumber")}</dt>
              <dd className="font-semibold tabular-nums text-foreground">
                {product.sku}
              </dd>
            </div>
            {product.weightKg > 0 ? (
              <div className="flex flex-col gap-0.5">
                <dt className="text-muted-foreground">{t("weight")}</dt>
                <dd className="font-semibold text-foreground">
                  {t("weightValue", { value: product.weightKg })}
                </dd>
              </div>
            ) : product.categoryName ? (
              <div className="flex flex-col gap-0.5">
                <dt className="text-muted-foreground">
                  {t("category") || "Category"}
                </dt>
                <dd className="font-semibold text-foreground">
                  {product.categoryName}
                </dd>
              </div>
            ) : null}
          </dl>
        </StaggerItem>

        {product.colors.length > 0 ? (
          <StaggerItem>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {t("color")}
                  </span>
                  {selectedColor ? (
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
                      {getColorName(selectedColor)}
                    </span>
                  ) : null}
                </div>
                <span className="text-xs text-muted-foreground">
                  {product.colors.length} {t("color").toLowerCase()}
                </span>
              </div>

              <StaggerContainer
                staggerDelay={0.04}
                delayChildren={0.05}
                role="list"
                className="flex flex-wrap items-center gap-2.5"
              >
                {product.colors.map((color) => {
                  const isSelected = color.id === selectedColor?.id;
                  const colorName = getColorName(color);
                  return (
                    <StaggerItem key={color.id} role="listitem">
                      <button
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
                            "size-7 shrink-0 rounded-full ring-1 ring-black/15 transition-transform",
                            !color.hex && PRODUCT_SWATCH_CLASSES[color.swatch],
                            isSelected && "ring-1 ring-black/25",
                          )}
                          style={
                            color.hex
                              ? { backgroundColor: color.hex }
                              : undefined
                          }
                        />
                      </button>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </div>
          </StaggerItem>
        ) : null}

        {product.sizes.length > 0 ? (
          <>
            {hasGuideCompatibleSizes ? (
              <StaggerItem>
                <HeightSizeCalculator
                  selectedSize={selectedSize}
                  onSelectSize={(size) => setSelectedSize(size)}
                  guide={sizeGuide}
                />
              </StaggerItem>
            ) : null}

            <StaggerItem>
              <div id="size-selector" className="space-y-3 scroll-mt-24">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {t("selectSize")}
                    </span>
                    {selectedSize ? (
                      <span className="max-w-[12rem] truncate rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground sm:max-w-none">
                        {selectedSize}
                      </span>
                    ) : null}
                  </div>
                </div>

                <StaggerContainer
                  staggerDelay={0.04}
                  delayChildren={0.05}
                  className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 md:grid-cols-4 lg:grid-cols-5"
                >
                  {product.sizes.map((sizeOption) => {
                    const size = sizeOption.name;
                    const isSelected = size === selectedSize;
                    const sizeRow = sizeRows.find((r) => r.size === size);
                    return (
                      <StaggerItem key={sizeOption.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          aria-pressed={isSelected}
                          className={cn(
                            "group flex w-full flex-col items-center justify-center rounded-xl border px-2 py-2.5 text-center transition-all",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            isSelected
                              ? "border-foreground bg-foreground text-background shadow-xs ring-1 ring-foreground"
                              : "border-border bg-card text-foreground hover:border-foreground/40 hover:bg-muted/60",
                          )}
                        >
                          <span className="line-clamp-2 text-sm font-bold sm:text-base">
                            {size}
                          </span>
                          {sizeRow ? (
                            <span
                              className={cn(
                                "mt-0.5 text-[10px] font-normal tabular-nums sm:text-[11px]",
                                isSelected
                                  ? "text-background/80"
                                  : "text-muted-foreground",
                              )}
                            >
                              {sizeRow.length} {sizeGuide?.default_unit || "cm"}
                            </span>
                          ) : null}
                        </button>
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>

                {selectedSizeOption?.details ? (
                  <ProductRichText
                    content={selectedSizeOption.details}
                    className="rounded-xl border border-border/60 bg-muted/30 px-3.5 py-3 text-sm"
                  />
                ) : null}
              </div>
            </StaggerItem>
          </>
        ) : null}

        <StaggerItem>
          <div className="space-y-2.5">
            <p className="text-sm font-semibold text-foreground">
              {t("quantity")}
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1.5 sm:gap-3">
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
                  disabled={quantity >= maxQuantity}
                  onClick={() =>
                    setQuantity((q) => Math.min(maxQuantity, q + 1))
                  }
                  className="flex size-11 items-center justify-center rounded-e-xl text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-30"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              <div className="relative flex-1 sm:flex-none">
                <AnimatePresence>
                  {inCart ? (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.85 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.85 }}
                      transition={{ duration: 0.18 }}
                      className="pointer-events-none absolute -top-2.5 start-3.5 z-10"
                    >
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 rounded-full border-success/40 bg-success-muted px-2 py-0.5 text-[10px] font-semibold text-success shadow-2xs backdrop-blur-xs"
                      >
                        <Check className="size-2.5 stroke-[2.5]" aria-hidden />
                        <span>{t("inCart")}</span>
                      </Badge>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <Button
                  type="button"
                  size="lg"
                  disabled={
                    !product.inStock ||
                    maxQuantity <= 0 ||
                    (product.sizes.length > 0 && !selectedSize)
                  }
                  onClick={handleAddToCart}
                  className={cn(
                    "min-h-11 w-full rounded-xl px-6 text-sm font-semibold shadow-xs transition-all sm:min-w-44",
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

              <AnimatePresence>
                {inCart ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 4 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 basis-full sm:basis-auto sm:flex-none"
                  >
                    <Link
                      href="/checkout"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "lg" }),
                        "group min-h-11 w-full rounded-xl border-primary bg-transparent px-4 sm:px-6 text-sm font-semibold text-primary shadow-xs hover:bg-primary/5 hover:text-primary hover:shadow-md transition-all gap-2 flex items-center justify-center sm:min-w-44",
                      )}
                    >
                      <span>{t("proceedToPayment")}</span>
                      <ArrowRight
                        className="size-4 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                        aria-hidden
                      />
                    </Link>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}
