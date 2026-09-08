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
import {
  createRegisterSchema,
  type RegisterFormValues,
} from "../schemas/register-schema";

export function RegisterForm() {
  const t = useTranslations("Auth.register");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    try {
      // Simulate registration submission / API mutation
      await new Promise((resolve) => window.setTimeout(resolve, 500));
      router.push(`/verify?email=${encodeURIComponent(values.email)}`);
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

