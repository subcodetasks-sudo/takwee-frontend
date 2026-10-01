"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy, Share2 } from "lucide-react";
import { SiWhatsapp, SiX, SiFacebook } from "react-icons/si";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BlogShareButtonsProps {
  title: string;
  className?: string;
  variant?: "header" | "footer";
}

export function BlogShareButtons({ title, className = "", variant = "header" }: BlogShareButtonsProps) {
  const t = useTranslations("Blogs");
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = encodeURIComponent(title);
  const encodedShareUrl = encodeURIComponent(shareUrl);

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${shareTitle}%20${encodedShareUrl}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodedShareUrl}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`;

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      void navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (variant === "footer") {
    return (
      <div className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 ${className}`}>
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 shrink-0 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            {t("sharePrompt")}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "h-9 w-9 shrink-0 rounded-full hover:bg-muted/80",
            )}
          >
            <SiWhatsapp className="h-4 w-4 text-emerald-600" />
          </a>
          <a
            href={twitterShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on X"
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "h-9 w-9 shrink-0 rounded-full hover:bg-muted/80",
            )}
          >
            <SiX className="h-4 w-4" />
          </a>
          <a
            href={facebookShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "h-9 w-9 shrink-0 rounded-full hover:bg-muted/80",
            )}
          >
            <SiFacebook className="h-4 w-4 text-blue-600" />
          </a>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="h-9 shrink-0 gap-1.5 rounded-full px-3 text-xs hover:bg-muted/80"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-primary" />
                <span>{t("linkCopied")}</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>{t("copyLink")}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs font-medium hidden sm:inline">{t("share")}:</span>
      <a
        href={whatsappShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-8 w-8 rounded-full",
        )}
      >
        <SiWhatsapp className="h-3.5 w-3.5 text-emerald-600" />
      </a>
      <a
        href={twitterShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-8 w-8 rounded-full",
        )}
      >
        <SiX className="h-3.5 w-3.5" />
      </a>
      <Button
        variant="outline"
        size="icon"
        onClick={handleCopyLink}
        className="h-8 w-8 rounded-full"
        aria-label={t("copyLink")}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-primary" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>
    </div>
  );
}
