"use client";

import { useTranslations } from "next-intl";
import { CurrencyDropdown } from "@/components/common/CurrencyDropdown";
import { LanguageDropdown } from "@/components/common/LanguageDropdown";

export function ProfilePreferences() {
  const t = useTranslations("ProfilePage");

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div>
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          {t("preferences.title")}
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {t("preferences.subtitle")}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <LanguageDropdown />
        <CurrencyDropdown />
      </div>
    </div>
  );
}
