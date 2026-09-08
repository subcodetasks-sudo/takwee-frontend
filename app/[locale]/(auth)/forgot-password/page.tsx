import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ForgotPasswordView } from "@/features/auth";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth.forgotPassword" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ForgotPasswordPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ForgotPasswordView />;
}
