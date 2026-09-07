"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { Link } from "@/i18n/routing";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Plus } from "@/components/animate-ui/icons/plus";
import { cn } from "@/lib/utils";
import { PRODUCT_SWATCH_CLASSES, type Product } from "../types";
import { ProductPrice } from "./ProductPrice";
import { Check } from "@/components/animate-ui/icons/check";

const COLOR_IMAGE_EASE = [0.21, 0.47, 0.32, 0.98] as const;

interface ProductCardProps {
  product: Product;
  className?: string;
  onAddToCart?: (product: Product, selectedColorId: string) => void;
}

export function ProductCard({
  product,
  className,
  onAddToCart,
}: ProductCardProps) {
  const t = useTranslations("ProductCard");
  const tColors = useTranslations("ProductCard.colors");
  const tProducts = useTranslations("Products");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [selectedColorId, setSelectedColorId] = useState(product.colors[0]?.id);
  const selectedColor =
    product.colors.find((color) => color.id === selectedColorId) ??
    product.colors[0];

  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (!isAdded) return;
    const timer = setTimeout(() => {
      setIsAdded(false);
    }, 1600);
    return () => clearTimeout(timer);
  }, [isAdded]);

  const handleAddToCart = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product, selectedColor?.id ?? product.colors[0]?.id);
    setIsAdded(true);
  };

  const images = selectedColor?.images ?? [];
  const productName = tProducts(product.nameKey);
  const href = `/products/${product.slug}`;
  const rating = product.rating ?? 4.9;
  const reviewsCount = product.reviewsCount ?? 28;

  const isOnSale =
    product.badge === "sale" ||
    (product.compareAtPriceTRY != null &&
      product.compareAtPriceTRY > product.priceTRY);

  const discountPercent =
    product.compareAtPriceTRY != null &&
    product.compareAtPriceTRY > product.priceTRY
      ? Math.round(
          ((product.compareAtPriceTRY - product.priceTRY) /
            product.compareAtPriceTRY) *
            100,
        )
      : 0;

  return (
    <article
      className={cn(
        "group/card flex h-full flex-col overflow-hidden rounded-xl sm:rounded-2xl bg-card",
        "ring-1 ring-border/60 transition-shadow duration-300",
        "hover:shadow-md",
        className,
      )}
    >
      <div className="relative aspect-3/4 w-full overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={selectedColor?.id ?? "no-color"}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: COLOR_IMAGE_EASE }}
          >
            <ProductImageCarousel
              images={images}
              alt={productName}
              href={href}
              isRtl={isRtl}
            />
          </motion.div>
        </AnimatePresence>

        {isOnSale ? (
          <Badge
            className="absolute inset-s-2 top-2 sm:inset-s-3 sm:top-3 z-20 h-5 sm:h-6 rounded sm:rounded-md border-0 px-2 sm:px-2.5 text-[10px] sm:text-xs font-bold tracking-wider sm:tracking-widest uppercase shadow-sm bg-error text-error-foreground"
          >
            {discountPercent > 0 ? `-${discountPercent}%` : t("sale")}
          </Badge>
        ) : product.badge ? (
          <Badge
            className="absolute inset-s-2 top-2 sm:inset-s-3 sm:top-3 z-20 h-5 sm:h-6 rounded sm:rounded-md border-0 px-2 sm:px-2.5 text-[10px] sm:text-xs font-semibold tracking-wider sm:tracking-widest uppercase shadow-sm bg-background/95 text-foreground backdrop-blur-sm ring-1 ring-border"
          >
            {t(product.badge)}
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 px-3 py-3 sm:px-3.5 sm:py-3.5">
        <Link
          href={href}
          className="outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          <h3 className="text-sm font-medium tracking-tight text-foreground line-clamp-2 transition-colors group-hover/card:text-primary-800 dark:group-hover/card:text-primary-200">
            {productName}
          </h3>
        </Link>

        {/* Stars Rating */}
        <div
          className="flex items-center gap-1.5"
          aria-label={t("ratingAria", { rating: rating.toFixed(1) })}
        >
          <div className="flex items-center gap-0.5 text-warning" aria-hidden>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "size-3 sm:size-3.5",
                  star <= Math.round(rating)
                    ? "fill-warning stroke-warning"
                    : "fill-muted stroke-muted-foreground/30",
                )}
              />
            ))}
          </div>
          <span className="text-xs font-semibold tabular-nums text-foreground">
            {rating.toFixed(1)}
          </span>
          <span className="text-[11px] text-muted-foreground tabular-nums">
            ({reviewsCount})
          </span>
        </div>

        {/* Optimized Price Showcase */}
        <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 pt-0.5">
          <ProductPrice
            amountTRY={product.priceTRY}
            className={cn(
              "text-sm sm:text-base font-bold tracking-tight",
              isOnSale ? "text-error" : "text-foreground",
            )}
            iconClassName="size-3.5 sm:size-4 stroke-[2.4]"
          />
          {product.compareAtPriceTRY != null && isOnSale ? (
            <ProductPrice
              amountTRY={product.compareAtPriceTRY}
              className="text-xs sm:text-sm text-muted-foreground/75 line-through decoration-muted-foreground/50 tabular-nums"
              iconClassName="size-3 stroke-[2]"
            />
          ) : null}
          {isOnSale && discountPercent > 0 ? (
            <Badge
              variant="secondary"
              className="h-5 rounded-md px-1.5 text-[10px] sm:text-[11px] font-bold border-0 bg-error-muted text-error dark:bg-error-muted dark:text-error-foreground tracking-tight shadow-none"
            >
              {t("discount", { percent: discountPercent })}
            </Badge>
          ) : null}
        </div>

        {/* Card Footer: Add to Cart button at bottom-left, swatches on the right */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-1 [direction:ltr]">
          <TooltipProvider delay={100}>
            <Tooltip>
              <AnimateIcon animateOnHover className="inline-flex">
                <TooltipTrigger
                  type="button"
                  onClick={handleAddToCart}
                  aria-label={isAdded ? t("addedToCart") : t("addToCart")}
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-md border transition-all duration-200 outline-none select-none cursor-pointer",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    isAdded
                      ? "bg-success text-success-foreground border-success"
                      : "bg-primary text-primary-foreground border-primary/20 hover:bg-primary/85 hover:border-primary/40 active:scale-95 shadow-xs",
                  )}
                >
                  {isAdded ? (
                    <Check size={16} animate/>
                  ) : (
                    <Plus size={16} />
                  )}
                </TooltipTrigger>
              </AnimateIcon>
              <TooltipContent
                side="top"
                align="start"
                sideOffset={6}
                className="text-xs font-medium"
              >
                {isAdded ? t("addedToCart") : t("addToCart")}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {product.colors.length > 0 && (
            <ul className="flex flex-wrap items-center justify-end gap-1.5" role="list">
              {product.colors.map((color) => {
                const isSelected = color.id === selectedColor?.id;
                const colorName = tColors(color.nameKey);

                return (
                  <li key={color.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedColorId(color.id)}
                      aria-label={t("selectColor", { color: colorName })}
                      aria-pressed={isSelected}
                      title={colorName}
                      className={cn(
                        "size-5 rounded-full ring-1 ring-border transition-all duration-200",
                        "hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                        PRODUCT_SWATCH_CLASSES[color.swatch],
                        isSelected &&
                          "ring-2 ring-ring ring-offset-2 ring-offset-card",
                      )}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}

interface ProductImageCarouselProps {
  images: string[];
  alt: string;
  href: string;
  isRtl: boolean;
}

function ProductImageCarousel({
  images,
  alt,
  href,
  isRtl,
}: ProductImageCarouselProps) {
  const t = useTranslations("ProductCard");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const hasMultiple = images.length > 1;

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  const slideAlts = useMemo(
    () =>
      images.map((_, index) =>
        images.length > 1
          ? `${alt} — ${t("imageIndex", { current: index + 1, total: images.length })}`
          : alt,
      ),
    [alt, images, t],
  );

  if (images.length === 0) {
    return (
      <div className="relative aspect-3/4 w-full bg-muted" aria-hidden />
    );
  }

  if (!hasMultiple) {
    return (
      <Link href={href} className="relative block aspect-3/4 w-full overflow-hidden">
        <Image
          src={images[0]}
          alt={alt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-500 ease-out md:group-hover/card:scale-105"
        />
      </Link>
    );
  }

  return (
    <Carousel
      setApi={setApi}
      opts={{
        loop: true,
        direction: isRtl ? "rtl" : "ltr",
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent className="ml-0">
        {images.map((src, index) => (
          <CarouselItem key={`${src}-${index}`} className="pl-0">
            <Link
              href={href}
              className="relative block aspect-3/4 w-full overflow-hidden"
            >
              <Image
                src={src}
                alt={slideAlts[index] ?? alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover object-center transition-transform duration-500 ease-out md:group-hover/card:scale-105"
              />
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="absolute inset-x-0 bottom-2.5 z-20 flex items-center justify-center gap-1.5 pointer-events-none">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => scrollTo(index)}
            aria-label={t("goToImage", { index: index + 1 })}
            className={cn(
              "h-1.5 rounded-full pointer-events-auto transition-all duration-300",
              current === index
                ? "w-5 bg-primary shadow-sm"
                : "w-1.5 bg-background/70 hover:bg-background",
            )}
          />
        ))}
      </div>
    </Carousel>
  );
}
