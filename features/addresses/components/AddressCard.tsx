"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Home,
  Briefcase,
  MapPin,
  CheckCircle2,
  Edit2,
  Trash2,
  Phone,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Address } from "../types";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onSetDefault: (id: string) => void;
  isSettingDefault?: boolean;
}

const ADDRESS_TYPE_ICONS = {
  home: Home,
  work: Briefcase,
  other: MapPin,
} as const;

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isSettingDefault = false,
}: AddressCardProps) {
  const t = useTranslations("ProfilePage.addresses");

  const getLabelIcon = () => {
    switch (address.type) {
      case "home":
        return Home;
      case "work":
        return Briefcase;
      default:
        return MapPin;
    }
  };

  const getLabelText = () => {
    if (address.type === "other" && address.customLabel) {
      return address.customLabel;
    }
    return t(`labels.${address.type}`);
  };

  const Icon = ADDRESS_TYPE_ICONS[address.type] ?? getLabelIcon();

  // Construct readable address lines
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

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border bg-card p-5 transition-all duration-200 h-full",
        address.isDefault
          ? "border-primary/60 shadow-xs ring-1 ring-primary/20"
          : "border-border/80 hover:border-border hover:shadow-xs"
      )}
    >
      <div className="space-y-3.5">
        {/* Header: Label & Default status */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-muted text-foreground">
              <Icon className="size-3.5" aria-hidden />
            </span>
            <span className="text-xs font-semibold text-foreground">
              {getLabelText()}
            </span>
          </div>

          {address.isDefault ? (
            <Badge
              variant="secondary"
              className="gap-1 bg-primary/15 text-primary border-primary/20 text-[11px] font-medium py-0.5 px-2"
            >
              <CheckCircle2 className="size-3" aria-hidden />
              {t("card.defaultBadge")}
            </Badge>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onSetDefault(address.id)}
              disabled={isSettingDefault}
              className="h-6 text-[11px] text-muted-foreground hover:text-primary px-2 hover:bg-primary/5"
            >
              {t("card.setDefault")}
            </Button>
          )}
        </div>

        {/* Recipient Name & Phone */}
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-foreground">
            {address.fullName}
          </h4>
          <p
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
            dir="ltr"
          >
            <Phone className="size-3 shrink-0" aria-hidden />
            <span>
              {address.phoneCountryCode} {address.phone}
            </span>
          </p>
        </div>

        {/* Address Lines */}
        <div className="space-y-1 text-xs text-muted-foreground leading-relaxed">
          <p className="font-medium text-foreground/90">{line1}</p>
          <p>{line2}</p>
          <p className="font-medium text-foreground/80">{address.countryName}</p>
        </div>

        {/* Delivery Notes / Courier Instructions */}
        {address.deliveryNotes && (
          <div className="flex items-start gap-2 rounded-lg bg-muted/40 p-2.5 text-[11px] text-muted-foreground">
            <MessageSquare className="size-3.5 shrink-0 mt-0.5 text-muted-foreground/70" aria-hidden />
            <p className="line-clamp-2 leading-snug">{address.deliveryNotes}</p>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="mt-5 flex items-center justify-end gap-2 border-t border-border/60 pt-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onEdit(address)}
          className="h-8 gap-1.5 text-xs text-foreground hover:border-foreground/30"
        >
          <Edit2 className="size-3" aria-hidden />
          {t("card.edit")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onDelete(address)}
          className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-3" aria-hidden />
          {t("card.delete")}
        </Button>
      </div>
    </div>
  );
}

