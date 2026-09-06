"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  isMobile?: boolean;
  onSearchSubmit?: (query: string) => void;
}

export function SearchBar({
  className,
  isMobile = false,
  onSearchSubmit,
}: SearchBarProps) {
  const t = useTranslations("Navigation");
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearchSubmit?.(query.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "relative flex items-center w-full transition-all duration-200",
        className,
      )}
    >
      <div className="relative w-full">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none transition-colors" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className={cn(
            "ps-9 pe-8 py-1.5 h-9 rounded-xl bg-muted/60 hover:bg-muted/80 focus:bg-background border-border text-xs transition-colors duration-200 focus-visible:ring-1 focus-visible:ring-primary-400 placeholder:text-muted-foreground/70",
            isMobile ? "h-10 text-sm ps-10" : "",
          )}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => setQuery("")}
            className="absolute end-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="size-3" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>
    </form>
  );
}
