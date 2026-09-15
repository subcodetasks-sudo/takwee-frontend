import type { Metadata } from "next";
import localFont from "next/font/local";
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
  ThemeProvider,
} from "@/features/settings";
import { getCurrencies } from "@/features/currencies";
import { GooeyToaster } from "@/components/ui/goey-toaster";
import { FcmPushListener } from "@/features/notifications";
import "../globals.css";

const gotham = localFont({
  src: [
    {
      path: "../../public/fonts/Gotham/Gotham Thin/Gotham Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gotham/Gotham Thin Italic/Gotham Thin Italic.otf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../../public/fonts/Gotham/Gotham Extra Light/Gotham Extra Light.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gotham/Gotham Extra Light Italic/Gotham Extra Light Italic.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../../public/fonts/Gotham/Gotham Light/Gotham Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gotham/Gotham Book/Gotham Book.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gotham/Gotham Italic/Gotham Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/Gotham/Gotham Medium/Gotham Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gotham/Gotham Bold/Gotham Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gotham/Gotham Bold Italic/Gotham Bold Italic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/Gotham/Gotham Black/Gotham Black.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gotham/Gotham Ultra/Gotham Ultra.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-gotham",
  display: "swap",
});

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

  const siteName = settings?.appName?.trim() || "Takween";
  const title =
    (settings && localizedSetting(settings.metaTitle, locale)) || siteName;
  const description =
    (settings && localizedSetting(settings.metaDescription, locale)) ||
    "Takween handmade boutique";

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

  const activeFontClass = `${gotham.className} ${locale === "ar" ? notoKufiArabic.className : outfit.className}`;
  // Locale-primary stack so `font-heading` / `font-sans` match body text
  // (Gotham first would make Arabic headings fall back differently from Noto Kufi).
  const activeFontVar =
    locale === "ar"
      ? "var(--font-noto-arabic), var(--font-gotham), sans-serif"
      : "var(--font-outfit), var(--font-gotham), sans-serif";

  const inMaintenance = settings?.maintenanceMode === true;
  const dehydratedSettings = dehydrateSettings(settings);

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${gotham.variable} ${notoKufiArabic.variable} ${outfit.variable} h-full antialiased`}
    >
      <body
        className={`${activeFontClass} flex min-h-full flex-col bg-background text-foreground`}
        style={{ ["--font-sans" as string]: activeFontVar }}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
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
                          <FcmPushListener />
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
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
