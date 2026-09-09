"use client";

import { useTranslations } from "next-intl";
import {
  Home,
  Briefcase,
  MapPin,
  Phone,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { Address } from "@/features/addresses/types";

interface CheckoutShippingSectionProps {
  addresses: Address[];
  selectedAddressId: string;
  onSelect: (addressId: string) => void;
  onAddAddress: () => void;
  error?: string;
  isLoading?: boolean;
}

const TYPE_ICONS = {
  home: Home,
  work: Briefcase,
  other: MapPin,
} as const;

export function CheckoutShippingSection({
  addresses,
  selectedAddressId,
  onSelect,
  onAddAddress,
  error,
  isLoading = false,
}: CheckoutShippingSectionProps) {
  const t = useTranslations("CheckoutPage.shipping");
  const tLabels = useTranslations("ProfilePage.addresses.labels");

  return (
    <section className="space-y-3 sm:space-y-4 rounded-2xl sm:rounded-3xl border border-border/80 bg-card/90 p-3.5 sm:p-6 md:p-7 shadow-xs backdrop-blur-md">
      <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
            {t("title")}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            {t("subtitle")}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddAddress}
          className="h-8 sm:h-9 gap-1.5 rounded-xl text-xs font-semibold"
        >
          <Plus className="size-3.5" aria-hidden />
          {t("addAddress")}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2 sm:space-y-2.5">
          <div className="h-20 sm:h-24 animate-pulse rounded-xl bg-muted/60" />
          <div className="h-20 sm:h-24 animate-pulse rounded-xl bg-muted/60" />
        </div>
      ) : addresses.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-muted/30 px-3 py-4 sm:px-4 sm:py-6 text-center text-xs sm:text-sm text-muted-foreground">
          {t("noAddresses")}
        </p>
      ) : (
        <RadioGroup
          value={selectedAddressId}
          onValueChange={onSelect}
          className="grid gap-2 sm:gap-3"
          aria-invalid={!!error}
        >
          {addresses.map((address) => {
            const Icon = TYPE_ICONS[address.type] ?? MapPin;
            const label =
              address.type === "other" && address.customLabel
                ? address.customLabel
                : tLabels(address.type);
            const line1 = [address.streetAddress, address.apartmentOrSuite]
              .filter(Boolean)
              .join(", ");
            const line2 = [
              address.district,
              address.city,
              address.stateOrProvince,
              address.postalCode,
            ]
              .filter(Boolean)
              .join(", ");
            const selected = selectedAddressId === address.id;

            return (
              <label
                key={address.id}
                className={cn(
                  "flex cursor-pointer items-start gap-2.5 sm:gap-3 rounded-xl border p-2.5 sm:p-4 transition-all",
                  selected
                    ? "border-primary/60 bg-primary/5 ring-1 ring-primary/20"
                    : "border-border/80 hover:border-border hover:bg-muted/20",
                )}
              >
                <span className="flex size-6 sm:size-7 shrink-0 items-center justify-center">
                  <RadioGroupItem
                    value={address.id}
                    aria-label={label}
                  />
                </span>
                <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="flex size-6 sm:size-7 items-center justify-center rounded-lg bg-muted text-foreground">
                      <Icon className="size-3.5" aria-hidden />
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {label}
                    </span>
                    {address.isDefault ? (
                      <Badge
                        variant="secondary"
                        className="gap-1 bg-primary/15 text-primary border-primary/20 text-[11px] font-medium py-0.5 px-2"
                      >
                        <CheckCircle2 className="size-3" aria-hidden />
                        {t("defaultBadge")}
                      </Badge>
                    ) : null}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-foreground">
                      {address.fullName}
                    </p>
                    <p
                      className="flex items-center gap-1.5 text-xs text-muted-foreground"
                      dir="ltr"
                    >
                      <Phone className="size-3 shrink-0" aria-hidden />
                      <span>
                        {address.phoneCountryCode} {address.phone}
                      </span>
                    </p>
                    <p className="text-xs text-foreground/90">{line1}</p>
                    <p className="text-xs text-muted-foreground">{line2}</p>
                    <p className="text-xs font-medium text-foreground/80">
                      {address.countryName}
                    </p>
                  </div>
                </div>
              </label>
            );
          })}
        </RadioGroup>
      )}

      {error ? (
        <p className="text-xs text-error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
