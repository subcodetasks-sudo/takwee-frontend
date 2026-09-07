import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ProductCard } from "@/features/product";
import { cn } from "@/lib/utils";
import type { AdditionalSection } from "../types";
import { getActiveAdditionalSections } from "../utils/additional-sections";

interface AdditionalSectionsProps {
  sections?: AdditionalSection[];
}

export async function AdditionalSections({
  sections,
}: AdditionalSectionsProps) {
  const t = await getTranslations("AdditionalSections");
  const activeSections = getActiveAdditionalSections(sections);

  if (activeSections.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col">
      {activeSections.map((section) => (
        <AdditionalSectionBlock
          key={section.id}
          section={section}
          viewMoreLabel={t("viewMore")}
          shopCollectionLabel={t("shopCollection")}
          title={t(`sections.${section.messageKey}.title`)}
          description={t(`sections.${section.messageKey}.description`)}
          bannerAlt={
            section.bannerImage
              ? t(`sections.${section.messageKey}.bannerAlt`)
              : undefined
          }
        />
      ))}
    </div>
  );
}

interface AdditionalSectionBlockProps {
  section: AdditionalSection;
  title: string;
  description: string;
  bannerAlt?: string;
  viewMoreLabel: string;
  shopCollectionLabel: string;
}

function AdditionalSectionBlock({
  section,
  title,
  description,
  bannerAlt,
  viewMoreLabel,
  shopCollectionLabel,
}: AdditionalSectionBlockProps) {
  const hasBanner = Boolean(section.bannerImage);
  const tone = section.bannerTone ?? "primary";

  return (
    <section className="w-full bg-background py-10 sm:py-12 md:py-16">
      <div className="page-shell space-y-8">
        <FadeIn direction="up">
          {hasBanner && section.bannerImage ? (
            <div className="relative flex min-h-56 w-full items-end overflow-hidden rounded-xl sm:min-h-64 sm:rounded-2xl md:min-h-72 lg:aspect-21/9 lg:min-h-0">
              <Image
                src={section.bannerImage}
                alt={bannerAlt ?? title}
                fill
                sizes="(max-width: 1280px) 100vw, 90rem"
                className="object-cover object-center"
              />

              {/* Brand color blend — softer directional wash + light vertical depth */}
              <div
                className={cn(
                  "pointer-events-none absolute inset-0",
                  tone === "secondary"
                    ? "bg-linear-to-r from-secondary-950/50 via-secondary-800/30 to-secondary-500/5 rtl:bg-linear-to-l"
                    : "bg-linear-to-r from-primary-950/50 via-primary-800/30 to-primary-400/5 rtl:bg-linear-to-l",
                )}
              />
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 bg-linear-to-t to-transparent",
                  tone === "secondary"
                    ? "from-secondary-950/30 via-secondary-900/10"
                    : "from-primary-950/30 via-primary-900/10",
                )}
              />

              <div className="relative z-10 flex w-full max-w-xl flex-col items-start gap-3 p-5 sm:gap-4 sm:p-8 md:p-10">
                <h2 className="text-2xl font-bold tracking-tight text-primary-50 drop-shadow-sm sm:text-3xl md:text-4xl">
                  {title}
                </h2>
                <p className="text-sm leading-relaxed text-primary-50/90 drop-shadow-sm sm:text-base">
                  {description}
                </p>
                <Link
                  href={section.href}
                  className={cn(
                    buttonVariants({
                      variant: tone === "secondary" ? "default" : "secondary",
                      size: "lg",
                    }),
                    "mt-1 gap-2 px-5 shadow-md transition-shadow hover:shadow-lg sm:mt-2",
                  )}
                >
                  {shopCollectionLabel}
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl space-y-2 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {title}
              </h2>
              <p className="text-sm text-muted-foreground sm:text-base">
                {description}
              </p>
            </div>
          )}
        </FadeIn>

        <StaggerContainer
          staggerDelay={0.1}
          className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6"
        >
          {section.products.map((product) => (
            <StaggerItem key={`${section.id}-${product.id}`}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn direction="up" delay={0.1}>
          <div className="flex justify-center">
            <Link
              href={section.href}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "gap-2 px-6",
              )}
            >
              {viewMoreLabel}
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
