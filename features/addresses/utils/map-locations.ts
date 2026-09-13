import { PRIORITY_COUNTRY_CODES } from "./phone-codes";
import type { ShippingCity, ShippingCountry } from "../types";
import type { ApiCity, ApiCountry } from "../types/api";

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function mapCountry(data: ApiCountry): ShippingCountry {
  return {
    id: toNumber(data.id),
    name: data.name || "",
    code: (data.code || "").toUpperCase(),
    deliveryPrice: toNumber(data.delivery_price),
  };
}

export function mapCountries(items: ApiCountry[] | null | undefined): ShippingCountry[] {
  if (!Array.isArray(items)) return [];

  const mapped = items.map(mapCountry);
  const byCode = new Map(mapped.map((country) => [country.code, country]));
  const priority: ShippingCountry[] = [];

  for (const code of PRIORITY_COUNTRY_CODES) {
    const match = byCode.get(code);
    if (match) priority.push(match);
  }

  const prioritySet = new Set(PRIORITY_COUNTRY_CODES);
  const rest = mapped
    .filter((country) => !prioritySet.has(country.code))
    .sort((a, b) => a.name.localeCompare(b.name));

  return [...priority, ...rest];
}

export function mapCity(data: ApiCity): ShippingCity {
  return {
    id: toNumber(data.id),
    name: data.name || "",
    deliveryPrice: toNumber(data.delivery_price),
    countryId: data.country?.id != null ? toNumber(data.country.id) : undefined,
  };
}

export function mapCities(items: ApiCity[] | null | undefined): ShippingCity[] {
  if (!Array.isArray(items)) return [];
  return items
    .map(mapCity)
    .sort((a, b) => a.name.localeCompare(b.name));
}
