import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { OrderDetailsView } from "@/features/orders";

type Props = {
  params: Promise<{ locale: string; orderId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, orderId } = await params;
  const t = await getTranslations({ locale, namespace: "ProfilePage.orders" });

  return {
    title: t("details.metaTitle", { number: orderId }),
    description: t("details.metaDescription", { number: orderId }),
  };
}

export default async function OrderDetailsPage({ params }: Props) {
  const { locale, orderId } = await params;
  setRequestLocale(locale);

  return (
    <main className="page-shell flex min-h-dvh flex-1 flex-col">
      <OrderDetailsView orderId={orderId} />
    </main>
  );
}
