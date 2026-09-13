"use client";

import React, { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProductSearch } from "@/features/shop";
import { SearchPopup } from "./SearchPopup";

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
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { products, isLoading, debouncedQuery } = useProductSearch(query, {
    enabled: isOpen,
    limit: 6,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsOpen(false);
    onSearchSubmit?.(trimmed);
    router.push(`/shop?search=${encodeURIComponent(trimmed)}`);
  };

  const handleSelectProduct = () => {
    setIsOpen(false);
    onSearchSubmit?.(query.trim());
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
    >
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center w-full transition-all duration-200"
      >
        <div className="relative w-full">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none transition-colors" />
          <Input
            type="text"
            inputMode="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen && e.target.value.trim().length > 0) {
                setIsOpen(true);
              }
            }}
            onFocus={() => {
              if (query.trim().length > 0) {
                setIsOpen(true);
              }
            }}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchButton")}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className={cn(
              "ps-9 pe-8 py-1.5 h-9 rounded-xl bg-muted/60 hover:bg-muted/80 focus:bg-background border-border text-xs transition-colors duration-200 focus-visible:ring-1 focus-visible:ring-primary-400 placeholder:text-muted-foreground/70",
              "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
              isMobile ? "h-10 text-sm ps-10" : "",
            )}
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={handleClear}
              className="absolute end-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full p-0 text-muted-foreground hover:text-foreground"
              aria-label={t("searchClear")}
            >
              <X className="size-3" />
            </Button>
          )}
        </div>
      </form>

      {/* Live search results popup */}
      <SearchPopup
        query={query}
        debouncedQuery={debouncedQuery}
        products={products}
        isLoading={isLoading}
        isOpen={isOpen && query.trim().length > 0}
        onClose={() => setIsOpen(false)}
        onSelectProduct={handleSelectProduct}
        isMobile={isMobile}
      />
    </div>
  );
}

