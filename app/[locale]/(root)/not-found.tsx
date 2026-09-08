import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/animations";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";

/**
 * Rendered when any route under `(root)` calls `notFound()` —
 * including unknown / unpublished content slugs in `[slug]/page.tsx`.
 * Header & Footer come from `(root)/layout.tsx`.
 */
export default async function RootNotFound() {
  const t = await getTranslations("NotFoundPage");

  return (
    <main className="flex flex-1 flex-col">
      <section className="flex flex-1 items-center py-16 sm:py-24">
        <div className="page-shell w-full">
          <FadeIn direction="up">
            <div className="mx-auto max-w-lg text-center">
              <p className="text-sm font-medium tracking-wide text-muted-foreground">
                {t("code")}
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {t("title")}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t("description")}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/"
                  className={buttonVariants({
                    variant: "default",
                    size: "lg",
                    className: "min-w-36",
                  })}
                >
                  {t("backHome")}
                </Link>
                <Link
                  href="/shop"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "min-w-36",
                  })}
                >
                  {t("browseShop")}
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
