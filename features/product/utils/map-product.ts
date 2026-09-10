import { format, parseISO } from "date-fns";
import { ar, enUS, tr } from "date-fns/locale";
import type { Locale as DateLocale } from "date-fns";
import type { AbayaSize, Product, ProductColor, ProductReview } from "../types";
import { resolveImageUrl } from "@/lib/images";
import type { ApiProduct, ApiProductRating } from "../types/api";
import { slugify } from "./slugify";

const ABAYA_SIZES: AbayaSize[] = ["52", "54", "56", "58", "60"];

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
  // Color payload shape is still evolving; until it is typed, use a single
  // default swatch when we at least have gallery images.
  if (!Array.isArray(product.colors) || product.colors.length === 0) {
    if (fallbackImages.length === 0) return [];
    return [
      {
        id: "default",
        nameKey: "black",
        swatch: "black",
        images: fallbackImages,
      },
    ];
  }

  return [];
}

function mapSizes(raw: unknown[]): AbayaSize[] {
  if (!Array.isArray(raw) || raw.length === 0) return [...ABAYA_SIZES];

  const sizes = raw
    .map((item) => {
      if (typeof item === "string" || typeof item === "number") {
        return String(item);
      }
      if (item && typeof item === "object" && "name" in item) {
        return String((item as { name: unknown }).name);
      }
      if (item && typeof item === "object" && "size" in item) {
        return String((item as { size: unknown }).size);
      }
      return null;
    })
    .filter((size): size is AbayaSize =>
      ABAYA_SIZES.includes(size as AbayaSize),
    );

  return sizes.length > 0 ? sizes : [...ABAYA_SIZES];
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
