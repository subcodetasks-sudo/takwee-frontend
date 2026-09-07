export const SHOP_FILTERS = [
  "new-in",
  "abayas",
  "linen",
  "casual",
  "formal",
  "travel",
  "inners",
  "accessories",
  "sale",
] as const;

export type ShopFilter = (typeof SHOP_FILTERS)[number];

export function isShopFilter(value: string): value is ShopFilter {
  return (SHOP_FILTERS as readonly string[]).includes(value);
}

/** Locale-aware shop path helpers (hrefs for Link / redirect). */
export function shopPath(filter?: ShopFilter): `/shop` | `/shop/${ShopFilter}` {
  return filter ? `/shop/${filter}` : "/shop";
}
