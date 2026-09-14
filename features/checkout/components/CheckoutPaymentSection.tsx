"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Building2, Copy, ImagePlus, Trash2, FileText } from "lucide-react";
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
import type { CheckoutFormValues } from "../schemas";

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
  const { settings } = useSettings();
  const { copy } = useCopyToClipboard();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const bankRows = [
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
  const hasBankDetails = bankRows.length > 0 || Boolean(instructions);

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
    setValue("receipt", undefined as unknown as File, {
      shouldValidate: true,
      shouldDirty: true,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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

      <div className="flex items-start gap-2.5 sm:gap-3 rounded-xl border border-primary/40 bg-primary/5 p-2.5 sm:p-4">
        <span className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-xl bg-primary-100/70 dark:bg-primary-950/70 text-primary-800 dark:text-primary-200">
          <Building2 className="size-3.5 sm:size-4 stroke-[1.6]" aria-hidden />
        </span>
        <div className="min-w-0 space-y-0.5">
          <p className="text-sm font-semibold text-foreground">
            {t("methods.bankTransfer.label")}
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t("methods.bankTransfer.description")}
          </p>
        </div>
      </div>

      {hasBankDetails ? (
        <div className="space-y-2.5 rounded-xl border border-border/70 bg-muted/20 p-3 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("bankDetails.title")}
          </p>
          {instructions ? (
            <p className="text-xs leading-relaxed text-foreground/90 sm:text-sm">
              {instructions}
            </p>
          ) : null}
          {bankRows.length > 0 ? (
            <TooltipProvider delay={100}>
              <dl className="grid gap-2">
                {bankRows.map((row) => (
                  <div
                    key={row.key}
                    className="flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <dt className="text-[11px] text-muted-foreground">
                        {row.label}
                      </dt>
                      <dd className="break-all text-sm font-medium text-foreground">
                        {row.value}
                      </dd>
                    </div>
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <button
                            type="button"
                            className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label={t("bankDetails.copyAria", {
                              field: row.label,
                            })}
                            onClick={() => handleCopy(row.label, row.value!)}
                          />
                        }
                      >
                        <Copy className="size-3.5" aria-hidden />
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={6}>
                        {t("bankDetails.copyAria", { field: row.label })}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </dl>
            </TooltipProvider>
          ) : null}
        </div>
      ) : null}

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
    </section>
  );
}
