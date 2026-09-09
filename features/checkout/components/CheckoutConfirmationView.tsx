"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { motion, type Variants } from "motion/react";
import {
  ArrowRight,
  Banknote,
  Building2,
  Calendar,
  CreditCard,
  MapPin,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Copy } from "@/components/animate-ui/icons/copy";
import { Check as CheckIcon } from "@/components/animate-ui/icons/check";
import { ProductPrice } from "@/features/product";
import type { OrderSummary } from "@/features/orders/types";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";
import { readCheckoutOrder } from "../utils/checkout-session";

function formatDate(locale: string, dateStr: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

export function CheckoutConfirmationView() {
  const t = useTranslations("CheckoutPage.confirmation");
  const tPayment = useTranslations("CheckoutPage.payment.methods");
  const locale = useLocale();
  const [order, setOrder] = useState<OrderSummary | null | undefined>(undefined);
  const { copied, copy } = useCopyToClipboard();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    setOrder(readCheckoutOrder());
  }, []);

  if (order === undefined) {
    return (
      <section className="w-full flex-1 py-6 sm:py-10 md:py-14">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="h-72 w-full animate-pulse rounded-3xl bg-muted/50" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-44 w-full animate-pulse rounded-2xl bg-muted/50" />
            <div className="h-44 w-full animate-pulse rounded-2xl bg-muted/50" />
          </div>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="w-full flex-1 py-8 sm:py-14 md:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mx-auto max-w-lg rounded-3xl border border-border/80 bg-card/90 p-8 sm:p-12 text-center shadow-sm"
        >
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
            <ShoppingBag className="size-8" aria-hidden />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {t("missing.title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("missing.description")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/cart"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "rounded-xl px-6",
              )}
            >
              {t("missing.cta")}
            </Link>
            <Link
              href="/shop"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-xl px-6",
              )}
            >
              {t("continueShopping")}
            </Link>
          </div>
        </motion.div>
      </section>
    );
  }

  const PaymentIcon =
    order.payment?.method === "cashOnDelivery"
      ? Banknote
      : order.payment?.method === "bankTransfer"
        ? Building2
        : CreditCard;

  const paymentLabel =
    order.payment?.method === "card" && order.payment.brand && order.payment.last4
      ? t("paymentCard", {
          brand: order.payment.brand,
          last4: order.payment.last4,
        })
      : order.payment?.method
        ? tPayment(`${order.payment.method}.label`)
        : null;

  const itemsSubtotalTRY = order.items.reduce(
    (sum, item) => sum + (item.priceTRY ?? 0) * item.quantity,
    0,
  );
  const estimatedTaxTRY = Math.max(0, order.totalTRY - itemsSubtotalTRY);

  const handleCopyOrderNumber = async () => {
    const ok = await copy(order.number);
    if (ok) setTooltipOpen(true);
  };

  return (
    <section className="w-full flex-1 py-6 sm:py-10 md:py-14">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-3xl space-y-6 sm:space-y-8"
      >
        {/* ============================================================ */}
        {/* HERO CELEBRATION CARD */}
        {/* ============================================================ */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-b from-card via-card/90 to-muted/20 p-6 sm:p-10 text-center shadow-xs"
        >
          {/* Subtle ambient decorative gradient background */}
          <div
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-56 w-96 rounded-full bg-success/10 blur-3xl"
            aria-hidden
          />

          {/* Couture Animated Success Emblem */}
          <div className="relative mx-auto mb-6 flex size-24 items-center justify-center sm:size-28">
            {/* Ambient breathing aura */}
            <motion.div
              className="pointer-events-none absolute -inset-3 rounded-full bg-gradient-to-tr from-success/15 via-success-muted to-success/10 blur-xl"
              animate={{
                scale: [0.92, 1.08, 0.92],
                opacity: [0.45, 0.8, 0.45],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              aria-hidden
            />

            {/* Rotating dashed couture border ring */}
            <motion.div
              className="pointer-events-none absolute -inset-1 rounded-full border border-dashed border-success/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              aria-hidden
            />

            {/* Badge container with spring entrance */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 20,
                delay: 0.15,
              }}
              className="relative flex size-20 items-center justify-center rounded-full border border-success/25 bg-gradient-to-b from-background via-card to-success-muted shadow-md shadow-success/5 sm:size-24"
            >
              {/* Animated SVG Circle Drawing */}
              <svg
                className="absolute inset-0 size-full -rotate-90"
                viewBox="0 0 88 88"
                aria-hidden
              >
                <circle
                  cx="44"
                  cy="44"
                  r="38"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-border/40"
                />
                <motion.circle
                  cx="44"
                  cy="44"
                  r="38"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="text-success"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 0.9,
                    ease: [0.21, 0.47, 0.32, 0.98],
                    delay: 0.25,
                  }}
                />
              </svg>

              {/* Animated Checkmark Path */}
              <svg
                className="size-9 text-success sm:size-10"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <motion.path
                  d="M5 13l4.5 4.5L19 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.55, delay: 0.5, ease: "easeOut" }}
                />
              </svg>

              {/* Sparkling couture stars around the emblem */}
              {[
                { top: "-4px", left: "10px", delay: 0.6, size: "size-3.5" },
                { top: "6px", right: "-4px", delay: 0.75, size: "size-3" },
                { bottom: "-3px", right: "12px", delay: 0.9, size: "size-3.5" },
                { bottom: "8px", left: "-4px", delay: 1.05, size: "size-3" },
              ].map((spark, idx) => (
                <motion.span
                  key={idx}
                  style={{
                    top: spark.top,
                    left: spark.left,
                    right: spark.right,
                    bottom: spark.bottom,
                  }}
                  initial={{ scale: 0, opacity: 0, rotate: 0 }}
                  animate={{
                    scale: [0, 1.25, 1],
                    opacity: [0, 1, 0.85],
                    rotate: [0, 45, 90],
                  }}
                  transition={{
                    delay: spark.delay,
                    duration: 0.65,
                    ease: "easeOut",
                  }}
                  className={cn(
                    "pointer-events-none absolute text-success/80",
                    spark.size,
                  )}
                >
                  <Sparkles className="size-full fill-current" />
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success-muted px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-success">
            <Sparkles className="size-3 text-success" />
            <span>{t("eyebrow")}</span>
          </div>

          {/* Main Title & Subtitle */}
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-2.5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t("description", { number: order.number })}
          </p>

          {/* Order ID & Interactive Action Bar */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-background/80 px-4 py-2.5 shadow-2xs backdrop-blur-xs">
              <div className="flex flex-col text-start">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {t("orderNumber")}
                </span>
                <span className="font-mono text-base font-bold text-foreground sm:text-lg">
                  {order.number}
                </span>
              </div>

              <TooltipProvider delay={100}>
                <Tooltip open={copied || tooltipOpen} onOpenChange={setTooltipOpen}>
                  <AnimateIcon animateOnHover className="inline-flex">
                    <TooltipTrigger
                      render={
                        <button
                          type="button"
                          onClick={handleCopyOrderNumber}
                          className="ms-2 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:size-8"
                          aria-label={
                            copied ? t("copied") : t("copyOrderNumber")
                          }
                        />
                      }
                    >
                      {copied ? (
                        <CheckIcon
                          size={16}
                          animate
                          className="text-success"
                          aria-hidden
                        />
                      ) : (
                        <Copy size={16} aria-hidden />
                      )}
                    </TooltipTrigger>
                  </AnimateIcon>
                  <TooltipContent
                    side="top"
                    sideOffset={6}
                    className="text-xs font-medium"
                  >
                    {copied ? t("copied") : t("copyOrderNumber")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-background/80 px-4 py-2.5 shadow-2xs backdrop-blur-xs text-start">
              <Calendar className="size-4 text-primary-700 dark:text-primary-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {t("placedAt")}
                </span>
                <span className="text-xs font-semibold text-foreground sm:text-sm">
                  {formatDate(locale, order.placedAt)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* 2-COLUMN ORDER INFO (SHIPPING & PAYMENT) */}
        {/* ============================================================ */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Shipping / Delivery */}
          {order.shippingAddress ? (
            <motion.div
              variants={itemVariants}
              className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card/90 p-5 sm:p-6 shadow-xs space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
                  <span className="flex size-7 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="size-4" />
                  </span>
                  <span>{t("shippingTitle")}</span>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground">
                    {order.shippingAddress.fullName}
                  </p>
                  <p>{order.shippingAddress.line1}</p>
                  {order.shippingAddress.line2 ? (
                    <p>{order.shippingAddress.line2}</p>
                  ) : null}
                  <p>
                    {[
                      order.shippingAddress.city,
                      order.shippingAddress.region,
                      order.shippingAddress.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone ? (
                    <p dir="ltr" className="pt-1 text-foreground/80 font-mono">
                      {order.shippingAddress.phone}
                    </p>
                  ) : null}
                </div>
              </div>

              {order.tracking?.carrier ? (
                <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-xs flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">{order.tracking.carrier}</span>
                  {order.tracking.trackingNumber ? (
                    <span className="font-mono font-medium text-foreground">
                      {order.tracking.trackingNumber}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </motion.div>
          ) : null}

          {/* Payment & Breakdown */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card/90 p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
                <span className="flex size-7 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <PaymentIcon className="size-4" />
                </span>
                <span>{t("paymentTitle")}</span>
              </div>
              {paymentLabel ? (
                <div className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-muted/20 px-3 py-1.5 text-xs text-foreground font-medium">
                  <PaymentIcon className="size-3.5 text-muted-foreground" />
                  <span>{paymentLabel}</span>
                </div>
              ) : null}
            </div>

            {/* Financial Summary */}
            <div className="space-y-2 border-t border-border/60 pt-3 text-xs sm:text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>{t("subtotal")}</span>
                <ProductPrice
                  amountTRY={itemsSubtotalTRY}
                  className="font-medium text-foreground"
                />
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{t("shippingFee")}</span>
                <span className="inline-flex items-center rounded-md bg-success-muted px-2 py-0.5 text-[11px] font-semibold text-success">
                  {t("complimentary")}
                </span>
              </div>
              {estimatedTaxTRY > 0 ? (
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("tax")}</span>
                  <ProductPrice
                    amountTRY={estimatedTaxTRY}
                    className="font-medium text-foreground"
                  />
                </div>
              ) : null}
              <div className="flex items-baseline justify-between pt-2 border-t border-border/80">
                <span className="text-sm font-semibold text-foreground">
                  {t("total")}
                </span>
                <ProductPrice
                  amountTRY={order.totalTRY}
                  className="text-lg sm:text-xl font-bold text-foreground"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ============================================================ */}
        {/* ITEMS IN THIS ORDER */}
        {/* ============================================================ */}
        <motion.div
          variants={itemVariants}
          className="rounded-3xl border border-border/80 bg-card/90 p-5 sm:p-7 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h2 className="text-sm font-semibold text-foreground">
              {t("itemsTitle")}
            </h2>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {order.itemCount}
            </span>
          </div>

          <ul className="divide-y divide-border/60">
            {order.items.map((item, index) => (
              <motion.li
                key={`${item.slug ?? item.name}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05, duration: 0.35 }}
                className="group flex items-center gap-3.5 py-3.5 first:pt-1 last:pb-1"
              >
                <div className="relative aspect-3/4 w-14 shrink-0 overflow-hidden rounded-xl border border-border/70 bg-muted/40 transition-transform duration-300 group-hover:scale-105">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                      <ShoppingBag className="size-5" aria-hidden />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-xs sm:text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {item.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                    {item.size ? (
                      <span className="rounded-md border border-border/60 bg-muted/40 px-1.5 py-0.5">
                        {item.size}
                      </span>
                    ) : null}
                    {item.color ? (
                      <span className="rounded-md border border-border/60 bg-muted/40 px-1.5 py-0.5">
                        {item.color}
                      </span>
                    ) : null}
                    <span className="font-semibold text-foreground">
                      ×{item.quantity}
                    </span>
                  </div>
                </div>

                {item.priceTRY != null ? (
                  <div className="text-end">
                    <ProductPrice
                      amountTRY={item.priceTRY * item.quantity}
                      className="text-xs sm:text-sm font-semibold text-foreground"
                    />
                    {item.quantity > 1 ? (
                      <p className="text-[10px] text-muted-foreground">
                        <ProductPrice amountTRY={item.priceTRY} /> / pc
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* ============================================================ */}
        {/* ACTION BUTTONS */}
        {/* ============================================================ */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-3 pt-2 print:hidden"
        >
          <Link
            href="/shop"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "group h-12 rounded-xl gap-2 px-7 shadow-sm transition-all hover:shadow-md",
            )}
          >
            <span>{t("continueShopping")}</span>
            <ArrowRight
              className="size-4 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
              aria-hidden
            />
          </Link>
          <Link
            href="/me/orders"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 rounded-xl px-7 transition-colors",
            )}
          >
            {t("viewOrders")}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
