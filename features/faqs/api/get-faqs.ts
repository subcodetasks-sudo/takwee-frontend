import { ApiError, getApiBaseUrl, http } from "@/lib/api-client";
import type { ApiFaqDetailResponse, ApiFaqsResponse, FaqItem } from "../types";
import { mapFaq, mapFaqsResponse } from "../utils/map-faq";

const FAQS_PATH = "/api/v1/faqs";

/**
 * Fetch active FAQs list from GET /api/v1/faqs (ordered by sort_order).
 */
export async function fetchFaqs(locale = "ar"): Promise<FaqItem[]> {
  if (!getApiBaseUrl()) {
    return [];
  }

  try {
    const json = await http.get<ApiFaqsResponse>(FAQS_PATH, {
      headers: {
        ...(locale ? { "Accept-Language": locale } : {}),
      },
    });

    return mapFaqsResponse(json);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return [];
    }
    console.error("[features/faqs] fetchFaqs error:", error);
    return [];
  }
}

/**
 * Fetch a single FAQ by numeric ID from GET /api/v1/faqs/{id}.
 */
export async function fetchFaqById(
  id: number | string,
  locale = "ar",
): Promise<FaqItem | null> {
  if (!getApiBaseUrl() || id === undefined || id === null) {
    return null;
  }

  const numericId = Number(id);
  if (Number.isNaN(numericId)) {
    return null;
  }

  try {
    const json = await http.get<ApiFaqDetailResponse>(`${FAQS_PATH}/${numericId}`, {
      headers: {
        ...(locale ? { "Accept-Language": locale } : {}),
      },
    });

    if (json?.data) {
      return mapFaq(json.data);
    }
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    console.error("[features/faqs] fetchFaqById error:", error);
  }

  return null;
}
