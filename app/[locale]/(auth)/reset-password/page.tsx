import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ResetPasswordView } from "@/features/auth";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth.resetPassword" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ResetPasswordPage({
  params,
  searchParams,
}: Props) {
  const { locale } = await params;
  const { token } = await searchParams;
  setRequestLocale(locale);

  return <ResetPasswordView token={token} />;
}
