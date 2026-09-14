import { format, parseISO } from "date-fns";
import { ar, enUS, tr } from "date-fns/locale";
import type { Locale as DateLocale } from "date-fns";
import {
  PRODUCT_SWATCH_CLASSES,
  type Product,
  type ProductColor,
  type ProductFeature,
  type ProductReview,
  type ProductSize,
  type ProductSwatchId,
} from "../types";
import { resolveImageUrl } from "@/lib/images";
import type {
  ApiProduct,
  ApiProductColor,
  ApiProductFeature,
  ApiProductRating,
  ApiProductSize,
} from "../types/api";
import { slugify } from "./slugify";

const DATE_LOCALES: Record<string, DateLocale> = {
  ar,
  en: enUS,
  tr,
};

function parseMoney(value: string | null | undefined): number | undefined {
  if (value == null || value === "") return undefined;
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : undefined;
}

function resolveMediaList(refs: Array<string | null | undefined>): string[] {
  const resolved: string[] = [];
  const seen = new Set<string>();

  for (const ref of refs) {
    if (!ref?.trim()) continue;
    const url = resolveImageUrl(ref);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    resolved.push(url);
  }

  return resolved;
}

function collectImages(product: ApiProduct): string[] {
  return resolveMediaList([
    product.main_image,
    ...(Array.isArray(product.images) ? product.images : []),
  ]);
}

function mapColorImages(
  color: ApiProductColor,
  fallbackImages: string[],
): string[] {
  const fromColor = resolveMediaList(
    Array.isArray(color.images) ? color.images : [],
  );
  return fromColor.length > 0 ? fromColor : fallbackImages;
}

function mapColors(
  product: ApiProduct,
  fallbackImages: string[],
): ProductColor[] {
  if (!Array.isArray(product.colors) || product.colors.length === 0) {
    return [];
  }

  const list: ProductColor[] = [];
  for (let i = 0; i < product.colors.length; i++) {
    const item = product.colors[i];
    if (!item || typeof item !== "object") continue;

    const c = item as ApiProductColor;
    const id = c.id != null ? String(c.id) : `color-${i}`;
    const name = c.name?.trim() || "";
    const swatchCandidate = name.toLowerCase() as ProductSwatchId;
    const swatch: ProductSwatchId =
      swatchCandidate in PRODUCT_SWATCH_CLASSES ? swatchCandidate : "black";

    list.push({
      id,
      nameKey: name || id,
      name: name || undefined,
      swatch,
      hex: c.value?.trim() || undefined,
      images: mapColorImages(c, fallbackImages),
    });
  }
  return list;
}

function mapFeatures(
  raw: ApiProductFeature[] | undefined,
): ProductFeature[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];

  const list: ProductFeature[] = [];
  for (let i = 0; i < raw.length; i++) {
    const item = raw[i] as ApiProductFeature | string | null | undefined;
    if (typeof item === "string") {
      const s = item.trim();
      if (s) list.push({ id: `feat-${i}`, name: s });
      continue;
    }
    if (!item || typeof item !== "object") continue;

    const name = item.name?.trim() || "";
    const value = item.value?.trim() || "";
    if (!name && !value) continue;

    list.push({
      id: item.id != null ? String(item.id) : `feat-${i}`,
      name: name || value,
      value: name && value && name !== value ? value : undefined,
    });
  }
  return list;
}

function mapSizes(raw: ApiProductSize[] | unknown[] | undefined): ProductSize[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];

  const list: ProductSize[] = [];
  for (let i = 0; i < raw.length; i++) {
    const item = raw[i];
    if (typeof item === "string" || typeof item === "number") {
      const name = String(item).trim();
      if (name) list.push({ id: `size-${i}`, name });
      continue;
    }
    if (!item || typeof item !== "object") continue;

    const obj = item as ApiProductSize & { size?: string };
    const name =
      obj.name?.trim() ||
      (typeof obj.size === "string" ? obj.size.trim() : "") ||
      "";
    if (!name) continue;

    const details = obj.details?.trim() || undefined;
    list.push({
      id: obj.id != null ? String(obj.id) : `size-${i}`,
      name,
      details,
    });
  }
  return list;
}

function resolveInStock(product: ApiProduct): boolean {
  if (typeof product.in_stock === "boolean") return product.in_stock;
  if (
    typeof product.stock_quantity === "number" &&
    Number.isFinite(product.stock_quantity)
  ) {
    return product.stock_quantity > 0;
  }
  return product.status === "active";
}

function parseApiDate(value: string): Date | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  const isoCandidate = trimmed.includes("T")
    ? trimmed
    : trimmed.replace(" ", "T");

  try {
    const parsed = parseISO(isoCandidate);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  } catch {
    // fall through
  }

  const fallback = new Date(trimmed);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

function formatReviewDate(value: string, locale?: string): string {
  const date = parseApiDate(value);
  if (!date) return value;

  const dateLocale = DATE_LOCALES[locale ?? ""] ?? enUS;
  return format(date, "d MMM yyyy", { locale: dateLocale });
}

/** Map a single API rating into the PDP review list model. */
export function mapProductRating(
  rating: ApiProductRating,
  locale?: string,
): ProductReview {
  const size = rating.size?.trim() || undefined;

  return {
    id: String(rating.id),
    author: rating.customer_name?.trim() || "—",
    rating: Number.isFinite(rating.rating) ? rating.rating : 0,
    date: formatReviewDate(rating.createdAt, locale),
    title: rating.title?.trim() || "",
    comment: rating.comment?.trim() || "",
    verified: true,
    sizePurchased: size,
    helpfulCount: 0,
  };
}

export function mapProductRatings(
  ratings: ApiProductRating[] | undefined,
  locale?: string,
): ProductReview[] {
  if (!Array.isArray(ratings)) return [];
  return ratings.map((rating) => mapProductRating(rating, locale));
}

/** Map a catalog API product into the storefront `Product` model. */
export function mapProduct(product: ApiProduct): Product {
  const priceTRY = parseMoney(product.price) ?? 0;
  const compareAtPriceTRY = parseMoney(product.original_price ?? undefined);
  const images = collectImages(product);
  const isSale =
    compareAtPriceTRY != null && compareAtPriceTRY > priceTRY;

  const baseSlug = slugify(product.name) || `product-${product.id}`;
  const rating =
    typeof product.rating === "number" && Number.isFinite(product.rating)
      ? product.rating
      : undefined;
  const reviewsCount =
    typeof product.ratings_count === "number" &&
    Number.isFinite(product.ratings_count)
      ? product.ratings_count
      : Array.isArray(product.ratings)
        ? product.ratings.length
        : undefined;

  const description = product.description?.trim() || undefined;
  const stockQuantity =
    typeof product.stock_quantity === "number" &&
    Number.isFinite(product.stock_quantity)
      ? product.stock_quantity
      : undefined;

  return {
    id: String(product.id),
    slug: baseSlug,
    name: product.name,
    nameKey: baseSlug,
    description,
    priceTRY,
    compareAtPriceTRY: isSale ? compareAtPriceTRY : undefined,
    badge: isSale ? "sale" : undefined,
    sku: product.model_number?.trim() || String(product.id),
    weightKg: parseMoney(product.weight) ?? 0,
    inStock: resolveInStock(product),
    stockQuantity,
    sizes: mapSizes(product.sizes),
    specs: [],
    features: mapFeatures(product.features),
    images,
    colors: mapColors(product, images),
    categoryId:
      product.category?.id != null ? String(product.category.id) : undefined,
    categoryName: product.category?.name?.trim() || undefined,
    rating,
    reviewsCount,
  };
}

export function mapProducts(products: ApiProduct[]): Product[] {
  return [...(products ?? [])]
    .filter((product) => product.status === "active")
    .map(mapProduct);
}

export interface MappedProductDetail {
  product: Product;
  reviews: ProductReview[];
}

export function mapProductDetail(
  apiProduct: ApiProduct,
  locale?: string,
): MappedProductDetail {
  return {
    product: mapProduct(apiProduct),
    reviews: mapProductRatings(apiProduct.ratings, locale),
  };
}
