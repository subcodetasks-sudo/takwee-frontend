"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@/lib/zod-resolver";
import { forgotPasswordAction } from "../api/actions";
import {
  createForgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas/forgot-password-schema";

export function ForgotPasswordForm() {
  const t = useTranslations("Auth.forgotPassword");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      createForgotPasswordSchema({
        emailRequired: t("errors.emailRequired"),
        emailInvalid: t("errors.emailInvalid"),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onValidSubmit = async (values: ForgotPasswordFormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setServerError(null);
    try {
      const res = await forgotPasswordAction({ email: values.email });
      if (!res.success) {
        setServerError(res.message || "Failed to send reset instructions");
        return;
      }
      setSubmittedEmail(values.email.trim());
    } catch {
      setServerError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedEmail) {
    return (
      <div
        role="status"
        className="space-y-3 rounded-xl border border-border bg-card p-5 shadow-md sm:p-6 sm:shadow-lg"
      >
        <p className="text-sm font-medium text-foreground sm:text-base">
          {t("successTitle")}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("successDescription", { email: submittedEmail })}
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
      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive sm:text-sm"
        >
          {serverError}
        </div>
      )}
      <div className="space-y-1.5">
        <Label
          htmlFor="forgot-password-email"
          className="text-xs font-medium sm:text-sm"
        >
          {t("email")}
        </Label>
        <Input
          id="forgot-password-email"
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
