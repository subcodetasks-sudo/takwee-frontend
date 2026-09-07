import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProfileView } from "@/features/profile";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ProfilePage" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ProfilePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="page-shell flex min-h-dvh flex-1 flex-col">
      <ProfileView />
    </main>
  );
}
