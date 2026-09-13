"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useForm,
  type UseFormRegisterReturn,
} from "react-hook-form";
import { useTranslations } from "next-intl";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { gooeyToast } from "@/components/ui/goey-toaster";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { zodResolver } from "@/lib/zod-resolver";
import { useProfile } from "../hooks/useProfile";
import {
  createPasswordFormSchema,
  type PasswordFormValues,
} from "../schemas";

export function PasswordForm() {
  const t = useTranslations("ProfilePage.settings.password");
  const { updatePassword, isUpdatingPassword } = useProfile();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const schema = useMemo(
    () =>
      createPasswordFormSchema({
        currentRequired: t("errors.currentRequired"),
        newRequired: t("errors.newRequired"),
        newMinLength: t("errors.newMinLength"),
        confirmRequired: t("errors.confirmRequired"),
        mismatch: t("errors.mismatch"),
        sameAsCurrent: t("errors.sameAsCurrent"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 3200);
    return () => window.clearTimeout(timer);
  }, [saved]);

  const onValidSubmit = async (values: PasswordFormValues) => {
    if (isUpdatingPassword) return;

    try {
      await gooeyToast.promise(
        updatePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        }),
        {
          loading: t("saving"),
          success: t("saved"),
          error: (err: any) => {
            if (err?.fieldErrors) {
              if (err.fieldErrors.current_password?.[0]) {
                setError("currentPassword", {
                  message: err.fieldErrors.current_password[0],
                });
              }
              if (err.fieldErrors.new_password?.[0]) {
                setError("newPassword", {
                  message: err.fieldErrors.new_password[0],
                });
              }
            }
            return err.message || t("errors.updateFailed");
          },
        },
      );

      reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSaved(true);
    } catch {
      // Error handled by toast
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onValidSubmit)}
      className="flex h-full flex-col rounded-xl border border-border bg-card"
      autoComplete="off"
      noValidate
    >
      <div className="flex flex-1 flex-col gap-5 p-4 sm:gap-6 sm:p-5 md:p-6">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
            {t("title")}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            {t("subtitle")}
          </p>
        </div>

        <TooltipProvider delay={100}>
          <div className="space-y-4">
            <PasswordField
              id="profile-current-password"
              label={t("current")}
              registration={register("currentPassword")}
              visible={showCurrent}
              onToggleVisible={() => setShowCurrent((v) => !v)}
              error={errors.currentPassword?.message}
              showLabel={t("showPassword")}
              hideLabel={t("hidePassword")}
              autoComplete="current-password"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <PasswordField
                id="profile-new-password"
                label={t("new")}
                registration={register("newPassword")}
                visible={showNew}
                onToggleVisible={() => setShowNew((v) => !v)}
                error={errors.newPassword?.message}
                showLabel={t("showPassword")}
                hideLabel={t("hidePassword")}
                autoComplete="new-password"
              />

              <PasswordField
                id="profile-confirm-password"
                label={t("confirm")}
                registration={register("confirmPassword")}
                visible={showConfirm}
                onToggleVisible={() => setShowConfirm((v) => !v)}
                error={errors.confirmPassword?.message}
                showLabel={t("showPassword")}
                hideLabel={t("hidePassword")}
                autoComplete="new-password"
              />
            </div>
          </div>
        </TooltipProvider>
      </div>

      <div className="mt-auto flex flex-col-reverse gap-3 border-t border-border/80 bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-5 sm:py-3.5 md:px-6">
        {saved && (
          <p className="inline-flex items-center gap-1.5 text-xs text-success sm:me-auto">
            <CheckCircle2 className="size-3.5 shrink-0" aria-hidden />
            {t("saved")}
          </p>
        )}
        <Button
          type="submit"
          disabled={isUpdatingPassword}
          className="h-9 w-full text-xs font-medium shadow-2xs sm:w-auto"
        >
          {isUpdatingPassword ? t("saving") : t("save")}
        </Button>
      </div>
    </form>
  );
}

interface PasswordFieldProps {
  id: string;
  label: string;
  registration: UseFormRegisterReturn;
  visible: boolean;
  onToggleVisible: () => void;
  error?: string;
  showLabel: string;
  hideLabel: string;
  autoComplete: string;
}

function PasswordField({
  id,
  label,
  registration,
  visible,
  onToggleVisible,
  error,
  showLabel,
  hideLabel,
  autoComplete,
}: PasswordFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium">
        {label} <span className="text-destructive">*</span>
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          dir="ltr"
          {...registration}
          className={cn(
            "h-9 pe-10 text-sm md:h-10",
            error && "border-destructive ring-1 ring-destructive/30",
          )}
          autoComplete={autoComplete}
          aria-invalid={!!error}
        />
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                onClick={onToggleVisible}
                aria-label={visible ? hideLabel : showLabel}
                className="absolute inset-e-1 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              />
            }
          >
            {visible ? (
              <EyeOff className="size-3.5" aria-hidden />
            ) : (
              <Eye className="size-3.5" aria-hidden />
            )}
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={6} className="text-xs font-medium">
            {visible ? hideLabel : showLabel}
          </TooltipContent>
        </Tooltip>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
