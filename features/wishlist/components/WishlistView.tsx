import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { FadeIn } from "@/components/animations";
import { WishlistContent } from "./WishlistContent";

/**
 * Server Component shell for wishlist — suitable for JSON-LD later.
 * Interactive list lives in {@link WishlistContent}.
 */
export async function WishlistView() {
  const t = await getTranslations("WishlistPage");

  return (
    <section className="w-full flex-1 py-5 sm:py-8 md:py-12">
      <div className="space-y-6 sm:space-y-10">
        {/* JSON-LD can be injected here. */}
        <FadeIn direction="up">
          <div className="space-y-2 sm:space-y-3">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft
                className="size-3.5 rtl:rotate-180 transition-transform duration-200 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5"
                aria-hidden
              />
              {t("backToShop")}
            </Link>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">
                {t("title")}
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground sm:mt-1 sm:text-sm">
                {t("subtitle")}
              </p>
            </div>
          </div>
        </FadeIn>

        <WishlistContent />
      </div>
    </section>
  );
}
