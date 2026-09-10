export type {
  ApiSettingItem,
  ApiSettingType,
  ApiSettingsResponse,
} from "./api";

/** Storefront view model for public app settings. */
export interface AppSettings {
  appName: string;
  siteLogo: string | null;
  siteFavicon: string | null;
  contactPhone: string | null;
  contactWhatsapp: string | null;
  contactEmail: string | null;
  contactAddress: {
    ar: string | null;
    en: string | null;
    tr: string | null;
  };
  contactMapLocation: string | null;
  workingHours: string | null;
  social: {
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
    linkedin: string | null;
    snapchat: string | null;
    tiktok: string | null;
    youtube: string | null;
  };
  metaTitle: {
    ar: string | null;
    en: string | null;
    tr: string | null;
  };
  metaDescription: {
    ar: string | null;
    en: string | null;
    tr: string | null;
  };
  metaKeywords: string | null;
  maintenanceMode: boolean;
  defaultCurrency: string;
  defaultLanguage: string;
  googleAnalyticsId: string | null;
  supportedCurrencies: string[];
}
