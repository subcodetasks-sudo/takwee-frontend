"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ProductCard } from "@/features/product";
import { cn } from "@/lib/utils";
import type { AdditionalSection } from "../types";
import { useHomePage } from "../hooks/useHomePage";
import { getActiveAdditionalSections } from "../utils/additional-sections";

export function AdditionalSections() {
  const t = useTranslations("AdditionalSections");
  const { sections, isLoading } = useHomePage();
  const activeSections = getActiveAdditionalSections(sections);

  if (isLoading && activeSections.length === 0) {
    return (
      <section
        className="w-full bg-background py-10 sm:py-12 md:py-16"
        aria-busy="true"
        aria-label={t("loading")}
      >
        <div className="page-shell space-y-8">
          <div className="mx-auto h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="aspect-3/4 animate-pulse rounded-xl bg-muted sm:rounded-2xl"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (activeSections.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col">
      {activeSections.map((section) => {
        const title =
          section.title ??
          (section.messageKey
            ? t(`sections.${section.messageKey}.title`)
            : section.slug);
        const description =
          section.description ??
          (section.messageKey
            ? t(`sections.${section.messageKey}.description`)
            : "");
        const bannerAlt = section.bannerImage
          ? section.messageKey
            ? t(`sections.${section.messageKey}.bannerAlt`)
            : title
          : undefined;

        return (
          <AdditionalSectionBlock
            key={section.id}
            section={section}
            viewMoreLabel={t("viewMore")}
            title={title}
            description={description}
            bannerAlt={bannerAlt}
          />
        );
      })}
    </div>
  );
}

interface AdditionalSectionBlockProps {
  section: AdditionalSection;
  title: string;
  description: string;
  bannerAlt?: string;
  viewMoreLabel: string;
}

function AdditionalSectionBlock({
  section,
  title,
  description,
  bannerAlt,
  viewMoreLabel,
}: AdditionalSectionBlockProps) {
  const hasBanner = Boolean(section.bannerImage);
  const tone = section.bannerTone ?? "primary";
  const hasDescription = Boolean(description?.trim());

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

              <div
                className={cn(
                  "pointer-events-none absolute inset-0",
                  tone === "secondary"
                    ? "bg-linear-to-r from-secondary-950/25 via-secondary-800/10 to-transparent rtl:bg-linear-to-l"
                    : "bg-linear-to-r from-primary-950/25 via-primary-800/10 to-transparent rtl:bg-linear-to-l",
                )}
              />
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 bg-linear-to-t to-transparent",
                  tone === "secondary"
                    ? "from-secondary-950/15 via-transparent"
                    : "from-primary-950/15 via-transparent",
                )}
              />

              <div className="relative z-10 flex w-full max-w-xl flex-col items-start gap-3 p-5 sm:gap-4 sm:p-8 md:p-10">
                <h2 className="text-2xl font-bold tracking-tight text-primary-50 drop-shadow-md sm:text-3xl md:text-4xl">
                  {title}
                </h2>
                {hasDescription ? (
                  <p className="text-sm leading-relaxed text-primary-50/95 drop-shadow-md sm:text-base">
                    {description}
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl space-y-2 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {title}
              </h2>
              {hasDescription ? (
                <p className="text-sm text-muted-foreground sm:text-base">
                  {description}
                </p>
              ) : null}
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
