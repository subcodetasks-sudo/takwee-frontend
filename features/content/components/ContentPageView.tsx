import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/animations";
import { Link } from "@/i18n/routing";
import type { ContentBlock, ContentPage } from "../types";
import { ContentFaqBlock, ContentSizeChartBlock } from "./ContentBlocks";

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "heading": {
      const className =
        block.level === 2
          ? "mt-10 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          : "mt-8 text-lg font-semibold tracking-tight text-foreground sm:text-xl";
      if (block.level === 2) {
        return <h2 className={className}>{block.text}</h2>;
      }
      return <h3 className={className}>{block.text}</h3>;
    }
    case "paragraph":
      return (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {block.text}
        </p>
      );
    case "list": {
      const ListTag = block.style === "numbered" ? "ol" : "ul";
      return (
        <ListTag
          className={
            block.style === "numbered"
              ? "mt-4 list-decimal space-y-2 ps-5 text-sm leading-relaxed text-muted-foreground sm:text-base"
              : "mt-4 list-disc space-y-2 ps-5 text-sm leading-relaxed text-muted-foreground sm:text-base"
          }
        >
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ListTag>
      );
    }
    case "callout":
      return (
        <aside className="mt-8 rounded-xl border border-primary-200/60 bg-primary-50/50 px-4 py-3.5 text-sm leading-relaxed text-foreground dark:border-primary-800/40 dark:bg-primary-950/20 sm:px-5 sm:text-base">
          {block.text}
        </aside>
      );
    case "faq":
      return (
        <div className="mt-6">
          <ContentFaqBlock items={block.items} />
        </div>
      );
    case "size-chart":
      return (
        <div className="mt-8">
          <ContentSizeChartBlock />
        </div>
      );
    default:
      return null;
  }
}

interface ContentPageViewProps {
  page: ContentPage;
  locale: string;
}

export async function ContentPageView({ page, locale }: ContentPageViewProps) {
  const t = await getTranslations({ locale, namespace: "ContentPage" });

  const formattedDate = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(page.updatedAt));

  return (
    <section className="w-full py-10 sm:py-14 lg:py-16">
      <div className="page-shell">
        <FadeIn direction="up">
          <article className="mx-auto max-w-3xl">
            <header className="border-b border-border/70 pb-8">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {page.title}
              </h1>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                {page.description}
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                {t("lastUpdated", { date: formattedDate })}
              </p>
            </header>

            <div className="pt-2">
              {page.blocks.map((block, index) => (
                <ContentBlockRenderer key={`${block.type}-${index}`} block={block} />
              ))}
            </div>

            <footer className="mt-12 border-t border-border/70 pt-8">
              <Link
                href="/shop"
                className="text-sm font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
              >
                {t("continueShopping")}
              </Link>
            </footer>
          </article>
        </FadeIn>
      </div>
    </section>
  );
}
