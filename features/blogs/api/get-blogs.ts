import { ApiError, getApiBaseUrl, http } from "@/lib/api-client";
import type {
  ApiBlogDetailResponse,
  ApiBlogsResponse,
  BlogPost,
  BlogsListResult,
  FetchBlogsParams,
} from "../types";
import { mapBlog, mapBlogsResponse } from "../utils/map-blog";

const BLOGS_PATH = "/api/v1/blogs";

/**
 * Fetch list of blog articles with pagination.
 */
export async function fetchBlogs(
  params: FetchBlogsParams = {},
): Promise<BlogsListResult> {
  if (!getApiBaseUrl()) {
    return {
      posts: [],
      pagination: {
        currentPage: 1,
        lastPage: 1,
        perPage: 10,
        total: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }

  const { page = 1, perPage = 12, search, category, locale = "ar" } = params;

  try {
    const json = await http.get<ApiBlogsResponse>(BLOGS_PATH, {
      params: {
        page,
        per_page: perPage,
        ...(search ? { search } : {}),
        ...(category ? { category } : {}),
      },
      headers: {
        ...(locale ? { "Accept-Language": locale } : {}),
      },
    });

    return mapBlogsResponse(json, locale);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return {
        posts: [],
        pagination: {
          currentPage: page,
          lastPage: 1,
          perPage,
          total: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }
    console.error("[features/blogs] fetchBlogs error:", error);
    return {
      posts: [],
      pagination: {
        currentPage: page,
        lastPage: 1,
        perPage,
        total: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

/**
 * Fetch a single blog post by slug or ID.
 */
export async function fetchBlogBySlugOrId(
  slugOrId: string,
  locale = "ar",
): Promise<BlogPost | null> {
  if (!getApiBaseUrl() || !slugOrId) {
    return null;
  }

  const cleanSlugOrId = decodeURIComponent(slugOrId).trim();

  try {
    const json = await http.get<ApiBlogDetailResponse>(
      `${BLOGS_PATH}/${encodeURIComponent(cleanSlugOrId)}`,
      {
        headers: {
          ...(locale ? { "Accept-Language": locale } : {}),
        },
      },
    );

    if (json?.data) {
      return mapBlog(json.data, locale);
    }
  } catch (error) {
    // If direct endpoint by slug/id 404s, try finding it in the recent blogs list
    if (error instanceof ApiError && error.status === 404) {
      try {
        const listResult = await fetchBlogs({ perPage: 100, locale });
        const match = listResult.posts.find(
          (p) => p.slug === cleanSlugOrId || p.id === cleanSlugOrId,
        );
        if (match) return match;
      } catch {
        // Ignore fallback error
      }
    }
  }

  return null;
}
