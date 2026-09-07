"use client";

import {
  TbCurrencyDinar,
  TbCurrencyDirham,
  TbCurrencyDollar,
  TbCurrencyLira,
  TbCurrencyRiyal,
} from "react-icons/tb";
import type { IconType } from "react-icons";
import { useCurrency, type CurrencyCode } from "@/hooks/useCurrency";
import { cn } from "@/lib/utils";
import { formatPrice } from "../utils/format-price";

const CURRENCY_ICONS: Record<CurrencyCode, IconType> = {
  TRY: TbCurrencyLira,
  SAR: TbCurrencyRiyal,
  AED: TbCurrencyDirham,
  USD: TbCurrencyDollar,
  QAR: TbCurrencyRiyal,
  KWD: TbCurrencyDinar,
};

interface ProductPriceProps {
  amountTRY: number;
  className?: string;
  iconClassName?: string;
}

export function ProductPrice({
  amountTRY,
  className,
  iconClassName,
}: ProductPriceProps) {
  const { currency, currencyConfig } = useCurrency();
  const Icon = CURRENCY_ICONS[currency];
  const formatted = formatPrice(amountTRY, currencyConfig);

  return (
    <span
      className={cn("inline-flex items-center gap-0.5 tabular-nums", className)}
      aria-label={`${formatted} ${currency}`}
    >
      <Icon
        className={cn("size-4 shrink-0 stroke-[2.2]", iconClassName)}
        aria-hidden
      />
      <span>{formatted}</span>
    </span>
  );
}
