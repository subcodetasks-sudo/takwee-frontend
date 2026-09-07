import type { Metadata } from "next";
import { Noto_Kufi_Arabic, Outfit } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
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

export const metadata: Metadata = {
  title: "Linen Line Store",
  description: "Linen Line Store eCommerce",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

import { CurrencyProvider } from "@/hooks/useCurrency";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const activeFontClass = locale === "ar" ? notoKufiArabic.className : outfit.className;
  const activeFontVar = locale === "ar" ? "var(--font-noto-arabic)" : "var(--font-outfit)";

  return (
    <html
      lang={locale}
      dir={dir}
      style={{ ["--font-sans" as string]: activeFontVar }}
      className={`${notoKufiArabic.variable} ${outfit.variable} ${activeFontClass} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CurrencyProvider>
            <Header />
            <div className="flex-1 flex flex-col">{children}</div>
            <Footer />
          </CurrencyProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
