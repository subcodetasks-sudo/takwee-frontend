export type {
  ApiFaq,
  ApiFaqsResponse,
  ApiFaqDetailResponse,
} from "./api";

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  sortOrder: number;
}

export interface FetchFaqsParams {
  locale?: string;
}
