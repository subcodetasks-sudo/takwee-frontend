"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, ChevronDown, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCities } from "../hooks/useCities";
import type { ShippingCity } from "../types";

interface CitySelectFieldProps {
  countryId?: number;
  cityId?: number;
  cityName?: string;
  onSelect: (city: ShippingCity) => void;
  hasError?: boolean;
}

export function CitySelectField({
  countryId,
  cityId,
  cityName,
  onSelect,
  hasError = false,
}: CitySelectFieldProps) {
  const t = useTranslations("ProfilePage.addresses");
  const enabled = typeof countryId === "number" && countryId > 0;
  const { cities, isLoading } = useCities(enabled ? countryId : undefined);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(() => {
    if (cityId) {
      const byId = cities.find((city) => city.id === cityId);
      if (byId) return byId;
    }
    return undefined;
  }, [cities, cityId]);

  const selectedLabel = selected?.name || cityName || null;
  const busy = Boolean(enabled && isLoading);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cities;
    return cities.filter((city) => city.name.toLowerCase().includes(q));
  }, [cities, query]);

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

  const handleSelect = (city: ShippingCity) => {
    onSelect(city);
    setOpen(false);
    setQuery("");
  };

  const placeholder = !enabled
    ? t("form.selectCountryFirst")
    : busy
      ? t("form.loadingCities")
      : (selectedLabel ?? t("form.cityPlaceholder"));

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("form.city")}
        id="address-city"
        disabled={!enabled || busy}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-input bg-card px-3 text-sm shadow-2xs transition-colors hover:bg-muted/40 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring select-none",
          hasError && "border-destructive ring-1 ring-destructive/30",
          open && "border-ring ring-1 ring-ring",
          (!enabled || busy) && "cursor-not-allowed opacity-70",
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          <MapPin
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <span
            className={cn(
              "truncate text-start",
              selectedLabel && enabled ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {placeholder}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open && enabled && (
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
              placeholder={t("form.searchCityPlaceholder")}
              aria-label={t("form.searchCityPlaceholder")}
              className="h-8 w-full rounded-lg border border-border/70 bg-muted/40 pe-3 ps-8 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <ul
            role="listbox"
            className="max-h-56 space-y-0.5 overflow-y-auto no-scrollbar"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-4 text-center text-xs text-muted-foreground">
                {t("form.noCitiesFound")}
              </li>
            ) : (
              filtered.map((city) => {
                const isSelected = selected?.id === city.id;

                return (
                  <li key={city.id} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onClick={() => handleSelect(city)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-start text-sm transition-colors hover:bg-muted select-none",
                        isSelected && "bg-muted font-medium",
                      )}
                    >
                      <span className="min-w-0 truncate text-foreground">
                        {city.name}
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
