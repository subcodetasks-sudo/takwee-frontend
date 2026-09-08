import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AddressesView } from "@/features/addresses";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ProfilePage.addresses" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ProfileAddressesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="page-shell flex min-h-dvh flex-1 flex-col">
      <AddressesView />
    </main>
  );
}
