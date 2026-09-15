import { resolveImageUrl } from "@/lib/images";
import type { ApiSettingItem, AppSettings } from "../types";

function asString(value: ApiSettingItem["value"]): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return null;
}

function asBoolean(value: ApiSettingItem["value"]): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1";
  }
  if (typeof value === "number") return value !== 0;
  return false;
}

function asStringArray(value: ApiSettingItem["value"]): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0);
  }
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => String(item).trim())
          .filter((item) => item.length > 0);
      }
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
}

function resolveMedia(value: ApiSettingItem["value"]): string | null {
  const src = asString(value);
  if (!src) return null;
  return resolveImageUrl(src) || src;
}

function pick(
  map: Map<string, ApiSettingItem>,
  key: string,
): ApiSettingItem["value"] {
  return map.get(key)?.value ?? null;
}

/** Digits-only WhatsApp id suitable for `https://wa.me/{id}`. */
export function normalizeWhatsappId(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  return digits.length > 0 ? digits : null;
}

export function whatsappHref(raw: string | null | undefined): string | null {
  const id = normalizeWhatsappId(raw);
  return id ? `https://wa.me/${id}` : null;
}

export function localizedSetting(
  values: { ar: string | null; en: string | null; tr: string | null },
  locale: string,
): string | null {
  if (locale === "ar") return values.ar ?? values.en ?? values.tr;
  if (locale === "tr") return values.tr ?? values.en ?? values.ar;
  return values.en ?? values.ar ?? values.tr;
}

const LEGACY_APP_NAMES = new Set([
  "linenline",
  "linenlinestore",
  "linenlinestoreecommerce",
]);

/** Drop retired Linen Line brand strings so storefront falls back to Takween. */
export function resolveAppName(
  value: string | null | undefined,
  fallback = "Takween",
): string {
  const trimmed = value?.trim();
  if (!trimmed) return fallback;
  const normalized = trimmed.toLowerCase().replace(/[\s_-]+/g, "");
  if (LEGACY_APP_NAMES.has(normalized)) return fallback;
  return trimmed;
}

export function mapSettings(items: ApiSettingItem[]): AppSettings {
  const map = new Map(items.map((item) => [item.key, item]));

  return {
    appName: resolveAppName(asString(pick(map, "app_name"))),
    siteLogo: resolveMedia(pick(map, "site_logo")),
    siteFavicon: resolveMedia(pick(map, "site_favicon")),
    contactPhone: asString(pick(map, "contact_phone")),
    contactWhatsapp: asString(pick(map, "contact_whatsapp")),
    contactEmail: asString(pick(map, "contact_email")),
    contactAddress: {
      ar: asString(pick(map, "contact_address_ar")),
      en: asString(pick(map, "contact_address_en")),
      tr: asString(pick(map, "contact_address_tr")),
    },
    contactMapLocation: asString(pick(map, "contact_map_location")),
    workingHours: asString(pick(map, "working_hours")),
    social: {
      facebook: asString(pick(map, "social_facebook")),
      instagram: asString(pick(map, "social_instagram")),
      twitter: asString(pick(map, "social_twitter")),
      linkedin: asString(pick(map, "social_linkedin")),
      snapchat: asString(pick(map, "social_snapchat")),
      tiktok: asString(pick(map, "social_tiktok")),
      youtube: asString(pick(map, "social_youtube")),
    },
    metaTitle: {
      ar: asString(pick(map, "meta_title_ar")),
      en: asString(pick(map, "meta_title_en")),
      tr: asString(pick(map, "meta_title_tr")),
    },
    metaDescription: {
      ar: asString(pick(map, "meta_description_ar")),
      en: asString(pick(map, "meta_description_en")),
      tr: asString(pick(map, "meta_description_tr")),
    },
    metaKeywords: asString(pick(map, "meta_keywords")),
    maintenanceMode: asBoolean(pick(map, "maintenance_mode")),
    defaultCurrency: asString(pick(map, "default_currency")) ?? "TRY",
    defaultLanguage: asString(pick(map, "default_language")) ?? "ar",
    googleAnalyticsId: asString(pick(map, "google_analytics_id")),
    supportedCurrencies: asStringArray(pick(map, "supported_currencies")),
    bankName: asString(pick(map, "bank_name")),
    bankAccountHolder: asString(pick(map, "bank_account_holder")),
    bankIban: asString(pick(map, "bank_iban")),
    bankAccountNumber: asString(pick(map, "bank_account_number")),
    bankTransferInstructions: asString(pick(map, "bank_transfer_instructions")),
  };
}
