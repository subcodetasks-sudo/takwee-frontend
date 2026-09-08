"use client";

import { useTranslations } from "next-intl";
import { CurrencyDropdown } from "@/components/common/CurrencyDropdown";
import { LanguageDropdown } from "@/components/common/LanguageDropdown";

export function ProfilePreferences() {
  const t = useTranslations("ProfilePage");

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5 md:p-6">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
          {t("preferences.title")}
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
          {t("preferences.subtitle")}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
        <LanguageDropdown />
        <CurrencyDropdown />
      </div>
    </div>
  );
}
