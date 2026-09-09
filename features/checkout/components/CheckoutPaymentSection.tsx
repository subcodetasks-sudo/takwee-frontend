"use client";

import { useTranslations } from "next-intl";
import { CreditCard, Banknote, Building2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { CheckoutPaymentMethod } from "../types";

interface CheckoutPaymentSectionProps {
  value: CheckoutPaymentMethod | "";
  onChange: (method: CheckoutPaymentMethod) => void;
  error?: string;
}

const METHODS: {
  id: CheckoutPaymentMethod;
  icon: typeof CreditCard;
}[] = [
  { id: "card", icon: CreditCard },
  { id: "cashOnDelivery", icon: Banknote },
  { id: "bankTransfer", icon: Building2 },
];

export function CheckoutPaymentSection({
  value,
  onChange,
  error,
}: CheckoutPaymentSectionProps) {
  const t = useTranslations("CheckoutPage.payment");

  return (
    <section className="space-y-3 sm:space-y-4 rounded-2xl sm:rounded-3xl border border-border/80 bg-card/90 p-3.5 sm:p-6 md:p-7 shadow-xs backdrop-blur-md">
      <div>
        <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
          {t("title")}
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
          {t("subtitle")}
        </p>
      </div>

      <RadioGroup
        value={value}
        onValueChange={(next) => onChange(next as CheckoutPaymentMethod)}
        className="grid gap-2 sm:gap-3"
        aria-invalid={!!error}
      >
        {METHODS.map(({ id, icon: Icon }) => {
          const selected = value === id;
          return (
            <label
              key={id}
              className={cn(
                "flex cursor-pointer items-start gap-2.5 sm:gap-3 rounded-xl border p-2.5 sm:p-4 transition-all",
                selected
                  ? "border-primary/60 bg-primary/5 ring-1 ring-primary/20"
                  : "border-border/80 hover:border-border hover:bg-muted/20",
              )}
            >
              <span className="flex size-8 sm:size-9 shrink-0 items-center justify-center">
                <RadioGroupItem
                  value={id}
                  aria-label={t(`methods.${id}.label`)}
                />
              </span>
              <div className="flex min-w-0 flex-1 items-start gap-2.5 sm:gap-3">
                <span className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-xl bg-primary-100/70 dark:bg-primary-950/70 text-primary-800 dark:text-primary-200">
                  <Icon className="size-3.5 sm:size-4 stroke-[1.6]" aria-hidden />
                </span>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-semibold text-foreground">
                    {t(`methods.${id}.label`)}
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {t(`methods.${id}.description`)}
                  </p>
                </div>
              </div>
            </label>
          );
        })}
      </RadioGroup>

      {error ? (
        <p className="text-xs text-error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
