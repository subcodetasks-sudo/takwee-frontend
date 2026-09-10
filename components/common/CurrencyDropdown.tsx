"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  TbCurrencyLira,
  TbCurrencyRiyal,
  TbCurrencyDirham,
  TbCurrencyDollar,
  TbCurrencyDinar,
} from "react-icons/tb";
import type { IconType } from "react-icons";
import { ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useCurrency, type CurrencyCode } from "@/hooks/useCurrency";
import { cn } from "@/lib/utils";

interface CurrencyOption {
  code: CurrencyCode;
  icon: IconType;
}

const CURRENCY_ICONS: Record<CurrencyCode, IconType> = {
  TRY: TbCurrencyLira,
  SAR: TbCurrencyRiyal,
  AED: TbCurrencyDirham,
  USD: TbCurrencyDollar,
  QAR: TbCurrencyRiyal,
  KWD: TbCurrencyDinar,
};

export function CurrencyDropdown({
  className,
  contentClassName,
}: {
  className?: string;
  contentClassName?: string;
}) {
  const t = useTranslations("Currencies");
  const { currency, setCurrency, supportedCurrencies } = useCurrency();

  const options = supportedCurrencies.map((code) => ({
    code,
    icon: CURRENCY_ICONS[code],
  }));

  const selectedCurrencyOption =
    options.find((c) => c.code === currency) ?? options[0];
  const SelectedIcon = selectedCurrencyOption?.icon ?? TbCurrencyLira;

  if (options.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-2 text-xs font-medium text-foreground hover:bg-muted hover:text-foreground gap-1.5 transition-colors",
              className
            )}
          />
        }
      >
        <span className="flex items-center gap-1">
          <SelectedIcon className="size-4 text-primary-700 dark:text-primary-300 stroke-[2.2]" />
          <span>{currency}</span>
        </span>
        <ChevronDown className="size-3 text-muted-foreground transition-transform duration-200" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={cn("w-48 p-1", contentClassName)}
      >
        {options.map(({ code, icon: IconComponent }) => {
          const isSelected = currency === code;
          return (
            <DropdownMenuItem
              key={code}
              onClick={() => setCurrency(code)}
              className={cn(
                "flex items-center justify-between text-xs py-1.5 px-2 cursor-pointer rounded-md transition-colors",
                isSelected && "bg-muted font-medium text-primary-800 dark:text-primary-200"
              )}
            >
              <div className="flex items-center gap-2">
                <IconComponent className="size-4 text-primary-600 dark:text-primary-400 stroke-[2.2]" />
                <span>{t(code)}</span>
              </div>
              {isSelected && <Check className="size-3.5 text-primary-600 dark:text-primary-400" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
