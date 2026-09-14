import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { FadeIn } from "@/components/animations";
import { OrdersList } from "./OrdersList";

export async function OrdersView() {
  const t = await getTranslations("ProfilePage.orders");

  return (
    <section className="w-full flex-1 py-5 sm:py-8 md:py-12">
      <div className="space-y-5 sm:space-y-8">
        <FadeIn direction="up">
          <div className="space-y-2 sm:space-y-3">
            <Link
              href="/me"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden />
              {t("backToAccount")}
            </Link>
            <div className="flex flex-wrap items-end justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">
                  {t("title")}
                </h1>
                <p className="mt-0.5 text-xs text-muted-foreground sm:mt-1 sm:text-sm">
                  {t("subtitle")}
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.05}>
          <OrdersList />
        </FadeIn>
      </div>
    </section>
  );
}
