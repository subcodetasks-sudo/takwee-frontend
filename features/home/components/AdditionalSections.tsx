"use client";

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

        return (
          <AdditionalSectionBlock
            key={section.id}
            section={section}
            viewMoreLabel={t("viewMore")}
            title={title}
            description={description}
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
  viewMoreLabel: string;
}

function AdditionalSectionBlock({
  section,
  title,
  description,
  viewMoreLabel,
}: AdditionalSectionBlockProps) {
  const hasDescription = Boolean(description?.trim());

  return (
    <section className="w-full bg-background py-8 sm:py-10 md:py-12">
      <div className="page-shell space-y-6 sm:space-y-8">
        <FadeIn direction="up">
          <div className="flex flex-col items-start gap-1 sm:gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              {title}
            </h2>
            {hasDescription ? (
              <p className="text-sm text-muted-foreground sm:text-base">
                {description}
              </p>
            ) : null}
          </div>
        </FadeIn>

        <StaggerContainer
          staggerDelay={0.08}
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
