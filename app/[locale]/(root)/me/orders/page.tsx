import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { OrdersView } from "@/features/orders";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ProfilePage.orders" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ProfileOrdersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="page-shell flex min-h-dvh flex-1 flex-col">
      <OrdersView />
    </main>
  );
}
