export interface ApiFaq {
  id: number;
  question: string | null;
  answer: string | null;
  sort_order: number;
}

export interface ApiFaqsResponse {
  success: boolean;
  message: string;
  data: ApiFaq[];
}

export interface ApiFaqDetailResponse {
  success: boolean;
  message: string;
  data: ApiFaq | null;
}
