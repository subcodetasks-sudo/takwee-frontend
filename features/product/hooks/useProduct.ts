"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { fetchProductById } from "../api/get-product-by-id";
import type { MappedProductDetail } from "../utils/map-product";

export const productDetailQueryKey = (id: string, locale: string) =>
  ["product-detail", id, locale] as const;

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
