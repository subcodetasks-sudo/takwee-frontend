"use client";

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { zodResolver } from "@/lib/zod-resolver";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { registerAction } from "../api/actions";
import {
  createRegisterSchema,
  type RegisterFormValues,
} from "../schemas/register-schema";

export function RegisterForm() {
  const t = useTranslations("Auth.register");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      createRegisterSchema({
        nameRequired: t("errors.nameRequired"),
        nameMinLength: t("errors.nameMinLength"),
        nameLettersOnly: t("errors.nameLettersOnly"),
        emailRequired: t("errors.emailRequired"),
        emailInvalid: t("errors.emailInvalid"),
        passwordRequired: t("errors.passwordRequired"),
        passwordMinLength: t("errors.passwordMinLength"),
        confirmPasswordRequired: t("errors.confirmPasswordRequired"),
        passwordMismatch: t("errors.passwordMismatch"),
        termsRequired: t("errors.termsRequired"),
      }),
    [t]
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const nameRegister = register("name");

  const router = useRouter();

  const onValidSubmit = async (values: RegisterFormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setServerError(null);

    const registerPromise = async () => {
      try {
        const res = await registerAction({
          name: values.name,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        });

        if (!res.success) {
          const fieldMsg = res.fieldErrors
            ? Object.values(res.fieldErrors).flat().join(" ")
            : null;
          const errMsg = fieldMsg || res.message || t("errorTitle");
          const err = new Error(errMsg);
          (err as any).description = t("errorDescription");
          throw err;
        }

        return res.data;
      } catch (err: unknown) {
        if (err instanceof Error && (err as any).description) {
          throw err;
        }
        const isNetwork =
          err instanceof Error &&
          (err.message.toLowerCase().includes("fetch") ||
            err.message.toLowerCase().includes("network") ||
            err.name === "AbortError");
        const fallbackErr = new Error(
          isNetwork
            ? t("errorTitle")
            : err instanceof Error
            ? err.message
            : t("errorTitle")
        );
        (fallbackErr as any).description = isNetwork
          ? t("networkErrorDescription")
          : t("errorDescription");
        throw fallbackErr;
      }
    };

    const promise = registerPromise();

    try {
      gooeyToast.promise(promise, {
        loading: t("submitting"),
        success: t("successTitle"),
        error: (err: any) => err?.message || t("errorTitle"),
        description: {
          success: t("successDescription"),
          error: (err: any) => err?.description || t("errorDescription"),
        },
        timing: { displayDuration: 6000 },
      });
    } catch {
      // Fallback gracefully if toast container is not ready
    }

    try {
      const data = await promise;

      const verificationCode = data?.verificationCode;
      if (verificationCode) {
        try {
          gooeyToast.info(t("devCodeToastTitle", { code: verificationCode }), {
            description: t("devCodeToastDescription"),
            duration: 15000,
          });
        } catch {
          // Ignore
        }
      }

      const codeQuery = verificationCode ? `&devCode=${encodeURIComponent(verificationCode)}` : "";
      router.push(`/verify?email=${encodeURIComponent(values.email)}${codeQuery}`);
    } catch (err: any) {
      setServerError(err?.message || t("errorTitle"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onValidSubmit)}
      className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-md sm:space-y-6 sm:p-6 sm:shadow-lg"
      noValidate
    >
      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive sm:text-sm"
        >
          {serverError}
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="register-name" className="text-xs font-medium sm:text-sm">
          {t("name")}
        </Label>
        <Input
          id="register-name"
          type="text"
          autoComplete="name"
          placeholder={t("namePlaceholder")}
          aria-invalid={!!errors.name}
          {...nameRegister}
          onKeyDown={(e) => {
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if (e.key.length === 1 && /\d/.test(e.key)) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            e.target.value = e.target.value.replace(/[^\p{L}\s'.-]/gu, "");
            void nameRegister.onChange(e);
          }}
          className={cn(
            "h-10 border-border bg-background text-sm shadow-2xs md:h-11",
            errors.name && "border-destructive ring-1 ring-destructive/30"
          )}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="register-email" className="text-xs font-medium sm:text-sm">
          {t("email")}
        </Label>
        <Input
          id="register-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          dir="ltr"
          placeholder={t("emailPlaceholder")}
          aria-invalid={!!errors.email}
          {...register("email")}
          className={cn(
            "h-10 border-border bg-background text-sm shadow-2xs md:h-11",
            errors.email && "border-destructive ring-1 ring-destructive/30"
          )}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="register-password"
          className="text-xs font-medium sm:text-sm"
        >
          {t("password")}
        </Label>
        <TooltipProvider delay={100}>
          <div className="relative" dir="ltr">
            <Input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              dir="ltr"
              placeholder={t("passwordPlaceholder")}
              aria-invalid={!!errors.password}
              {...register("password")}
              className={cn(
                "h-10 border-border bg-background pe-11 text-sm shadow-2xs md:h-11",
                errors.password && "border-destructive ring-1 ring-destructive/30"
              )}
            />
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? t("hidePassword") : t("showPassword")
                    }
                    className="absolute end-1.5 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  />
                }
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden />
                ) : (
                  <Eye className="size-4" aria-hidden />
                )}
              </TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={6}
                className="text-xs font-medium"
              >
                {showPassword ? t("hidePassword") : t("showPassword")}
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="register-confirm-password"
          className="text-xs font-medium sm:text-sm"
        >
          {t("confirmPassword")}
        </Label>
        <TooltipProvider delay={100}>
          <div className="relative" dir="ltr">
            <Input
              id="register-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              dir="ltr"
              placeholder={t("confirmPasswordPlaceholder")}
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
              className={cn(
                "h-10 border-border bg-background pe-11 text-sm shadow-2xs md:h-11",
                errors.confirmPassword && "border-destructive ring-1 ring-destructive/30"
              )}
            />
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={
                      showConfirmPassword ? t("hidePassword") : t("showPassword")
                    }
                    className="absolute end-1.5 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  />
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" aria-hidden />
                ) : (
                  <Eye className="size-4" aria-hidden />
                )}
              </TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={6}
                className="text-xs font-medium"
              >
                {showConfirmPassword ? t("hidePassword") : t("showPassword")}
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Controller
        name="acceptTerms"
        control={control}
        render={({ field }) => (
          <div className="space-y-1.5">
            <Label
              htmlFor="register-terms"
              className="flex cursor-pointer items-start gap-2.5 font-normal"
            >
              <Checkbox
                id="register-terms"
                checked={field.value}
                onCheckedChange={(next) => field.onChange(next === true)}
                className="mt-0.5"
                aria-invalid={!!errors.acceptTerms}
              />
              <span className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {t.rich("termsAgreement", {
                  terms: (chunks) => (
                    <Link
                      href="/terms"
                      className="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
                    >
                      {chunks}
                    </Link>
                  ),
                  privacy: (chunks) => (
                    <Link
                      href="/privacy"
                      className="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </span>
            </Label>
            {errors.acceptTerms && (
              <p className="text-xs text-destructive">
                {errors.acceptTerms.message}
              </p>
            )}
          </div>
        )}
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-10 w-full text-sm font-medium shadow-2xs sm:h-11"
      >
        {isSubmitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}

export const SignupForm = RegisterForm;

