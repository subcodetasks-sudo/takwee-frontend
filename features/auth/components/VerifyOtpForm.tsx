"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { gooeyToast } from "goey-toast";
import { CheckCircle2, Clock, MailCheck, RotateCw } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { zodResolver } from "@/lib/zod-resolver";
import {
  createVerifyOtpSchema,
  type VerifyOtpFormValues,
} from "../schemas/verify-otp-schema";

const RESEND_COOLDOWN_SECONDS = 60;

function formatCountdown(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

type Props = {
  initialEmail?: string;
  redirectTo?: string;
};

export function VerifyOtpForm({
  initialEmail,
  redirectTo = "/",
}: Props) {
  const t = useTranslations("Auth.verify");
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = useId();

  const email = useMemo(() => {
    return initialEmail || searchParams.get("email") || "";
  }, [initialEmail, searchParams]);

  const [timeLeft, setTimeLeft] = useState(RESEND_COOLDOWN_SECONDS);
  const [isResending, setIsResending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [resendNotification, setResendNotification] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      createVerifyOtpSchema({
        codeRequired: t("errors.codeRequired"),
        codeLength: t("errors.codeLength"),
      }),
    [t]
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
    },
  });

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [timeLeft]);

  // Handle Resend action
  const handleResend = useCallback(async () => {
    if (timeLeft > 0 || isResending) return;

    setIsResending(true);
    setServerError(null);
    setResendNotification(null);

    try {
      // Mock API call to request a new OTP code
      await new Promise((resolve) => window.setTimeout(resolve, 600));

      setTimeLeft(RESEND_COOLDOWN_SECONDS);
      setValue("code", "");
      const msg = t("resendSuccess");
      setResendNotification(msg);

      try {
        gooeyToast.success(msg);
      } catch {
        // Fallback gracefully if toast container isn't ready
      }
    } catch {
      setServerError(t("resendError"));
    } finally {
      setIsResending(false);
    }
  }, [timeLeft, isResending, t, setValue]);

  // Handle Verify submit
  const onValidSubmit = async (_values: VerifyOtpFormValues) => {
    if (isSubmitting || isSuccess) return;

    setIsSubmitting(true);
    setServerError(null);
    setResendNotification(null);

    try {
      // Simulate verification API call
      await new Promise((resolve) => window.setTimeout(resolve, 800));

      setIsSuccess(true);

      try {
        gooeyToast.success(t("successTitle"));
      } catch {
        // Fallback gracefully
      }

      // Smooth transition to store or dashboard
      window.setTimeout(() => {
        router.push(redirectTo);
      }, 1200);
    } catch {
      setServerError(t("errors.invalidCode"));
      setIsSubmitting(false);
    }
  };

  const hasAutoSubmittedRef = useRef(false);

  return (
    <div className="space-y-6">
      <form
        id={formId}
        onSubmit={handleSubmit(onValidSubmit)}
        className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-md sm:p-7 sm:shadow-lg"
        noValidate
      >
        {/* Visual Badge & Email info */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
            {isSuccess ? (
              <CheckCircle2 className="size-7 text-success" aria-hidden />
            ) : (
              <MailCheck className="size-7" aria-hidden />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {email ? t("subtitle") : t("subtitleFallback")}
            </p>
            {email && (
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs">
                <span dir="ltr" className="font-medium text-foreground">
                  {email}
                </span>
                <span className="text-muted-foreground">•</span>
                <Link
                  href="/signup"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  {t("changeEmail")}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Resend success notice */}
        {resendNotification && (
          <div
            role="status"
            className="rounded-lg border border-success/30 bg-success/10 px-3.5 py-2.5 text-center text-xs font-medium text-success"
          >
            {resendNotification}
          </div>
        )}

        {/* Server error notice */}
        {serverError && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-center text-xs font-medium text-destructive"
          >
            {serverError}
          </div>
        )}

        {/* Success message when verified */}
        {isSuccess && (
          <div
            role="status"
            className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-center space-y-1"
          >
            <p className="text-sm font-semibold text-success">
              {t("successTitle")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("successSubtitle")}
            </p>
          </div>
        )}

        {/* OTP Input */}
        <div className="space-y-3">
          <label
            htmlFor="otp-input"
            className="sr-only"
          >
            {t("codeLabel")}
          </label>

          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col items-center space-y-2">
                <div dir="ltr">
                  <InputOTP
                    id="otp-input"
                    maxLength={6}
                    disabled={isSubmitting || isSuccess}
                    value={field.value}
                    onChange={(val) => {
                      field.onChange(val);
                      // Clear errors when typing
                      if (serverError) setServerError(null);
                      // Auto-submit when exactly 6 numeric digits are entered
                      if (val.length === 6 && !hasAutoSubmittedRef.current) {
                        hasAutoSubmittedRef.current = true;
                        void handleSubmit(onValidSubmit)();
                      } else if (val.length < 6) {
                        hasAutoSubmittedRef.current = false;
                      }
                    }}
                    containerClassName="justify-center"
                    aria-invalid={!!errors.code || !!serverError}
                    autoFocus
                  >
                    <InputOTPGroup className="shadow-2xs">
                      <InputOTPSlot
                        index={0}
                        className="size-11 text-base sm:size-12 sm:text-lg font-semibold bg-background border-border data-[active=true]:border-primary"
                      />
                      <InputOTPSlot
                        index={1}
                        className="size-11 text-base sm:size-12 sm:text-lg font-semibold bg-background border-border data-[active=true]:border-primary"
                      />
                      <InputOTPSlot
                        index={2}
                        className="size-11 text-base sm:size-12 sm:text-lg font-semibold bg-background border-border data-[active=true]:border-primary"
                      />
                    </InputOTPGroup>

                    <InputOTPSeparator className="text-muted-foreground/60 px-1" />

                    <InputOTPGroup className="shadow-2xs">
                      <InputOTPSlot
                        index={3}
                        className="size-11 text-base sm:size-12 sm:text-lg font-semibold bg-background border-border data-[active=true]:border-primary"
                      />
                      <InputOTPSlot
                        index={4}
                        className="size-11 text-base sm:size-12 sm:text-lg font-semibold bg-background border-border data-[active=true]:border-primary"
                      />
                      <InputOTPSlot
                        index={5}
                        className="size-11 text-base sm:size-12 sm:text-lg font-semibold bg-background border-border data-[active=true]:border-primary"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {errors.code && (
                  <p className="text-xs text-destructive text-center">
                    {errors.code.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isSubmitting || isSuccess}
          className="h-10 w-full text-sm font-medium shadow-2xs sm:h-11 transition-all"
        >
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>

        {/* Resend Timer section */}
        <div className="flex flex-col items-center justify-center space-y-2 pt-2 border-t border-border/60 text-center">
          <p className="text-xs text-muted-foreground">
            {t("resendPrompt")}
          </p>

          {timeLeft > 0 ? (
            <div className="inline-flex items-center gap-1.5 rounded-md bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
              <Clock className="size-3.5 text-muted-foreground/80 animate-pulse" aria-hidden />
              <span>
                {t("resendCountdown", {
                  time: formatCountdown(timeLeft),
                })}
              </span>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isResending || isSubmitting || isSuccess}
              onClick={handleResend}
              className="h-8 gap-1.5 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <RotateCw
                className={cn("size-3.5", isResending && "animate-spin")}
                aria-hidden
              />
              <span>{isResending ? t("resending") : t("resendAction")}</span>
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
