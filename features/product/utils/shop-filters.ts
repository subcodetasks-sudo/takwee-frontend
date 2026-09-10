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

export function shopPath(
  filter?: string,
): `/shop` | `/shop/${string}` {
  return filter ? `/shop/${filter}` : "/shop";
}
