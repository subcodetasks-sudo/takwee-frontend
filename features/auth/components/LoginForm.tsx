"use client";

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
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
import { requestFcmWebToken } from "@/lib/firebase-messaging";
import { useAuth } from "../hooks/useAuth";
import { loginAction } from "../api/actions";
import {
  createLoginSchema,
  type LoginFormValues,
} from "../schemas/login-schema";
import {
  getCleanPathWithoutLocale,
  isGuestOnlyPath,
} from "../utils/session-cookie";

function computeSessionExpiry(seconds = 7200): string {
  return new Date(Date.now() + seconds * 1000).toISOString();
}

export function LoginForm() {
  const t = useTranslations("Auth.login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSnapshot } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      createLoginSchema({
        emailRequired: t("errors.emailRequired"),
        emailInvalid: t("errors.emailInvalid"),
        passwordRequired: t("errors.passwordRequired"),
        passwordMinLength: t("errors.passwordMinLength"),
      }),
    [t]
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onValidSubmit = async (values: LoginFormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setServerError(null);

    const loginPromise = async () => {
      try {
        const fcmToken = await requestFcmWebToken();
        if (fcmToken) {
          console.log("[FCM] login fcm_token:", fcmToken);
        }

        const res = await loginAction({
          email: values.email,
          password: values.password,
          rememberMe: values.rememberMe,
          fcm_token: fcmToken,
        });

        if (!res.success || !res.data) {
          const err = new Error(res.message || t("errorTitle"));
          (err as any).description = t("errorDescription");
          throw err;
        }

        setSnapshot({
          user: res.data.user,
          session: {
            token: res.data.accessToken,
            userId: res.data.user.id,
            expiresAt: computeSessionExpiry(),
          },
          isAuthenticated: true,
        });

        const firstName =
          res.data.user.name?.trim().split(/\s+/)[0] || res.data.user.name || "";
        return { firstName, user: res.data.user };
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

    const promise = loginPromise();

    try {
      gooeyToast.promise(promise, {
        loading: t("submitting"),
        success: (data) => t("welcomeBackTitle", { name: data.firstName }),
        error: (err: any) => err?.message || t("errorTitle"),
        description: {
          success: t("welcomeBackDescription"),
          error: (err: any) => err?.description || t("errorDescription"),
        },
        timing: { displayDuration: 6000 },
      });
    } catch {
      // Fallback gracefully if toast container is not ready
    }

    try {
      await promise;

      const redirectParam = searchParams.get("redirect");
      let destination = "/";
      if (
        redirectParam &&
        redirectParam.startsWith("/") &&
        !redirectParam.startsWith("//")
      ) {
        const clean = getCleanPathWithoutLocale(redirectParam);
        if (!isGuestOnlyPath(clean)) {
          const queryIndex = redirectParam.indexOf("?");
          const query = queryIndex !== -1 ? redirectParam.slice(queryIndex) : "";
          destination = clean + query;
        }
      }

      router.push(destination);
      router.refresh();
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
        <Label htmlFor="login-email" className="text-xs font-medium sm:text-sm">
          {t("email")}
        </Label>
        <Input
          id="login-email"
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
        <div className="flex items-center justify-between gap-3">
          <Label
            htmlFor="login-password"
            className="text-xs font-medium sm:text-sm"
          >
            {t("password")}
          </Label>
          <Link
            href="/forgot-password"
            className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            {t("forgotPassword")}
          </Link>
        </div>
        <TooltipProvider delay={100}>
          {/* dir=ltr keeps end-padding + eye icon on the same side as LTR password text */}
          <div className="relative" dir="ltr">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
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

      <Controller
        name="rememberMe"
        control={control}
        render={({ field }) => (
          <Label
            htmlFor="login-remember"
            className="flex cursor-pointer items-center gap-2.5 font-normal"
          >
            <Checkbox
              id="login-remember"
              checked={field.value}
              onCheckedChange={(next) => field.onChange(next === true)}
            />
            <span className="text-sm text-foreground">{t("rememberMe")}</span>
          </Label>
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
