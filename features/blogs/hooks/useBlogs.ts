"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { fetchBlogBySlugOrId, fetchBlogs } from "../api/get-blogs";
import type { BlogPost, BlogsListResult, FetchBlogsParams } from "../types";

export interface UseBlogsOptions extends Omit<FetchBlogsParams, "locale"> {
  initialData?: BlogsListResult;
  enabled?: boolean;
}

export function useBlogs(options: UseBlogsOptions = {}) {
  const locale = useLocale();
  const { page = 1, perPage = 12, search, category, initialData, enabled = true } = options;

  const query = useQuery({
    queryKey: ["blogs", locale, page, perPage, search || "", category || ""],
    queryFn: () => fetchBlogs({ page, perPage, search, category, locale }),
    initialData,
    staleTime: 60 * 1000,
    enabled,
  });

  return {
    posts: query.data?.posts ?? [],
    pagination: query.data?.pagination ?? {
      currentPage: page,
      lastPage: 1,
      perPage,
      total: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useBlog(slugOrId: string, initialData?: BlogPost | null) {
  const locale = useLocale();

  const query = useQuery({
    queryKey: ["blog", locale, slugOrId],
    queryFn: () => fetchBlogBySlugOrId(slugOrId, locale),
    initialData: initialData ?? undefined,
    staleTime: 60 * 1000,
    enabled: Boolean(slugOrId),
  });

  return {
    post: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
