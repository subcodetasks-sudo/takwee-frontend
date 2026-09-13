import { cookies } from "next/headers";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/routing";
import { hasAuthToken } from "@/features/auth/utils/session-cookie";
import { CheckoutView } from "@/features/checkout";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CheckoutPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function CheckoutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const cookieStore = await cookies();
  if (!hasAuthToken(cookieStore)) {
    redirect({
      href: { pathname: "/login", query: { redirect: "/checkout" } },
      locale,
    });
  }

  return (
    <main className="page-shell flex min-h-dvh flex-1 flex-col">
      <CheckoutView />
    </main>
  );
}
