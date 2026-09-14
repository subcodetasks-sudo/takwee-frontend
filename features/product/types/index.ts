export type {
  ApiAbayaSizeGuide,
  ApiAbayaSizeGuideResponse,
  ApiAbayaSizeGuideRow,
  ApiProduct,
  ApiProductCategory,
  ApiProductColor,
  ApiProductDetailResponse,
  ApiProductFeature,
  ApiProductRating,
  ApiProductSize,
  ApiProductsLinks,
  ApiProductsMeta,
  ApiProductsPage,
  ApiProductsResponse,
} from "./api";

export type AbayaSizeGuide = import("./api").ApiAbayaSizeGuide;
export type AbayaSizeGuideRow = import("./api").ApiAbayaSizeGuideRow;


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

/** Standard abaya length codes used for size selection (extensible to any product size). */
export type AbayaSize = "52" | "54" | "56" | "58" | "60" | (string & {});

export interface ProductColor {
  id: string;
  nameKey: string;
  /** Display color name from the API (e.g. "Beige", "Navy Blue") */
  name?: string;
  swatch: ProductSwatchId;
  hex?: string;
  images: string[];
}

/** Size option from the API (name used for cart selection; details may be HTML). */
export interface ProductSize {
  id: string;
  name: AbayaSize;
  /** Optional rich-text details for this size. */
  details?: string;
}

/** Feature / specification item from the API (name/value may be HTML). */
export interface ProductFeature {
  id: string;
  name: string;
  value?: string;
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
  /**
   * API / CMS display name. When set, UI uses this instead of
   * `Products.{nameKey}` from next-intl.
   */
  name?: string;
  nameKey: string;
  /** Long-form description from the product API when present (may be HTML). */
  description?: string;
  priceTRY: number;
  compareAtPriceTRY?: number;
  badge?: ProductBadge;
  /** Primary gallery images (main_image + gallery) */
  images?: string[];
  colors: ProductColor[];
  /** SKU / model number shown on the PDP. */
  sku: string;
  /** Shipping weight in kilograms. */
  weightKg: number;
  inStock: boolean;
  /** Remaining units when the API provides stock quantity. */
  stockQuantity?: number;
  sizes: ProductSize[];
  /** Spec sections shown under Product details. */
  specs: ProductSpec[];
  /** Structured features from API */
  features?: ProductFeature[];
  includesSheila?: boolean;
  /** Catalog category id from the products API (when present). */
  categoryId?: string;
  /** Localized / API category display name. */
  categoryName?: string;
  /** Customer rating (0-5 scale). */
  rating?: number;
  /** Total review count. */
  reviewsCount?: number;
}

export type { ProductReview } from "./review";
