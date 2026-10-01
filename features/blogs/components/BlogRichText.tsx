import React from "react";
import { cn } from "@/lib/utils";

interface BlogRichTextProps {
  content: string;
  className?: string;
}

const HTML_TAG_REGEX = /<[a-z][\s\S]*>/i;

export function isHtml(text: string): boolean {
  return HTML_TAG_REGEX.test(text);
}

export function BlogRichText({ content, className }: BlogRichTextProps) {
  const trimmed = content.trim();
  if (!trimmed) return null;

  const hasHtml = isHtml(trimmed);

  if (!hasHtml) {
    return (
      <div
        className={cn(
          "whitespace-pre-line text-lg leading-relaxed text-foreground/80 font-normal",
          className,
        )}
      >
        {trimmed}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "text-lg leading-relaxed text-foreground/80 font-normal",
        // Paragraphs
        "[&_p]:mb-6 [&_p:last-child]:mb-0 [&_p]:leading-[1.8]",
        // Headings
        "[&_h1]:text-3xl md:[&_h1]:text-4xl [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mt-10 [&_h1]:mb-5 [&_h1:first-child]:mt-0",
        "[&_h2]:text-2xl md:[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-4 [&_h2:first-child]:mt-0",
        "[&_h3]:text-xl md:[&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-3 [&_h3:first-child]:mt-0",
        "[&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-foreground [&_h4]:mt-5 [&_h4]:mb-2 [&_h4:first-child]:mt-0",
        // Strong & Emphasis
        "[&_strong]:font-bold [&_strong]:text-foreground",
        "[&_b]:font-bold [&_b]:text-foreground",
        "[&_em]:italic",
        // Lists
        "[&_ul]:list-disc [&_ul]:ps-6 [&_ul]:my-5 [&_ul]:space-y-2",
        "[&_ol]:list-decimal [&_ol]:ps-6 [&_ol]:my-5 [&_ol]:space-y-2",
        "[&_li]:leading-relaxed",
        // Blockquotes
        "[&_blockquote]:border-s-4 [&_blockquote]:border-primary [&_blockquote]:ps-5 [&_blockquote]:py-2 [&_blockquote]:my-6 [&_blockquote]:italic [&_blockquote]:bg-primary/5 [&_blockquote]:rounded-e-xl [&_blockquote]:text-foreground/90",
        // Links
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors hover:[&_a]:text-primary/80",
        // Code / Pre
        "[&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono [&_code]:text-foreground",
        "[&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:border [&_pre]:border-border/60 [&_pre]:bg-muted/50 [&_pre]:p-5 [&_pre]:my-6",
        // Tables
        "[&_table]:w-full [&_table]:my-6 [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:rounded-2xl [&_table]:border [&_table]:border-border/70",
        "[&_th]:border-b [&_th]:border-border/70 [&_th]:bg-muted/60 [&_th]:p-3.5 [&_th]:text-start [&_th]:font-semibold [&_th]:text-foreground",
        "[&_td]:border-b [&_td]:border-border/40 [&_td]:p-3.5 [&_td]:text-start",
        // Images
        "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-2xl [&_img]:my-6 [&_img]:shadow-sm [&_img]:border [&_img]:border-border/40",
        // Horizontal Rule
        "[&_hr]:my-8 [&_hr]:border-border/60",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: trimmed }}
    />
  );
}
