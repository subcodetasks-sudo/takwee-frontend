import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  OrderDetailsView,
  getAllMockOrderIds,
  getMockOrderById,
} from "@/features/orders";

type Props = {
  params: Promise<{ locale: string; orderId: string }>;
};

export function generateStaticParams() {
  return getAllMockOrderIds().map((orderId) => ({ orderId }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, orderId } = await params;
  const order = getMockOrderById(orderId);
  const t = await getTranslations({ locale, namespace: "ProfilePage.orders" });

  if (!order) {
    return {
      title: t("details.notFoundTitle"),
    };
  }

  return {
    title: t("details.metaTitle", { number: order.number }),
    description: t("details.metaDescription", { number: order.number }),
  };
}

export default async function OrderDetailsPage({ params }: Props) {
  const { locale, orderId } = await params;
  setRequestLocale(locale);

  const order = getMockOrderById(orderId);
  if (!order) {
    notFound();
  }

  return (
    <main className="page-shell flex min-h-dvh flex-1 flex-col">
      <OrderDetailsView order={order} />
    </main>
  );
}
