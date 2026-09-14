"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { fetchProductById } from "../api/get-product-by-id";
import type { MappedProductDetail } from "../utils/map-product";

import {
  getProductPageBySlug,
  type ProductPageData,
} from "../utils/get-product-page";

export const productDetailQueryKey = (id: string, locale: string) =>
  ["product-detail", id, locale] as const;

export const productPageQueryKey = (slug: string, locale: string) =>
  ["product-page", slug, locale] as const;

export function useProduct(
  id?: string,
  initialData?: MappedProductDetail,
) {
  const locale = useLocale();

  const query = useQuery({
    queryKey: productDetailQueryKey(id ?? "", locale),
    queryFn: () => fetchProductById(id!, locale),
    initialData,
    enabled: Boolean(id),
  });

  return {
    ...query,
    product: query.data?.product ?? initialData?.product,
    reviews: query.data?.reviews ?? initialData?.reviews ?? [],
  };
}

/**
 * Fetch product details by slug or id on the client.
 */
export function useProductBySlug(
  slug?: string,
  initialData?: ProductPageData | null,
) {
  const locale = useLocale();

  const query = useQuery({
    queryKey: productPageQueryKey(slug ?? "", locale),
    queryFn: () => getProductPageBySlug(slug!, locale),
    initialData: initialData ?? undefined,
    enabled: Boolean(slug),
  });

  return {
    ...query,
    product: query.data?.product ?? initialData?.product,
    reviews: query.data?.reviews ?? initialData?.reviews ?? [],
    isNotFound: query.isSuccess && !query.data,
  };
}

