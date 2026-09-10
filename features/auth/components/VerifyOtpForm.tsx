"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { gooeyToast } from "@/components/ui/goey-toaster";
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
import { resendVerificationAction, verifyEmailAction } from "../api/actions";

const RESEND_COOLDOWN_SECONDS = 60;

const OTP_SLOT_CLASS =
  "size-9 text-sm font-semibold bg-background border-border data-[active=true]:border-primary sm:size-11 sm:text-base md:size-12 md:text-lg";

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

  // Prefill devCode from registration redirect if present
  useEffect(() => {
    const devCode = searchParams.get("devCode");
    if (devCode) {
      setValue("code", devCode);
      try {
        gooeyToast.info(t("devCodeToastTitle", { code: devCode }), {
          description: t("devCodeToastDescription"),
          duration: 15000,
        });
      } catch {
        // Ignore
      }
    }
  }, [searchParams, setValue, t]);

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
      const res = await resendVerificationAction({ email });
      if (!res.success) {
        setServerError(res.message || t("resendError"));
        return;
      }

      setTimeLeft(RESEND_COOLDOWN_SECONDS);
      setValue("code", "");
      const msg = t("resendSuccess");
      setResendNotification(msg);

      try {
        gooeyToast.success(msg);
        if (res.data?.verificationCode) {
          gooeyToast.info(t("devResentCodeToastTitle", { code: res.data.verificationCode }), {
            description: t("devResentCodeToastDescription"),
            duration: 15000,
          });
        }
      } catch {
        // Fallback gracefully if toast container isn't ready
      }
    } catch {
      setServerError(t("resendError"));
    } finally {
      setIsResending(false);
    }
  }, [timeLeft, isResending, t, setValue, email]);

  // Handle Verify submit
  const onValidSubmit = async (values: VerifyOtpFormValues) => {
    if (isSubmitting || isSuccess) return;

    setIsSubmitting(true);
    setServerError(null);
    setResendNotification(null);

    try {
      const res = await verifyEmailAction({
        email,
        code: values.code,
      });

      if (!res.success) {
        setServerError(res.message || t("errors.invalidCode"));
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);

      try {
        gooeyToast.success(t("successTitle"), {
          description: t("successSubtitle"),
        });
      } catch {
        // Fallback gracefully
      }

      // Transition to sign in or target
      window.setTimeout(() => {
        router.push(redirectTo || "/login");
      }, 1200);
    } catch {
      setServerError(t("errors.invalidCode"));
      setIsSubmitting(false);
    }
  };

  const hasAutoSubmittedRef = useRef(false);

  return (
    <div className="space-y-5 sm:space-y-6">
      <form
        id={formId}
        onSubmit={handleSubmit(onValidSubmit)}
        className="space-y-5 rounded-xl border border-border bg-card p-4 shadow-md sm:space-y-6 sm:p-7 sm:shadow-lg"
        noValidate
      >
        {/* Visual Badge & Email info */}
        <div className="flex flex-col items-center space-y-2.5 text-center sm:space-y-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-4 ring-primary/5 sm:size-14 sm:ring-8">
            {isSuccess ? (
              <CheckCircle2 className="size-6 text-success sm:size-7" aria-hidden />
            ) : (
              <MailCheck className="size-6 sm:size-7" aria-hidden />
            )}
          </div>

          <div className="w-full max-w-full space-y-1.5">
            <p className="text-xs text-muted-foreground sm:text-sm">
              {email ? t("subtitle") : t("subtitleFallback")}
            </p>
            {email && (
              <div className="mx-auto flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] sm:px-3 sm:text-xs">
                <span
                  dir="ltr"
                  className="max-w-[min(100%,12rem)] truncate font-medium text-foreground sm:max-w-[16rem]"
                  title={email}
                >
                  {email}
                </span>
                <span className="text-muted-foreground" aria-hidden>
                  •
                </span>
                <Link
                  href="/signup"
                  className="shrink-0 font-medium text-primary underline-offset-4 hover:underline"
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
              <div className="flex w-full flex-col items-center space-y-2">
                <div dir="ltr" className="w-full max-w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                    containerClassName="justify-center gap-1 sm:gap-2"
                    aria-invalid={!!errors.code || !!serverError}
                    autoFocus
                  >
                    <InputOTPGroup className="shadow-2xs">
                      <InputOTPSlot index={0} className={OTP_SLOT_CLASS} />
                      <InputOTPSlot index={1} className={OTP_SLOT_CLASS} />
                      <InputOTPSlot index={2} className={OTP_SLOT_CLASS} />
                    </InputOTPGroup>

                    <InputOTPSeparator className="shrink-0 px-0.5 text-muted-foreground/60 sm:px-1" />

                    <InputOTPGroup className="shadow-2xs">
                      <InputOTPSlot index={3} className={OTP_SLOT_CLASS} />
                      <InputOTPSlot index={4} className={OTP_SLOT_CLASS} />
                      <InputOTPSlot index={5} className={OTP_SLOT_CLASS} />
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
          className="h-9 w-full text-sm font-medium shadow-2xs transition-all sm:h-11"
        >
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>

        {/* Resend Timer section */}
        <div className="flex flex-col items-center justify-center space-y-1.5 border-t border-border/60 pt-2 text-center sm:space-y-2">
          <p className="text-[11px] text-muted-foreground sm:text-xs">
            {t("resendPrompt")}
          </p>

          {timeLeft > 0 ? (
            <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-md bg-muted/60 px-2 py-1 text-[11px] font-medium text-muted-foreground sm:px-2.5 sm:text-xs">
              <Clock className="size-3.5 shrink-0 text-muted-foreground/80 animate-pulse" aria-hidden />
              <span className="tabular-nums">
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
              className="h-8 gap-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10 hover:text-primary"
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
