import type { ApiFaq, ApiFaqsResponse } from "../types/api";
import type { FaqItem } from "../types";

export function mapFaq(apiFaq: ApiFaq): FaqItem {
  return {
    id: apiFaq.id,
    question: (apiFaq.question || "").trim(),
    answer: (apiFaq.answer || "").trim(),
    sortOrder: typeof apiFaq.sort_order === "number" ? apiFaq.sort_order : 0,
  };
}

export function mapFaqsResponse(response: ApiFaqsResponse): FaqItem[] {
  if (!response?.data || !Array.isArray(response.data)) {
    return [];
  }

  return response.data
    .filter((item): item is ApiFaq => Boolean(item && (item.question || item.answer)))
    .map(mapFaq)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
}
