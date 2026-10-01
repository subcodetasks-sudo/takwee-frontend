import React from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ChevronRight,
  FileQuestion,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { fetchBlogBySlugOrId } from "../api/get-blogs";
import { BlogRichText } from "./BlogRichText";
import { BlogShareButtons } from "./BlogShareButtons";
import type { BlogPost } from "../types";

interface BlogDetailViewProps {
  slug: string;
  locale?: string;
  post?: BlogPost | null;
}

export async function BlogDetailView({
  slug,
  locale = "ar",
  post: initialPost,
}: BlogDetailViewProps) {
  const t = await getTranslations({ locale, namespace: "Blogs" });

  const post = initialPost || (await fetchBlogBySlugOrId(slug, locale));

  if (!post) {
    return (
      <div className="mx-auto py-16 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <FileQuestion className="h-8 w-8 stroke-[1.5]" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          {t("noSearchResultsTitle")}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t("noSearchResultsSubtitle")}
        </p>
        <Link
          href="/blogs"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "inline-flex items-center gap-2 whitespace-nowrap shrink-0 rounded-full",
          )}
        >
          <ArrowLeft className="h-4 w-4 shrink-0 rtl:rotate-180" />
          <span className="whitespace-nowrap">{t("backToBlogs")}</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl space-y-8 md:space-y-12">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-muted-foreground"
      >
        <Link href="/" className="hover:text-foreground transition-colors">
          {t("breadcrumbHome")}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180 text-border" />
        <Link href="/blogs" className="hover:text-foreground transition-colors">
          {t("title")}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180 text-border" />
        <span className="text-foreground font-medium line-clamp-1 max-w-[200px] md:max-w-xs">
          {post.title}
        </span>
      </nav>

      {/* Article Header */}
      <header className="space-y-5 text-start">
        {/* Category & Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {post.category && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold px-3 py-1"
            >
              {post.category}
            </Badge>
          )}
          {post.isFeatured && (
            <Badge className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1">
              {t("featured")}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
          {post.title}
        </h1>

        {/* Metadata & Author Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border/50 py-4 text-xs md:text-sm text-muted-foreground">
          <div className="flex flex-wrap items-center gap-4">
            {post.author ? (
              <div className="flex items-center gap-2.5">
                <Avatar className="h-8 w-8 border border-border/60">
                  {post.author.avatar && (
                    <AvatarImage
                      src={post.author.avatar}
                      alt={post.author.name}
                    />
                  )}
                  <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                    {post.author.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">
                    {post.author.name}
                  </span>
                </div>
              </div>
            ) : (
              <span className="font-medium text-foreground">
                {t("brandVoice")}
              </span>
            )}

            <span className="text-border hidden sm:inline">•</span>

            {post.publishedDateFormatted && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.publishedAt}>
                  {post.publishedDateFormatted}
                </time>
              </span>
            )}

            <span className="text-border hidden sm:inline">•</span>

            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{t("minRead", { minutes: post.readTimeMinutes })}</span>
            </span>
          </div>

          <BlogShareButtons title={post.title} variant="header" />
        </div>
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border/60 bg-muted/40 shadow-sm">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      )}

      {/* Main Content Body */}
      <div className="prose-container py-4">
        {post.content ? (
          <BlogRichText content={post.content} />
        ) : post.excerpt ? (
          <p className="text-lg leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        ) : null}
      </div>

      {/* Article Tags */}
      {post.tags.length > 0 && (
        <div className="space-y-3 border-t border-border/50 pt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t("tags")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="bg-muted/40 text-xs text-muted-foreground border-border/60 px-3 py-1"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Author Box if bio exists */}
      {post.author && post.author.bio && (
        <div className="flex items-start gap-4 rounded-3xl border border-border/60 bg-card/60 p-6">
          <Avatar className="h-12 w-12 border border-border/60">
            {post.author.avatar && (
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
            )}
            <AvatarFallback className="text-sm bg-primary/10 text-primary font-bold">
              {post.author.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              {post.author.name}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {post.author.bio}
            </p>
          </div>
        </div>
      )}

      {/* Bottom Share & Navigation Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 rounded-3xl border border-border/60 bg-card p-5 sm:p-6 shadow-sm">
        <BlogShareButtons
          title={post.title}
          variant="footer"
          className="w-full md:w-auto"
        />

        {/* Back to blogs button */}
        <div className="flex items-center justify-center md:justify-end border-t md:border-t-0 border-border/40 pt-4 md:pt-0">
          <Link
            href="/blogs"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "shrink-0 text-xs font-semibold hover:bg-muted/60 inline-flex items-center gap-2",
            )}
          >
            <ArrowLeft className="h-4 w-4 shrink-0 rtl:rotate-180" />
            <span>{t("backToBlogs")}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
