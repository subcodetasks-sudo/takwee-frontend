"use client";

import { forwardRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useCurrency } from "@/hooks/useCurrency";
import { formatPrice } from "@/features/product/utils/format-price";
import { useSettings } from "@/features/settings";
import { cn } from "@/lib/utils";
import type { OrderSummary } from "../types";

function formatDate(locale: string, dateStr: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

/** Text currency for print/PDF — SVG icons misalign under html2canvas. */
function ReceiptPrice({
  amountTRY,
  className,
  prefix,
}: {
  amountTRY: number;
  className?: string;
  /** e.g. "−" for discounts; kept inside LTR so RTL does not flip it. */
  prefix?: string;
}) {
  const { currencyConfig } = useCurrency();
  const formatted = formatPrice(amountTRY, currencyConfig);

  return (
    <span
      dir="ltr"
      className={cn(
        "inline-flex items-baseline gap-1 tabular-nums whitespace-nowrap",
        className,
      )}
      aria-label={`${prefix ?? ""}${formatted} ${currencyConfig.code}`}
    >
      {prefix ? <span aria-hidden>{prefix}</span> : null}
      <span>{formatted}</span>
      <span className="text-[0.95em] font-semibold leading-none">
        {currencyConfig.symbol}
      </span>
    </span>
  );
}

export interface OrderReceiptProps {
  order: OrderSummary;
  paymentLabel?: string | null;
  className?: string;
}

export const OrderReceipt = forwardRef<HTMLDivElement, OrderReceiptProps>(
  function OrderReceipt({ order, paymentLabel, className }, ref) {
    const t = useTranslations("OrderReceipt");
    const tPayment = useTranslations("ProfilePage.orders.details");
    const locale = useLocale();
    const { appName, siteLogo } = useSettings();
    const isArabic = locale === "ar";

    const resolvedPaymentLabel =
      paymentLabel ??
      (order.payment?.method === "card" &&
      order.payment.brand &&
      order.payment.last4
        ? tPayment("paymentCard", {
            brand: order.payment.brand,
            last4: order.payment.last4,
          })
        : order.payment?.method
          ? tPayment(`paymentMethods.${order.payment.method}`)
          : null);

    const itemsSubtotalTRY = order.items.reduce(
      (sum, item) => sum + (item.priceTRY ?? 0) * item.quantity,
      0,
    );
    const subtotalTRY = order.subtotalTRY ?? itemsSubtotalTRY;
    const shippingTRY = order.shippingTRY ?? 0;
    const discountTRY = order.discountTRY ?? 0;
    const taxTRY = order.taxTRY ?? 0;

    const logoSrc = siteLogo || "/imgs/logo.webp";
    const displayName = appName || "Takween";

    /* Never use uppercase / letter-spacing on Arabic — breaks shaping in PDF capture */
    const sectionTitleClass = cn(
      "mb-2 text-[10px] font-semibold text-primary-700",
      !isArabic && "uppercase tracking-wider",
    );

    return (
      <div
        ref={ref}
        className={cn(
          /* Primary shade scale stays light in dark mode — paper-like receipt */
          "relative mx-auto w-full max-w-[320px] bg-primary-50 text-primary-950 shadow-md",
          "px-5 py-6 text-[11px] leading-relaxed",
          isArabic && "font-noto-arabic",
          className,
        )}
      >
        {/* Perforated top edge */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-[radial-gradient(circle,transparent_45%,var(--primary-50)_46%)] bg-size-[10px_10px] bg-position-[0_-5px]"
          aria-hidden
        />

        <header className="flex flex-col items-center gap-2 border-b border-dashed border-primary-300 pb-4 text-center">
          {/* plain img for reliable print/PDF capture — height-led so circular logos stay round */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt={displayName}
            className="mx-auto h-10 w-auto max-w-[7rem] object-contain object-center"
          />
          <p
            className={cn(
              "text-xs font-semibold text-primary-900",
              !isArabic && "tracking-[0.18em] uppercase",
            )}
          >
            {displayName}
          </p>
          <p className="font-mono text-[10px] text-primary-700">
            {t("receiptLabel")}
          </p>
        </header>

        <section className="space-y-1.5 border-b border-dashed border-primary-300 py-3">
          <div className="flex justify-between gap-3">
            <span className="text-primary-700">{t("orderNumber")}</span>
            <span className="font-mono font-semibold text-primary-950" dir="ltr">
              {order.number}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-primary-700">{t("placedAt")}</span>
            <span className="text-end text-primary-950">
              {formatDate(locale, order.placedAt)}
            </span>
          </div>
          {resolvedPaymentLabel ? (
            <div className="flex justify-between gap-3">
              <span className="text-primary-700">{t("payment")}</span>
              <span className="text-end text-primary-950">
                {resolvedPaymentLabel}
              </span>
            </div>
          ) : null}
        </section>

        <section className="border-b border-dashed border-primary-300 py-3">
          <p className={sectionTitleClass}>{t("items")}</p>
          <ul className="space-y-2.5">
            {order.items.map((item, index) => (
              <li
                key={`${item.slug ?? item.name}-${index}`}
                className="space-y-0.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 flex-1 font-medium text-primary-950">
                    {item.name}
                  </p>
                  {item.priceTRY != null ? (
                    <ReceiptPrice
                      amountTRY={item.priceTRY * item.quantity}
                      className="shrink-0 text-[11px] font-semibold text-primary-950"
                    />
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-primary-700">
                  {item.size ? (
                    <span>
                      {t("size")}: {item.size}
                    </span>
                  ) : null}
                  {item.color ? (
                    <span>
                      {t("color")}: {item.color}
                    </span>
                  ) : null}
                  <span>
                    {t("qty")}: {item.quantity}
                    {item.priceTRY != null && item.quantity > 1 ? (
                      <>
                        {" · "}
                        <ReceiptPrice
                          amountTRY={item.priceTRY}
                          className="inline-flex text-[10px] text-primary-700"
                        />
                        {" / "}
                        {t("each")}
                      </>
                    ) : null}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-1 border-b border-dashed border-primary-300 py-3">
          <div className="flex justify-between text-primary-700">
            <span>{t("subtotal")}</span>
            <ReceiptPrice
              amountTRY={subtotalTRY}
              className="font-medium text-primary-950"
            />
          </div>
          {discountTRY > 0 ? (
            <div className="flex justify-between text-success">
              <span>
                {t("discount")}
                {order.couponCode ? ` (${order.couponCode})` : ""}
              </span>
              <ReceiptPrice
                amountTRY={discountTRY}
                prefix="−"
                className="font-semibold text-success"
              />
            </div>
          ) : null}
          {taxTRY > 0 ? (
            <div className="flex justify-between text-primary-700">
              <span>{t("tax")}</span>
              <ReceiptPrice
                amountTRY={taxTRY}
                className="font-medium text-primary-950"
              />
            </div>
          ) : null}
          <div className="flex justify-between text-primary-700">
            <span>{t("shipping")}</span>
            {shippingTRY === 0 ? (
              <span className="font-medium text-success">
                {t("complimentary")}
              </span>
            ) : (
              <ReceiptPrice
                amountTRY={shippingTRY}
                className="font-medium text-primary-950"
              />
            )}
          </div>
          <div className="flex items-baseline justify-between border-t border-dashed border-primary-300 pt-2">
            <span
              className={cn(
                "text-xs font-semibold text-primary-950",
                !isArabic && "uppercase tracking-wide",
              )}
            >
              {t("total")}
            </span>
            <ReceiptPrice
              amountTRY={order.totalTRY}
              className="text-sm font-bold text-primary-950"
            />
          </div>
        </section>

        {order.shippingAddress ? (
          <section className="space-y-1 border-b border-dashed border-primary-300 py-3">
            <p className={sectionTitleClass}>{t("shippingAddress")}</p>
            <div className="space-y-0.5 text-primary-900">
              <p className="font-medium">{order.shippingAddress.fullName}</p>
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
                <p dir="ltr" className="font-mono text-[10px]">
                  {order.shippingAddress.phone}
                </p>
              ) : null}
            </div>
          </section>
        ) : null}

        <footer className="pt-4 text-center">
          <p className="text-[10px] leading-relaxed text-primary-700">
            {t("thankYou")}
          </p>
          <div
            className="mx-auto mt-3 h-px w-16 border-t border-dashed border-primary-400"
            aria-hidden
          />
        </footer>

        {/* Perforated bottom edge */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2 bg-[radial-gradient(circle,transparent_45%,var(--primary-50)_46%)] bg-size-[10px_10px] bg-position-[0_5px]"
          aria-hidden
        />
      </div>
    );
  },
);
