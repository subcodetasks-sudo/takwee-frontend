"use client";

import React, { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Globe,
  Palette,
  Coins,
  ArrowLeft,
  Check,
  Laptop,
  Sun,
  Moon,
  ShieldCheck,
  User,
  ExternalLink,
} from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { FadeIn } from "@/components/animations";
import { useCurrency, type CurrencyCode } from "@/hooks/useCurrency";
import { useAuth } from "@/features/auth";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { cn } from "@/lib/utils";
import { useGlobalTheme, type ThemeMode } from "../hooks/useGlobalTheme";

const LANGUAGES = [
  {
    code: "ar",
    nativeName: "العربية",
    subtitleKey: "ar",
    fontClass: "font-noto-arabic",
    badge: "RTL",
  },
  {
    code: "en",
    nativeName: "English",
    subtitleKey: "en",
    fontClass: "font-outfit",
    badge: "LTR",
  },
  {
    code: "tr",
    nativeName: "Türkçe",
    subtitleKey: "tr",
    fontClass: "font-outfit",
    badge: "LTR",
  },
] as const;

export function GlobalSettingsView() {
  const t = useTranslations("GlobalSettings");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPendingLocale, startTransition] = useTransition();

  const { theme, setTheme, isMounted } = useGlobalTheme();
  const { currency, setCurrency, supportedCurrencies, currencies } =
    useCurrency();
  const { isAuthenticated } = useAuth();

  const handleLocaleChange = (
    newLocale: (typeof LANGUAGES)[number]["code"],
  ) => {
    if (newLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    gooeyToast.success(t("saved"));
  };

  const handleCurrencyChange = (newCurrency: CurrencyCode) => {
    if (newCurrency === currency) return;
    setCurrency(newCurrency);
    gooeyToast.success(t("saved"));
  };

  return (
    <section className="w-full flex-1 py-6 sm:py-10 md:py-14">
      <div className="mx-auto space-y-6 sm:space-y-8 md:space-y-10">
        {/* Header Bar */}
        <FadeIn direction="up">
          <div className="space-y-2 sm:space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden />
              {t("backHome")}
            </Link>
            <div className="max-w-2xl">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                {t("title")}
              </h1>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm md:text-base">
                {t("subtitle")}
              </p>
            </div>
          </div>
        </FadeIn>

        {/* 1. Language Selection */}
        <FadeIn direction="up" delay={0.05}>
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 md:p-7 shadow-xs">
            <div className="flex items-start gap-3.5 border-b border-border/70 pb-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-primary">
                <Globe className="size-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                  {t("sections.language")}
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                  {t("sections.languageDesc")}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {LANGUAGES.map((lang) => {
                const isActive = locale === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    disabled={isPendingLocale}
                    onClick={() => handleLocaleChange(lang.code)}
                    className={cn(
                      "relative flex flex-col items-start justify-between rounded-xl border p-4 text-start transition-all",
                      isActive
                        ? "border-primary bg-primary/5 text-primary shadow-xs ring-1 ring-primary"
                        : "border-border/70 bg-card hover:border-border hover:bg-muted/40 text-foreground",
                    )}
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span
                        className={cn(
                          "text-base font-semibold sm:text-lg",
                          lang.fontClass,
                        )}
                      >
                        {lang.nativeName}
                      </span>
                      {isActive ? (
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="size-3" strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {lang.badge}
                        </span>
                      )}
                    </div>
                    <span className="mt-2 text-xs text-muted-foreground">
                      {t(`languages.${lang.subtitleKey}.region`)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </FadeIn>

        {/* 2. Ambiance & Theme Selection */}
        <FadeIn direction="up" delay={0.08}>
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 md:p-7 shadow-xs">
            <div className="flex items-start gap-3.5 border-b border-border/70 pb-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-primary">
                <Palette className="size-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                  {t("sections.appearance")}
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                  {t("sections.appearanceDesc")}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {/* System */}
              <button
                type="button"
                onClick={() => handleThemeChange("system")}
                className={cn(
                  "relative flex flex-col items-start justify-between rounded-xl border p-4 text-start transition-all",
                  isMounted && theme === "system"
                    ? "border-primary bg-primary/5 text-primary shadow-xs ring-1 ring-primary"
                    : "border-border/70 bg-card hover:border-border hover:bg-muted/40 text-foreground",
                )}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-foreground">
                      <Laptop className="size-4" />
                    </div>
                    <span className="text-sm font-semibold">
                      {t("theme.system")}
                    </span>
                  </div>
                  {isMounted && theme === "system" && (
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                  )}
                </div>
                <span className="mt-3 text-xs text-muted-foreground">
                  {t("theme.systemDesc")}
                </span>
              </button>

              {/* Light */}
              <button
                type="button"
                onClick={() => handleThemeChange("light")}
                className={cn(
                  "relative flex flex-col items-start justify-between rounded-xl border p-4 text-start transition-all",
                  isMounted && theme === "light"
                    ? "border-primary bg-primary/5 text-primary shadow-xs ring-1 ring-primary"
                    : "border-border/70 bg-card hover:border-border hover:bg-muted/40 text-foreground",
                )}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                      <Sun className="size-4" />
                    </div>
                    <span className="text-sm font-semibold">
                      {t("theme.light")}
                    </span>
                  </div>
                  {isMounted && theme === "light" && (
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                  )}
                </div>
                <span className="mt-3 text-xs text-muted-foreground">
                  {t("theme.lightDesc")}
                </span>
              </button>

              {/* Dark */}
              <button
                type="button"
                onClick={() => handleThemeChange("dark")}
                className={cn(
                  "relative flex flex-col items-start justify-between rounded-xl border p-4 text-start transition-all",
                  isMounted && theme === "dark"
                    ? "border-primary bg-primary/5 text-primary shadow-xs ring-1 ring-primary"
                    : "border-border/70 bg-card hover:border-border hover:bg-muted/40 text-foreground",
                )}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-slate-900 text-slate-100 dark:bg-slate-800 dark:text-slate-200">
                      <Moon className="size-4" />
                    </div>
                    <span className="text-sm font-semibold">
                      {t("theme.dark")}
                    </span>
                  </div>
                  {isMounted && theme === "dark" && (
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                  )}
                </div>
                <span className="mt-3 text-xs text-muted-foreground">
                  {t("theme.darkDesc")}
                </span>
              </button>
            </div>
          </div>
        </FadeIn>

        {/* 3. Currency Selection */}
        <FadeIn direction="up" delay={0.11}>
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 md:p-7 shadow-xs">
            <div className="flex items-start gap-3.5 border-b border-border/70 pb-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-primary">
                <Coins className="size-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                  {t("sections.currency")}
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                  {t("sections.currencyDesc")}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
              {supportedCurrencies.map((code) => {
                const isActive = currency === code;
                const currItem = currencies.find((c) => c.code === code);
                const symbol = currItem?.symbol || code;
                const name = currItem?.name || code;

                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleCurrencyChange(code)}
                    className={cn(
                      "flex flex-col items-start justify-between rounded-xl border p-3.5 text-start transition-all",
                      isActive
                        ? "border-primary bg-primary/5 text-primary shadow-xs ring-1 ring-primary"
                        : "border-border/70 bg-card hover:border-border hover:bg-muted/40 text-foreground",
                    )}
                  >
                    <div className="flex w-full items-center justify-between gap-1">
                      <span className="text-sm font-bold tracking-wide sm:text-base">
                        {code}
                      </span>
                      {isActive ? (
                        <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="size-2.5" strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-muted-foreground">
                          {symbol}
                        </span>
                      )}
                    </div>
                    <span className="mt-2 line-clamp-1 text-[11px] text-muted-foreground sm:text-xs">
                      {name}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-3.5 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
              {t("currencyHint")}
            </p>
          </div>
        </FadeIn>

        {/* 4. Account & Security Redirection Banner */}
        <FadeIn direction="up" delay={0.14}>
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3.5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {isAuthenticated ? (
                  <ShieldCheck className="size-5" />
                ) : (
                  <User className="size-5" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground sm:text-base">
                  {isAuthenticated
                    ? t("accountPrompt.authenticatedTitle")
                    : t("accountPrompt.guestTitle")}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                  {isAuthenticated
                    ? t("accountPrompt.authenticatedSubtitle")
                    : t("accountPrompt.guestSubtitle")}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              {isAuthenticated ? (
                <Link
                  href="/me/settings"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-muted"
                >
                  <span>{t("accountPrompt.manageAccount")}</span>
                  <ExternalLink className="size-3.5 rtl:rotate-180" />
                </Link>
              ) : (
                <Link
                  href={{
                    pathname: "/login",
                    query: { redirect: "/settings" },
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-xs transition-opacity hover:opacity-90"
                >
                  <span>{t("accountPrompt.signIn")}</span>
                  <ArrowLeft className="size-3.5 rotate-180 rtl:rotate-0" />
                </Link>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
