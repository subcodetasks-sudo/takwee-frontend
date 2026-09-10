import { format, parseISO } from "date-fns";
import { ar, enUS, tr } from "date-fns/locale";
import type { Locale as DateLocale } from "date-fns";
import {
  PRODUCT_SWATCH_CLASSES,
  type AbayaSize,
  type Product,
  type ProductColor,
  type ProductReview,
  type ProductSwatchId,
} from "../types";
import { resolveImageUrl } from "@/lib/images";
import type { ApiProduct, ApiProductRating } from "../types/api";
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

function collectImages(product: ApiProduct): string[] {
  const refs = [
    product.main_image,
    ...(Array.isArray(product.images) ? product.images : []),
  ];

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

function mapColors(
  product: ApiProduct,
  fallbackImages: string[],
): ProductColor[] {
  if (Array.isArray(product.colors) && product.colors.length > 0) {
    const list: ProductColor[] = [];
    for (let i = 0; i < product.colors.length; i++) {
      const item = product.colors[i];
      if (!item || typeof item !== "object") continue;
      const c = item as { id?: number | string; name?: string; value?: string };
      const id = c.id != null ? String(c.id) : `color-${i}`;
      const name = c.name?.trim() || "";
      const swatchCandidate = name.toLowerCase() as ProductSwatchId;
      const swatch: ProductSwatchId =
        swatchCandidate in PRODUCT_SWATCH_CLASSES
          ? swatchCandidate
          : "black";

      list.push({
        id,
        nameKey: name || id,
        name: name || undefined,
        swatch,
        hex: c.value?.trim() || undefined,
        images: fallbackImages,
      });
    }
    return list;
  }

  return [];
}

function mapFeatures(raw: unknown[] | undefined): Product["features"] {
  if (!Array.isArray(raw) || raw.length === 0) return [];

  const list: NonNullable<Product["features"]> = [];
  for (let i = 0; i < raw.length; i++) {
    const item = raw[i];
    if (typeof item === "string") {
      const s = item.trim();
      if (s) list.push({ id: `feat-${i}`, name: s });
    } else if (item && typeof item === "object") {
      const obj = item as {
        id?: string | number;
        name?: string;
        title?: string;
        value?: string;
        description?: string;
      };
      const name = obj.name?.trim() || obj.title?.trim() || "";
      const value = obj.value?.trim() || obj.description?.trim() || "";
      if (name || value) {
        list.push({
          id: obj.id != null ? String(obj.id) : `feat-${i}`,
          name: name || value,
          value: name && value ? value : undefined,
        });
      }
    }
  }
  return list;
}

function mapSizes(raw: unknown[]): AbayaSize[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];

  const list: AbayaSize[] = [];
  for (const item of raw) {
    if (typeof item === "string" || typeof item === "number") {
      const s = String(item).trim();
      if (s) list.push(s);
    } else if (item && typeof item === "object") {
      if ("name" in item && typeof (item as { name: unknown }).name === "string") {
        const s = (item as { name: string }).name.trim();
        if (s) list.push(s);
      } else if ("size" in item && typeof (item as { size: unknown }).size === "string") {
        const s = (item as { size: string }).size.trim();
        if (s) list.push(s);
      }
    }
  }
  return list;
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
    inStock: product.status === "active",
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
