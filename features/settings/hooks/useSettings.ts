"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { fetchSettings } from "../api/get-settings";
import type { AppSettings } from "../types";
import {
  localizedSetting,
  resolveAppName,
  whatsappHref,
} from "../utils/map-settings";
import { settingsQueryKey } from "../utils/query-key";

export { settingsQueryKey };

const EMPTY_SETTINGS: AppSettings = {
  appName: "Takween",
  siteLogo: null,
  siteFavicon: null,
  contactPhone: null,
  contactWhatsapp: null,
  contactEmail: null,
  contactAddress: { ar: null, en: null, tr: null },
  contactMapLocation: null,
  workingHours: null,
  social: {
    facebook: null,
    instagram: null,
    twitter: null,
    linkedin: null,
    snapchat: null,
    tiktok: null,
    youtube: null,
  },
  metaTitle: { ar: null, en: null, tr: null },
  metaDescription: { ar: null, en: null, tr: null },
  metaKeywords: null,
  maintenanceMode: false,
  defaultCurrency: "TRY",
  defaultLanguage: "ar",
  googleAnalyticsId: null,
  supportedCurrencies: ["TRY", "SAR", "USD", "AED"],
  bankName: null,
  bankAccountHolder: null,
  bankIban: null,
  bankAccountNumber: null,
  bankTransferInstructions: null,
};

/**
 * Shared app-settings query. Header, Footer, and other chrome
 * read from this cache so the API is hit once per session.
 */
export function useSettings() {
  const locale = useLocale();

  const query = useQuery({
    queryKey: settingsQueryKey,
    queryFn: fetchSettings,
  });

  const settings = query.data ?? EMPTY_SETTINGS;

  return {
    ...query,
    settings: query.data ?? null,
    // Strip retired "LINEN LINE" API values so chrome always shows Takween.
    appName: resolveAppName(settings.appName),
    siteLogo: settings.siteLogo,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    contactWhatsapp: settings.contactWhatsapp,
    contactMapLocation: settings.contactMapLocation,
    whatsappUrl: whatsappHref(settings.contactWhatsapp),
    workingHours: settings.workingHours,
    social: settings.social,
    maintenanceMode: settings.maintenanceMode,
    defaultCurrency: settings.defaultCurrency,
    defaultLanguage: settings.defaultLanguage,
    supportedCurrencies: settings.supportedCurrencies,
    googleAnalyticsId: settings.googleAnalyticsId,
    siteFavicon: settings.siteFavicon,
    metaKeywords: settings.metaKeywords,
    contactAddress: localizedSetting(settings.contactAddress, locale),
    metaTitle: localizedSetting(settings.metaTitle, locale),
    metaDescription: localizedSetting(settings.metaDescription, locale),
  };
}
