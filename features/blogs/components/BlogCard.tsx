"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Calendar, Clock, ArrowUpRight, BookOpen, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { BlogPost } from "../types";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  className?: string;
}

export function BlogCard({ post, featured = false, className }: BlogCardProps) {
  const t = useTranslations("Blogs");

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
        featured && "md:grid md:grid-cols-12 md:gap-6",
        className,
      )}
    >
      {/* Cover Image Container */}
      <div
        className={cn(
          "relative aspect-[16/10] w-full overflow-hidden bg-muted/30",
          featured && "md:col-span-6 md:aspect-auto md:h-full min-h-[260px]",
        )}
      >
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/10">
            <div className="flex flex-col items-center gap-2 text-muted-foreground/60">
              <BookOpen className="h-10 w-10 stroke-[1.5]" />
              <span className="text-xs font-medium">{t("badge")}</span>
            </div>
          </div>
        )}

        {/* Category Badge overlay */}
        {post.category && (
          <div className="absolute start-3 top-3 z-10">
            <Badge
              variant="secondary"
              className="bg-background/90 backdrop-blur-md border border-border/40 text-xs font-medium px-2.5 py-1 shadow-sm"
            >
              {post.category}
            </Badge>
          </div>
        )}

        {/* Featured ribbon badge */}
        {post.isFeatured && (
          <div className="absolute end-3 top-3 z-10">
            <Badge className="bg-primary text-primary-foreground text-xs font-medium gap-1 px-2.5 py-1 shadow-sm">
              <Sparkles className="h-3 w-3" />
              {t("featured")}
            </Badge>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div
        className={cn(
          "flex flex-1 flex-col justify-between p-5 md:p-6",
          featured && "md:col-span-6 md:p-8",
        )}
      >
        <div className="space-y-3">
          {/* Metadata Bar (Date & Read Time) */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {post.publishedDateFormatted && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <time dateTime={post.publishedAt}>{post.publishedDateFormatted}</time>
              </span>
            )}
            <span className="text-border">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{t("minRead", { minutes: post.readTimeMinutes })}</span>
            </span>
          </div>

          {/* Title */}
          <h3
            className={cn(
              "font-bold text-foreground transition-colors group-hover:text-primary line-clamp-2 leading-snug",
              featured ? "text-xl md:text-2xl" : "text-lg md:text-xl",
            )}
          >
            <Link href={post.href} className="focus:outline-none focus:underline">
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Footer info & CTA */}
        <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4">
          {/* Author if available */}
          {post.author ? (
            <div className="flex items-center gap-2.5">
              <Avatar className="h-7 w-7 border border-border/60">
                {post.author.avatar && (
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                )}
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                  {post.author.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-foreground/90">
                {post.author.name}
              </span>
            </div>
          ) : (
            <span className="text-xs font-medium text-muted-foreground">
              {t("brandVoice")}
            </span>
          )}

          {/* Read article arrow link */}
          <Link
            href={post.href}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary whitespace-nowrap shrink-0 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
            aria-label={`${t("readMore")}: ${post.title}`}
          >
            <span className="whitespace-nowrap">{t("readMore")}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0 stroke-[2]" />
          </Link>
        </div>
      </div>
    </article>
  );
}
