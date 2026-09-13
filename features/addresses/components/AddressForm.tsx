"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslations, useLocale } from "next-intl";
import { Home, Briefcase, MapPin, Check, ChevronDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAddresses } from "../hooks/useAddresses";
import { CountryFlag } from "./CountryFlag";
import { CountrySelectField } from "./CountrySelectField";
import { CitySelectField } from "./CitySelectField";
import {
  DEFAULT_PHONE_COUNTRY,
  findCountryByPhoneCode,
  findCountryByCodeOrName,
  getLocalizedCountryName,
  getOrderedCountriesForPhone,
  type PhoneCountry,
} from "../utils/phone-codes";
import {
  createAddressFormSchema,
  type AddressFormValues,
} from "../schemas";
import { zodResolver } from "@/lib/zod-resolver";
import type { Address, AddressFormData, AddressType } from "../types";

interface AddressFormProps {
  initialData?: Address | null;
  existingAddresses?: Address[];
  onSubmit: (data: AddressFormData) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function AddressForm({
  initialData,
  existingAddresses,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: AddressFormProps) {
  const t = useTranslations("ProfilePage.addresses");
  const locale = useLocale();
  const { addresses: hookAddresses } = useAddresses();
  const addresses = existingAddresses ?? hookAddresses;

  const hasExistingHome = addresses.some(
    (addr) => addr.type === "home" && addr.id !== initialData?.id
  );

  const defaultType: AddressType =
    initialData?.type ?? (hasExistingHome ? "work" : "home");

  const [phoneCountry, setPhoneCountry] = useState<PhoneCountry>(() => {
    if (initialData?.phoneCountryCode) {
      return findCountryByPhoneCode(initialData.phoneCountryCode);
    }
    if (initialData?.countryName) {
      return findCountryByCodeOrName(initialData.countryName) ?? DEFAULT_PHONE_COUNTRY;
    }
    return DEFAULT_PHONE_COUNTRY;
  });

  const [isPhoneDropdownOpen, setIsPhoneDropdownOpen] = useState(false);
  const [phoneSearch, setPhoneSearch] = useState("");
  const phoneDropdownRef = useRef<HTMLDivElement>(null);

  const schema = useMemo(
    () =>
      createAddressFormSchema({
        nameRequired: t("form.errors.nameRequired"),
        nameLettersOnly: t("form.errors.nameLettersOnly"),
        phoneRequired: t("form.errors.phoneRequired"),
        phoneNumbersOnly: t("form.errors.phoneNumbersOnly"),
        countryRequired: t("form.errors.countryRequired"),
        cityRequired: t("form.errors.cityRequired"),
        streetRequired: t("form.errors.streetRequired"),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    clearErrors,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: defaultType,
      customLabel: initialData?.customLabel ?? "",
      fullName: initialData?.fullName ?? "",
      phone: initialData?.phone ?? "",
      phoneCountryCode: initialData?.phoneCountryCode ?? `+${DEFAULT_PHONE_COUNTRY.phone_code}`,
      countryId: initialData?.countryId ? String(initialData.countryId) : "",
      countryCode: initialData?.countryCode ?? "",
      countryName: initialData?.countryName ?? "",
      stateOrProvince: initialData?.stateOrProvince ?? "",
      cityId: initialData?.cityId ? String(initialData.cityId) : "",
      city: initialData?.city ?? "",
      district: initialData?.district ?? "",
      streetAddress: initialData?.streetAddress ?? "",
      apartmentOrSuite: initialData?.apartmentOrSuite ?? "",
      postalCode: initialData?.postalCode ?? "",
      deliveryNotes: initialData?.deliveryNotes ?? "",
    },
  });

  const type = useWatch({ control, name: "type" });
  const countryIdValue = useWatch({ control, name: "countryId" });
  const countryCode = useWatch({ control, name: "countryCode" });
  const countryName = useWatch({ control, name: "countryName" });
  const cityIdValue = useWatch({ control, name: "cityId" });
  const cityName = useWatch({ control, name: "city" });
  const selectedCountryId = Number(countryIdValue);
  const selectedCityId = Number(cityIdValue);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        phoneDropdownRef.current &&
        !phoneDropdownRef.current.contains(event.target as Node)
      ) {
        setIsPhoneDropdownOpen(false);
      }
    };
    if (isPhoneDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPhoneDropdownOpen]);

  const orderedPhoneCountries = useMemo(
    () => getOrderedCountriesForPhone(),
    []
  );

  const filteredPhoneCountries = useMemo(() => {
    if (!phoneSearch.trim()) return orderedPhoneCountries;
    const q = phoneSearch.toLowerCase().trim();
    return orderedPhoneCountries.filter((c) => {
      const localized = getLocalizedCountryName(c, locale).toLowerCase();
      return (
        c.nameEn.toLowerCase().includes(q) ||
        c.phone_code.includes(q) ||
        localized.includes(q) ||
        c.nameAr.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
      );
    });
  }, [orderedPhoneCountries, phoneSearch, locale]);

  const onValidSubmit = async (values: AddressFormValues) => {
    if (isSubmitting) return;

    await onSubmit({
      type: values.type,
      customLabel:
        values.type === "other"
          ? values.customLabel.trim() || undefined
          : undefined,
      fullName: values.fullName.trim(),
      phone: values.phone.trim(),
      phoneCountryCode: values.phoneCountryCode.trim(),
      countryId: Number(values.countryId),
      countryCode: values.countryCode.trim(),
      countryName: values.countryName.trim(),
      stateOrProvince: values.stateOrProvince.trim(),
      cityId: Number(values.cityId),
      city: values.city.trim(),
      district: values.district.trim(),
      streetAddress: values.streetAddress.trim(),
      apartmentOrSuite: values.apartmentOrSuite.trim() || undefined,
      postalCode: values.postalCode.trim() || undefined,
      deliveryNotes: values.deliveryNotes.trim() || undefined,
      isDefault:
        values.type === "home" ? true : (initialData?.isDefault ?? false),
    });
  };

  const addressTypes: Array<{
    id: AddressType;
    label: string;
    icon: typeof Home;
  }> = [
    { id: "home", label: t("labels.home"), icon: Home },
    { id: "work", label: t("labels.work"), icon: Briefcase },
    { id: "other", label: t("labels.other"), icon: MapPin },
  ];

  const fullNameRegister = register("fullName");
  const phoneRegister = register("phone");

  return (
    <form
      onSubmit={handleSubmit(onValidSubmit)}
      className="flex flex-col min-h-0 flex-1"
      noValidate
    >
      {/* Scrollable Form Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 no-scrollbar">
        {/* Address Type Selector */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("form.typeLabel")}
        </Label>
        <TooltipProvider delay={100}>
          <div className="grid grid-cols-3 gap-2">
            {addressTypes.map((item) => {
              const Icon = item.icon;
              const isSelected = type === item.id;
              const isDisabled = item.id === "home" && hasExistingHome;
              const typeButtonClassName = cn(
                "flex w-full items-center justify-center gap-2 rounded-lg border py-2 px-3 text-xs font-medium transition-all",
                isDisabled
                  ? "pointer-events-none cursor-not-allowed opacity-50 bg-muted/30 text-muted-foreground border-border/50 select-none"
                  : isSelected
                    ? "border-primary bg-primary/10 text-primary shadow-xs"
                    : "border-input bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              );
              const typeButtonContent = (
                <>
                  <Icon className="size-3.5" aria-hidden />
                  <span>{item.label}</span>
                  {isSelected && !isDisabled && (
                    <Check className="size-3" aria-hidden />
                  )}
                </>
              );

              if (isDisabled) {
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger
                      render={<span className="block w-full" />}
                      aria-label={t("form.homeAlreadyExists")}
                    >
                      <button
                        type="button"
                        disabled
                        className={typeButtonClassName}
                      >
                        {typeButtonContent}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      sideOffset={6}
                      className="text-xs font-medium"
                    >
                      {t("form.homeAlreadyExists")}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setValue("type", item.id, { shouldDirty: true })
                  }
                  className={typeButtonClassName}
                >
                  {typeButtonContent}
                </button>
              );
            })}
          </div>
        </TooltipProvider>

        {type === "home" && (
          <div className="rounded-lg border border-border/80 bg-muted/20 p-3 transition-colors">
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {t("form.isDefaultHint")}
            </p>
          </div>
        )}

        {type === "other" && (
          <div className="pt-1">
            <Input
              {...register("customLabel")}
              placeholder={t("form.customLabelPlaceholder")}
              className="h-9 text-sm"
            />
          </div>
        )}
      </div>

      {/* Recipient Full Name */}
      <div className="space-y-1.5">
        <Label htmlFor="address-fullName" className="text-xs font-medium">
          {t("form.fullName")} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="address-fullName"
          {...fullNameRegister}
          onChange={(e) => {
            // Keep letters, spaces, apostrophes, and hyphens only
            e.target.value = e.target.value.replace(/[^\p{L}\s'.-]/gu, "");
            void fullNameRegister.onChange(e);
          }}
          placeholder={t("form.fullNamePlaceholder")}
          className={cn(
            "h-9 text-sm",
            errors.fullName && "border-destructive ring-1 ring-destructive/30"
          )}
          aria-invalid={!!errors.fullName}
        />
        {errors.fullName?.message && (
          <p className="text-xs text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      {/* Country / Territory */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">
          {t("form.country")} <span className="text-destructive">*</span>
        </Label>
        <CountrySelectField
          countryId={Number.isFinite(selectedCountryId) && selectedCountryId > 0 ? selectedCountryId : undefined}
          countryCode={countryCode}
          countryName={countryName}
          hasError={!!errors.countryName || !!errors.countryCode || !!errors.countryId}
          onSelect={(country) => {
            setValue("countryId", String(country.id), {
              shouldDirty: true,
              shouldValidate: true,
            });
            setValue("countryName", country.name, {
              shouldDirty: true,
              shouldValidate: true,
            });
            setValue("countryCode", country.code, {
              shouldDirty: true,
              shouldValidate: true,
            });
            setValue("cityId", "", { shouldDirty: true, shouldValidate: true });
            setValue("city", "", { shouldDirty: true, shouldValidate: true });
            clearErrors(["countryName", "countryCode", "countryId"]);
            const matchedPhone = findCountryByCodeOrName(country.code);
            if (matchedPhone) {
              setValue("phoneCountryCode", `+${matchedPhone.phone_code}`, {
                shouldDirty: true,
              });
              setPhoneCountry(matchedPhone);
            }
          }}
        />
        {(errors.countryName?.message || errors.countryCode?.message || errors.countryId?.message) && (
          <p className="text-xs text-destructive">
            {errors.countryName?.message || errors.countryCode?.message || errors.countryId?.message}
          </p>
        )}
      </div>

      {/* Phone Number with Country Code Select */}
      <div className="space-y-1.5">
        <Label htmlFor="address-phone" className="text-xs font-medium">
          {t("form.phone")} <span className="text-destructive">*</span>
        </Label>
        <div
          className={cn(
            "relative flex h-9 w-full items-center rounded-lg border border-input bg-card shadow-2xs transition-all focus-within:border-ring focus-within:ring-1 focus-within:ring-ring",
            errors.phone && "border-destructive ring-1 ring-destructive/30"
          )}
          dir="ltr"
        >
          <div ref={phoneDropdownRef} className="relative h-full shrink-0">
            <button
              type="button"
              onClick={() => setIsPhoneDropdownOpen((prev) => !prev)}
              aria-expanded={isPhoneDropdownOpen}
              aria-label={t("form.phoneCode")}
              className="flex h-full items-center gap-1.5 border-r border-border bg-muted/30 px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/60 select-none rounded-l-[7px]"
            >
              <CountryFlag code={phoneCountry.code} emoji={phoneCountry.emoji} />
              <span className="font-medium text-foreground tabular-nums">
                +{phoneCountry.phone_code}
              </span>
              <ChevronDown
                className={cn(
                  "size-3.5 text-muted-foreground transition-transform duration-200",
                  isPhoneDropdownOpen && "rotate-180"
                )}
                aria-hidden
              />
            </button>

            {isPhoneDropdownOpen && (
              <div className="absolute top-[calc(100%+4px)] start-0 z-50 max-h-72 w-72 rounded-xl border border-border bg-popover p-2 shadow-xl animate-in fade-in-0 zoom-in-95">
                <div className="relative mb-2">
                  <Search className="absolute start-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    value={phoneSearch}
                    onChange={(e) => setPhoneSearch(e.target.value)}
                    placeholder={t("form.searchCountryPlaceholder")}
                    autoFocus
                    className="h-8 ps-8 pe-3 text-xs bg-muted/40 border-border/70 rounded-lg focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <div className="max-h-56 overflow-y-auto space-y-0.5 no-scrollbar">
                  {filteredPhoneCountries.length === 0 ? (
                    <p className="py-4 text-center text-xs text-muted-foreground">
                      {t("form.noResultsFound")}
                    </p>
                  ) : (
                    filteredPhoneCountries.map((item) => {
                      const isSelected = item.code === phoneCountry.code;
                      return (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => {
                            setPhoneCountry(item);
                            setValue("phoneCountryCode", `+${item.phone_code}`, {
                              shouldDirty: true,
                            });
                            setIsPhoneDropdownOpen(false);
                            setPhoneSearch("");
                          }}
                          className={cn(
                            "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors hover:bg-muted/80 select-none",
                            isSelected
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-foreground"
                          )}
                        >
                          <span className="font-mono text-xs tabular-nums text-muted-foreground shrink-0 pe-2">
                            +{item.phone_code}
                          </span>
                          <span className="truncate flex-1 text-center font-normal">
                            {item.nameEn}
                          </span>
                          <CountryFlag
                            code={item.code}
                            emoji={item.emoji}
                            className="ms-2"
                          />
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <Input
            id="address-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            {...phoneRegister}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/\D/g, "");
              void phoneRegister.onChange(e);
            }}
            placeholder={t("form.phonePlaceholder")}
            className="flex-1 h-full rounded-none rounded-r-lg border-0 bg-transparent px-3 text-sm shadow-none focus-visible:ring-0 focus-visible:border-0"
            dir="ltr"
            aria-invalid={!!errors.phone}
          />
        </div>
        {errors.phone?.message && (
          <p className="text-xs text-destructive">{errors.phone.message}</p>
        )}
      </div>

      {/* City & Province / Emirate */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="address-city" className="text-xs font-medium">
            {t("form.city")} <span className="text-destructive">*</span>
          </Label>
          <CitySelectField
            countryId={Number.isFinite(selectedCountryId) && selectedCountryId > 0 ? selectedCountryId : undefined}
            cityId={Number.isFinite(selectedCityId) && selectedCityId > 0 ? selectedCityId : undefined}
            cityName={cityName}
            hasError={!!errors.city || !!errors.cityId}
            onSelect={(city) => {
              setValue("cityId", String(city.id), {
                shouldDirty: true,
                shouldValidate: true,
              });
              setValue("city", city.name, {
                shouldDirty: true,
                shouldValidate: true,
              });
              clearErrors(["city", "cityId"]);
            }}
          />
          {errors.city?.message || errors.cityId?.message ? (
            <p className="text-xs text-destructive">
              {errors.city?.message || errors.cityId?.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address-stateOrProvince" className="text-xs font-medium">
            {t("form.stateOrProvince")}
          </Label>
          <Input
            id="address-stateOrProvince"
            {...register("stateOrProvince")}
            placeholder={t("form.stateOrProvincePlaceholder")}
            className="h-9 text-sm"
          />
        </div>
      </div>

      {/* District / Neighborhood & Postal Code */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="address-district" className="text-xs font-medium">
            {t("form.district")}
          </Label>
          <Input
            id="address-district"
            {...register("district")}
            placeholder={t("form.districtPlaceholder")}
            className="h-9 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address-postalCode" className="text-xs font-medium">
            {t("form.postalCode")}
          </Label>
          <Input
            id="address-postalCode"
            {...register("postalCode")}
            placeholder={t("form.postalCodePlaceholder")}
            className="h-9 text-sm"
          />
        </div>
      </div>

      {/* Street Address & Building */}
      <div className="space-y-1.5">
        <Label htmlFor="address-street" className="text-xs font-medium">
          {t("form.streetAddress")} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="address-street"
          {...register("streetAddress")}
          placeholder={t("form.streetAddressPlaceholder")}
          className={cn(
            "h-9 text-sm",
            errors.streetAddress && "border-destructive ring-1 ring-destructive/30"
          )}
          aria-invalid={!!errors.streetAddress}
        />
        {errors.streetAddress?.message && (
          <p className="text-xs text-destructive">{errors.streetAddress.message}</p>
        )}
      </div>

      {/* Apartment / Villa / Floor */}
      <div className="space-y-1.5">
        <Label htmlFor="address-apt" className="text-xs font-medium">
          {t("form.apartmentOrSuite")}
        </Label>
        <Input
          id="address-apt"
          {...register("apartmentOrSuite")}
          placeholder={t("form.apartmentOrSuitePlaceholder")}
          className="h-9 text-sm"
        />
      </div>

      {/* Delivery Instructions */}
      <div className="space-y-1.5">
        <Label htmlFor="address-notes" className="text-xs font-medium">
          {t("form.deliveryNotes")}
        </Label>
        <Textarea
          id="address-notes"
          {...register("deliveryNotes")}
          placeholder={t("form.deliveryNotesPlaceholder")}
          className="min-h-18 resize-none text-sm"
        />
      </div>

      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-2.5 border-t border-border/80 bg-muted/25 px-4 py-3 sm:px-6 sm:py-3.5 shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-9 text-xs"
        >
          {t("form.cancel")}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-9 text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs font-medium"
        >
          {isSubmitting ? t("form.saving") : t("form.save")}
        </Button>
      </div>
    </form>
  );
}
