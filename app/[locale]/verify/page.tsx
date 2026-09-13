import { Suspense } from "react";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/routing";
import { AuthCenteredShell, VerifyView } from "@/features/auth";
import { hasAuthToken } from "@/features/auth/utils/session-cookie";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth.verify" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function VerifyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const cookieStore = await cookies();
  if (hasAuthToken(cookieStore)) {
    redirect({ href: "/", locale });
  }

  return (
    <AuthCenteredShell>
      <Suspense>
        <VerifyView />
      </Suspense>
    </AuthCenteredShell>
  );
}
