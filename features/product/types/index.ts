export const PRODUCT_SWATCH_CLASSES = {
  black: "bg-foreground",
  olive: "bg-secondary-600",
  sand: "bg-primary-400",
  ivory: "bg-primary-100",
  charcoal: "bg-primary-800",
  taupe: "bg-primary-500",
} as const;

export type ProductSwatchId = keyof typeof PRODUCT_SWATCH_CLASSES;

export type ProductBadge = "sale" | "new";

/** Standard abaya length codes used for size selection. */
export type AbayaSize = "52" | "54" | "56" | "58" | "60";

export interface ProductColor {
  id: string;
  nameKey: string;
  swatch: ProductSwatchId;
  images: string[];
}

/** Spec block rendered in the product details tab (copy lives in i18n). */
export interface ProductSpec {
  id: string;
  /** When true, body is rendered as a bullet list under `products.{nameKey}.specs.{id}.bullets`. */
  hasBullets?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  nameKey: string;
  priceTRY: number;
  compareAtPriceTRY?: number;
  badge?: ProductBadge;
  colors: ProductColor[];
  /** SKU / model number shown on the PDP. */
  sku: string;
  /** Shipping weight in kilograms. */
  weightKg: number;
  inStock: boolean;
  sizes: AbayaSize[];
  /** Spec sections shown under Product details. */
  specs: ProductSpec[];
  includesSheila?: boolean;
  /** Customer rating (0-5 scale). */
  rating?: number;
  /** Total review count. */
  reviewsCount?: number;
}
