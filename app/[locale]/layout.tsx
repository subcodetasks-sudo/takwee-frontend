import type { Metadata } from "next";
import { Noto_Kufi_Arabic, Outfit } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { CurrencyProvider } from "@/hooks/useCurrency";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { WishlistProvider } from "@/features/wishlist";
import { CartFlyProvider, CartProvider } from "@/features/cart";
import {
  dehydrateSettings,
  getSettings,
  GoogleAnalytics,
  localizedSetting,
  MaintenancePage,
  SettingsHydration,
} from "@/features/settings";
import { getCurrencies } from "@/features/currencies";
import { GooeyToaster } from "@/components/ui/goey-toaster";
import "../globals.css";

const notoKufiArabic = Noto_Kufi_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
});

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const OG_LOCALE: Record<string, string> = {
  ar: "ar_SA",
  en: "en_US",
  tr: "tr_TR",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getSettings();

  const siteName = settings?.appName?.trim() || "Linen Line Store";
  const title =
    (settings && localizedSetting(settings.metaTitle, locale)) || siteName;
  const description =
    (settings && localizedSetting(settings.metaDescription, locale)) ||
    "Linen Line Store eCommerce";

  const keywords = settings?.metaKeywords
    ? settings.metaKeywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
    : undefined;

  const icons = settings?.siteFavicon
    ? { icon: [{ url: settings.siteFavicon }] }
    : undefined;

  const ogImages = settings?.siteLogo
    ? [{ url: settings.siteLogo }]
    : undefined;

  return {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    applicationName: siteName,
    ...(keywords?.length ? { keywords } : {}),
    ...(icons ? { icons } : {}),
    openGraph: {
      type: "website",
      siteName,
      title,
      description,
      locale: OG_LOCALE[locale] ?? locale,
      ...(ogImages ? { images: ogImages } : {}),
    },
    twitter: {
      card: ogImages ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImages ? { images: ogImages.map((img) => img.url) } : {}),
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const [messages, settings, initialCurrencies] = await Promise.all([
    getMessages(),
    getSettings(),
    getCurrencies(locale),
  ]);
  const dir = locale === "ar" ? "rtl" : "ltr";

  const activeFontClass =
    locale === "ar" ? notoKufiArabic.className : outfit.className;
  const activeFontVar =
    locale === "ar" ? "var(--font-noto-arabic)" : "var(--font-outfit)";

  const inMaintenance = settings?.maintenanceMode === true;
  const dehydratedSettings = dehydrateSettings(settings);

  return (
    <html
      lang={locale}
      dir={dir}
      style={{ ["--font-sans" as string]: activeFontVar }}
      className={`${notoKufiArabic.variable} ${outfit.variable} ${activeFontClass} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {inMaintenance && settings ? (
            <MaintenancePage settings={settings} />
          ) : (
            <QueryProvider>
              <SettingsHydration state={dehydratedSettings}>
                <WishlistProvider>
                  <CartProvider>
                    <CartFlyProvider>
                      <CurrencyProvider
                        defaultCurrency={settings?.defaultCurrency}
                        supportedCurrencies={settings?.supportedCurrencies}
                        initialCurrencies={initialCurrencies}
                      >
                        {children}
                      </CurrencyProvider>
                    </CartFlyProvider>
                  </CartProvider>
                </WishlistProvider>
              </SettingsHydration>
            </QueryProvider>
          )}
          {settings?.googleAnalyticsId ? (
            <GoogleAnalytics measurementId={settings.googleAnalyticsId} />
          ) : null}
          <GooeyToaster dir={dir} position={"top-center"} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
