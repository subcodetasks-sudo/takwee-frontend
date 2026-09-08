"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, ChevronDown, Globe, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  findCountryByCodeOrName,
  getLocalizedCountryName,
  getOrderedCountriesForSelect,
  type PhoneCountry,
} from "../utils/phone-codes";

interface CountrySelectFieldProps {
  countryCode?: string;
  countryName?: string;
  onSelect: (country: PhoneCountry) => void;
  hasError?: boolean;
}

export function CountrySelectField({
  countryCode,
  countryName,
  onSelect,
  hasError = false,
}: CountrySelectFieldProps) {
  const t = useTranslations("ProfilePage.addresses");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const countries = useMemo(
    () => getOrderedCountriesForSelect(locale),
    [locale]
  );

  const selected = useMemo(() => {
    return (
      findCountryByCodeOrName(countryCode) ||
      findCountryByCodeOrName(countryName)
    );
  }, [countryCode, countryName]);

  const selectedLabel = selected
    ? getLocalizedCountryName(selected, locale)
    : null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;

    return countries.filter((country) => {
      const localized = getLocalizedCountryName(country, locale).toLowerCase();
      return (
        localized.includes(q) ||
        country.nameEn.toLowerCase().includes(q) ||
        country.nameAr.toLowerCase().includes(q) ||
        country.nameTr.toLowerCase().includes(q) ||
        country.code.toLowerCase().includes(q) ||
        country.phone_code.includes(q.replace(/^\+/, ""))
      );
    });
  }, [countries, locale, query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => searchRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
    setQuery("");
  }, [open]);

  const handleSelect = (country: PhoneCountry) => {
    onSelect(country);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("form.country")}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-input bg-card px-3 text-sm shadow-2xs transition-colors hover:bg-muted/40 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring select-none",
          hasError && "border-destructive ring-1 ring-destructive/30",
          open && "border-ring ring-1 ring-ring"
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          <Globe
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <span
            className={cn(
              "truncate text-start",
              selectedLabel ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {selectedLabel ?? t("form.countryPlaceholder")}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      {open && (
        <div className="absolute inset-x-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-xl animate-in fade-in-0 zoom-in-95">
          <div className="relative mb-2">
            <Search
              className="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("form.searchCountryPlaceholder")}
              aria-label={t("form.searchCountryPlaceholder")}
              className="h-8 w-full rounded-lg border border-border/70 bg-muted/40 pe-3 ps-8 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <ul
            role="listbox"
            className="max-h-56 space-y-0.5 overflow-y-auto no-scrollbar"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-4 text-center text-xs text-muted-foreground">
                {t("form.noResultsFound")}
              </li>
            ) : (
              filtered.map((country) => {
                const label = getLocalizedCountryName(country, locale);
                const isSelected = selected?.code === country.code;

                return (
                  <li key={country.code} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onClick={() => handleSelect(country)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-start text-sm transition-colors hover:bg-muted select-none",
                        isSelected && "bg-muted font-medium"
                      )}
                    >
                      <span className="min-w-0 truncate text-foreground">
                        {label}
                      </span>
                      {isSelected && (
                        <Check
                          className="size-3.5 shrink-0 text-success"
                          aria-hidden
                        />
                      )}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
