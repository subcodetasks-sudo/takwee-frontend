import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RegisterView } from "@/features/auth";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth.register" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function SignupPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <RegisterView />;
}