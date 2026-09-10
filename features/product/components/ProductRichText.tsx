import { cn } from "@/lib/utils";

interface ProductRichTextProps {
  content: string;
  className?: string;
}

const HTML_TAG_REGEX = /<[a-z][\s\S]*>/i;

export function isHtml(text: string): boolean {
  return HTML_TAG_REGEX.test(text);
}

export function ProductRichText({ content, className }: ProductRichTextProps) {
  const trimmed = content.trim();
  if (!trimmed) return null;

  const hasHtml = isHtml(trimmed);

  if (!hasHtml) {
    return (
      <div
        className={cn(
          "whitespace-pre-line text-base leading-relaxed text-muted-foreground",
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
        "text-base leading-relaxed text-muted-foreground",
        // Paragraphs
        "[&_p]:mb-3 [&_p:last-child]:mb-0 [&_p]:leading-relaxed",
        // Headings
        "[&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-foreground [&_h1]:mt-6 [&_h1]:mb-3 [&_h1:first-child]:mt-0",
        "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-5 [&_h2]:mb-2.5 [&_h2:first-child]:mt-0",
        "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-4 [&_h3]:mb-2 [&_h3:first-child]:mt-0",
        "[&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-foreground [&_h4]:mt-3 [&_h4]:mb-1.5 [&_h4:first-child]:mt-0",
        // Strong & Emphasis
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_b]:font-semibold [&_b]:text-foreground",
        "[&_em]:italic",
        // Lists (with logical start padding for RTL/LTR support)
        "[&_ul]:list-disc [&_ul]:ps-5 [&_ul]:my-3 [&_ul]:space-y-1.5",
        "[&_ol]:list-decimal [&_ol]:ps-5 [&_ol]:my-3 [&_ol]:space-y-1.5",
        "[&_li]:leading-relaxed",
        // Blockquotes
        "[&_blockquote]:border-s-2 [&_blockquote]:border-primary/50 [&_blockquote]:ps-4 [&_blockquote]:py-1 [&_blockquote]:italic [&_blockquote]:my-3 [&_blockquote]:text-foreground/80",
        // Links
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors hover:[&_a]:text-primary-700",
        // Code / Pre
        "[&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono [&_code]:text-foreground",
        "[&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border/60 [&_pre]:bg-muted/40 [&_pre]:p-4 [&_pre]:my-3",
        // Tables
        "[&_table]:w-full [&_table]:my-3 [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:rounded-xl [&_table]:border [&_table]:border-border/70",
        "[&_th]:border-b [&_th]:border-border/70 [&_th]:bg-muted/50 [&_th]:p-2.5 [&_th]:text-start [&_th]:font-semibold [&_th]:text-foreground",
        "[&_td]:border-b [&_td]:border-border/40 [&_td]:p-2.5 [&_td]:text-start",
        // Images
        "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:my-3",
        // Horizontal Rule
        "[&_hr]:my-4 [&_hr]:border-border/60",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: trimmed }}
    />
  );
}
