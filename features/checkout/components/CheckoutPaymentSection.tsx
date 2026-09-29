"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Building2, Copy, FileText, ImagePlus, Trash2 } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSettings } from "@/features/settings";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";
import { usePaymentWays } from "../hooks/usePaymentWays";
import type { CheckoutFormValues } from "../schemas";
import type { PaymentWay } from "../types";
import { WHATSAPP_CHECKOUT_ID } from "../utils/map-payment-ways";
import { resolveOrderWhatsappTarget } from "../utils/whatsapp-order";

interface CheckoutPaymentSectionProps {
  control: Control<CheckoutFormValues>;
  register: UseFormRegister<CheckoutFormValues>;
  setValue: UseFormSetValue<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
}

export function CheckoutPaymentSection({
  control,
  register,
  setValue,
  errors,
}: CheckoutPaymentSectionProps) {
  const t = useTranslations("CheckoutPage.payment");
  const { settings, contactPhone, contactWhatsapp } = useSettings();
  const { paymentWays, isLoading, isError } = usePaymentWays();
  const { copy } = useCopyToClipboard();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const didInitSelection = useRef(false);

  const paymentMethod = useWatch({ control, name: "paymentMethod" });
  const paymentWayId = useWatch({ control, name: "paymentWayId" });

  const transferWays = paymentWays.filter((way) => way.kind === "transfer");
  const apiWhatsappWay = paymentWays.find((way) => way.kind === "whatsapp");
  const whatsappTarget = resolveOrderWhatsappTarget([
    contactPhone,
    contactWhatsapp,
    apiWhatsappWay?.accountNumber,
  ]);
  const showWhatsapp = Boolean(whatsappTarget.href);

  const selectedTransfer =
    transferWays.find((way) => way.id === paymentWayId) ?? null;
  const isWhatsapp = paymentMethod === "whatsapp";

  const legacyBankRows = [
    {
      key: "bankName",
      label: t("bankDetails.bankName"),
      value: settings?.bankName,
    },
    {
      key: "holder",
      label: t("bankDetails.accountHolder"),
      value: settings?.bankAccountHolder,
    },
    {
      key: "iban",
      label: t("bankDetails.iban"),
      value: settings?.bankIban,
    },
    {
      key: "accountNumber",
      label: t("bankDetails.accountNumber"),
      value: settings?.bankAccountNumber,
    },
  ].filter((row) => Boolean(row.value));

  const instructions = settings?.bankTransferInstructions;
  const showLegacyBank =
    !isLoading &&
    transferWays.length === 0 &&
    !isWhatsapp &&
    (legacyBankRows.length > 0 || Boolean(instructions));

  useEffect(() => {
    if (isLoading || didInitSelection.current) return;
    didInitSelection.current = true;
    if (paymentMethod === "whatsapp" || paymentWayId) return;

    const firstTransfer = transferWays[0];
    if (firstTransfer) {
      setValue("paymentMethod", "bankTransfer", { shouldValidate: false });
      setValue("paymentWayId", firstTransfer.id, { shouldValidate: false });
      return;
    }

    if (showWhatsapp) {
      setValue("paymentMethod", "whatsapp", { shouldValidate: false });
      setValue("paymentWayId", apiWhatsappWay?.id ?? WHATSAPP_CHECKOUT_ID, {
        shouldValidate: false,
      });
    }
  }, [
    apiWhatsappWay?.id,
    isLoading,
    paymentMethod,
    paymentWayId,
    setValue,
    showWhatsapp,
    transferWays,
  ]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleCopy = async (label: string, text: string) => {
    const ok = await copy(text);
    if (ok) {
      gooeyToast.success(t("bankDetails.copied", { field: label }));
    }
  };

  const today = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, []);

  const clearReceipt = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setValue("receipt", undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const selectTransfer = (way: PaymentWay) => {
    setValue("paymentMethod", "bankTransfer", {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("paymentWayId", way.id, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const selectWhatsapp = () => {
    setValue("paymentMethod", "whatsapp", {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("paymentWayId", apiWhatsappWay?.id ?? WHATSAPP_CHECKOUT_ID, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("receipt", undefined, { shouldValidate: false });
  };

  const accountRows = selectedTransfer
    ? [
        {
          key: "holder",
          label: t("bankDetails.accountHolder"),
          value: selectedTransfer.accountName,
        },
        {
          key: "accountNumber",
          label: t("bankDetails.accountNumber"),
          value: selectedTransfer.accountNumber,
        },
      ].filter((row) => Boolean(row.value))
    : [];

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

      <div className="space-y-2" role="radiogroup" aria-label={t("title")}>
        {isLoading ? (
          <div className="space-y-2" aria-busy="true">
            <div className="h-16 w-full animate-pulse rounded-xl bg-muted/60" />
            <div className="h-16 w-full animate-pulse rounded-xl bg-muted/60" />
          </div>
        ) : (
          <>
            {transferWays.map((way, index) => {
              const selected =
                !isWhatsapp && paymentWayId === way.id;
              const label =
                way.name || t("accountFallback", { index: index + 1 });
              return (
                <button
                  key={way.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => selectTransfer(way)}
                  className={cn(
                    "flex w-full items-center gap-2.5 sm:gap-3 rounded-xl border p-2.5 sm:p-4 text-start transition-colors",
                    selected
                      ? "border-primary/50 bg-primary/5"
                      : "border-border/80 bg-background/40 hover:border-primary/30",
                  )}
                >
                  {way.logo ? (
                    <span className="relative size-9 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-background">
                      <Image
                        src={way.logo}
                        alt=""
                        width={36}
                        height={36}
                        className="size-full object-contain"
                      />
                    </span>
                  ) : (
                    <span className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-xl bg-primary-100/70 text-primary-800 dark:bg-primary-950/70 dark:text-primary-200">
                      <Building2
                        className="size-3.5 sm:size-4 stroke-[1.6]"
                        aria-hidden
                      />
                    </span>
                  )}
                  <span className="min-w-0 space-y-0.5">
                    <span className="block text-sm font-semibold text-foreground">
                      {label}
                    </span>
                    <span className="block text-xs leading-relaxed text-muted-foreground">
                      {t("methods.bankTransfer.description")}
                    </span>
                  </span>
                </button>
              );
            })}

            {showWhatsapp ? (
              <button
                type="button"
                role="radio"
                aria-checked={isWhatsapp}
                onClick={selectWhatsapp}
                className={cn(
                  "flex w-full items-center gap-2.5 sm:gap-3 rounded-xl border p-2.5 sm:p-4 text-start transition-colors",
                  isWhatsapp
                    ? "border-primary/50 bg-primary/5"
                    : "border-border/80 bg-background/40 hover:border-primary/30",
                )}
              >
                <span className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-xl bg-success-muted text-success">
                  <SiWhatsapp className="size-4" aria-hidden />
                </span>
                <span className="min-w-0 space-y-0.5">
                  <span className="block text-sm font-semibold text-foreground">
                    {apiWhatsappWay?.name || t("methods.whatsapp.label")}
                  </span>
                  <span className="block text-xs leading-relaxed text-muted-foreground">
                    {t("methods.whatsapp.description")}
                  </span>
                </span>
              </button>
            ) : null}
          </>
        )}
      </div>

      {errors.paymentWayId?.message ? (
        <p className="text-xs text-error" role="alert">
          {errors.paymentWayId.message}
        </p>
      ) : null}

      {!isLoading && isError && transferWays.length === 0 ? (
        <p className="text-xs text-muted-foreground">{t("loadError")}</p>
      ) : null}

      {!isLoading &&
      !isError &&
      transferWays.length === 0 &&
      !showWhatsapp &&
      !showLegacyBank ? (
        <p className="text-xs text-muted-foreground">{t("empty")}</p>
      ) : null}

      {selectedTransfer && accountRows.length > 0 ? (
        <AccountDetails
          title={t("bankDetails.title")}
          rows={accountRows}
          onCopy={handleCopy}
          copyAria={(field) => t("bankDetails.copyAria", { field })}
        />
      ) : null}

      {showLegacyBank ? (
        <div className="space-y-2.5 rounded-xl border border-border/70 bg-muted/20 p-3 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("bankDetails.title")}
          </p>
          {instructions ? (
            <p className="text-xs leading-relaxed text-foreground/90 sm:text-sm">
              {instructions}
            </p>
          ) : null}
          {legacyBankRows.length > 0 ? (
            <AccountRows
              rows={legacyBankRows}
              onCopy={handleCopy}
              copyAria={(field) => t("bankDetails.copyAria", { field })}
            />
          ) : null}
        </div>
      ) : null}

      {isWhatsapp ? (
        <>
          {whatsappTarget.phone ? (
            <AccountDetails
              title={t("whatsappDetails.title")}
              rows={[
                {
                  key: "phone",
                  label: t("whatsappDetails.phone"),
                  value: whatsappTarget.phone,
                  dir: "ltr",
                },
              ]}
              onCopy={handleCopy}
              copyAria={(field) => t("bankDetails.copyAria", { field })}
            />
          ) : null}
          <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {t("methods.whatsapp.note")}
          </p>
        </>
      ) : (
        <>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="transferHolderName">{t("form.holderName")}</Label>
              <Input
                id="transferHolderName"
                autoComplete="name"
                placeholder={t("form.holderNamePlaceholder")}
                aria-invalid={!!errors.transferHolderName}
                {...register("transferHolderName")}
              />
              {errors.transferHolderName ? (
                <p className="text-xs text-error" role="alert">
                  {errors.transferHolderName.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5 sm:col-span-2 sm:max-w-xs">
              <Label htmlFor="transferDate">{t("form.transferDate")}</Label>
              <Input
                id="transferDate"
                type="date"
                max={today}
                aria-invalid={!!errors.transferDate}
                {...register("transferDate")}
              />
              {errors.transferDate ? (
                <p className="text-xs text-error" role="alert">
                  {errors.transferDate.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("form.receipt")}</Label>
            <p className="text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
              {t("form.receiptHint")}
            </p>

            <Controller
              name="receipt"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    id="checkout-receipt"
                    name={name}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) {
                        clearReceipt();
                        return;
                      }
                      if (previewUrl) URL.revokeObjectURL(previewUrl);
                      const nextPreview = file.type.startsWith("image/")
                        ? URL.createObjectURL(file)
                        : null;
                      setPreviewUrl(nextPreview);
                      onChange(file);
                    }}
                  />

                  {value instanceof File ? (
                    <div className="flex items-stretch gap-3 rounded-xl border border-border/80 bg-background/80 p-2.5 sm:p-3">
                      <div className="relative flex size-16 sm:size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted/40">
                        {previewUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element -- local blob preview
                          <img
                            src={previewUrl}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : (
                          <FileText
                            className="size-6 text-muted-foreground"
                            aria-hidden
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 space-y-1 self-center">
                        <p className="truncate text-sm font-medium text-foreground">
                          {value.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {(value.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            {t("form.replaceReceipt")}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-xs text-error"
                            onClick={clearReceipt}
                          >
                            <Trash2 className="size-3.5" aria-hidden />
                            {t("form.removeReceipt")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center transition-colors",
                        errors.receipt
                          ? "border-error/50 bg-error-muted/30"
                          : "border-border/80 bg-muted/15 hover:border-primary/40 hover:bg-primary/5",
                      )}
                    >
                      <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <ImagePlus className="size-5" aria-hidden />
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {t("form.uploadCta")}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {t("form.uploadFormats")}
                      </span>
                    </button>
                  )}
                </div>
              )}
            />

            {errors.receipt ? (
              <p className="text-xs text-error" role="alert">
                {errors.receipt.message}
              </p>
            ) : null}
          </div>
        </>
      )}
    </section>
  );
}

function AccountDetails({
  title,
  rows,
  onCopy,
  copyAria,
}: {
  title: string;
  rows: {
    key: string;
    label: string;
    value?: string | null;
    dir?: "ltr" | "rtl";
  }[];
  onCopy: (label: string, text: string) => void;
  copyAria: (field: string) => string;
}) {
  return (
    <div className="space-y-2.5 rounded-xl border border-border/70 bg-muted/20 p-3 sm:p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <AccountRows rows={rows} onCopy={onCopy} copyAria={copyAria} />
    </div>
  );
}

function AccountRows({
  rows,
  onCopy,
  copyAria,
}: {
  rows: {
    key: string;
    label: string;
    value?: string | null;
    dir?: "ltr" | "rtl";
  }[];
  onCopy: (label: string, text: string) => void;
  copyAria: (field: string) => string;
}) {
  return (
    <TooltipProvider delay={100}>
      <dl className="grid gap-2">
        {rows.map((row) => (
          <div
            key={row.key}
            className="flex items-start justify-between gap-3"
          >
            <div className="min-w-0">
              <dt className="text-[11px] text-muted-foreground">{row.label}</dt>
              <dd
                className="break-all text-sm font-medium text-foreground"
                dir={row.dir}
              >
                {row.value}
              </dd>
            </div>
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label={copyAria(row.label)}
                    onClick={() => onCopy(row.label, row.value!)}
                  />
                }
              >
                <Copy className="size-3.5" aria-hidden />
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6}>
                {copyAria(row.label)}
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </dl>
    </TooltipProvider>
  );
}
