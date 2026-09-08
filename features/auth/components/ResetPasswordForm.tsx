"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { zodResolver } from "@/lib/zod-resolver";
import {
  createResetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas/reset-password-schema";

type Props = {
  token?: string;
};

export function ResetPasswordForm({ token }: Props) {
  const t = useTranslations("Auth.resetPassword");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const schema = useMemo(
    () =>
      createResetPasswordSchema({
        passwordRequired: t("errors.passwordRequired"),
        passwordMinLength: t("errors.passwordMinLength"),
        confirmPasswordRequired: t("errors.confirmPasswordRequired"),
        passwordMismatch: t("errors.passwordMismatch"),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onValidSubmit = async (_values: ResetPasswordFormValues) => {
    if (isSubmitting || !token) return;
    setIsSubmitting(true);
    try {
      // Auth API / password-reset confirmation will be wired here.
      await new Promise((resolve) => window.setTimeout(resolve, 500));
      setIsSuccess(true);
      window.setTimeout(() => {
        router.push("/login");
      }, 1800);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div
        role="alert"
        className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-md sm:p-6 sm:shadow-lg"
      >
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground sm:text-base">
            {t("invalidTitle")}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t("invalidDescription")}
          </p>
        </div>
        <Button
          nativeButton={false}
          className="h-10 w-full text-sm font-medium shadow-2xs sm:h-11"
          render={(props) => <Link href="/forgot-password" {...props} />}
        >
          {t("requestNewLink")}
        </Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div
        role="status"
        className="space-y-3 rounded-xl border border-border bg-card p-5 shadow-md sm:p-6 sm:shadow-lg"
      >
        <p className="text-sm font-medium text-foreground sm:text-base">
          {t("successTitle")}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("successDescription")}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onValidSubmit)}
      className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-md sm:space-y-6 sm:p-6 sm:shadow-lg"
      noValidate
    >
      <div className="space-y-1.5">
        <Label
          htmlFor="reset-password"
          className="text-xs font-medium sm:text-sm"
        >
          {t("password")}
        </Label>
        <TooltipProvider delay={100}>
          <div className="relative" dir="ltr">
            <Input
              id="reset-password"
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
          htmlFor="reset-confirm-password"
          className="text-xs font-medium sm:text-sm"
        >
          {t("confirmPassword")}
        </Label>
        <TooltipProvider delay={100}>
          <div className="relative" dir="ltr">
            <Input
              id="reset-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              dir="ltr"
              placeholder={t("confirmPasswordPlaceholder")}
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
              className={cn(
                "h-10 border-border bg-background pe-11 text-sm shadow-2xs md:h-11",
                errors.confirmPassword &&
                  "border-destructive ring-1 ring-destructive/30"
              )}
            />
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={
                      showConfirmPassword
                        ? t("hidePassword")
                        : t("showPassword")
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
