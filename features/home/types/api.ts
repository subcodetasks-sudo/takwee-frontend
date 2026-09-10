/** Raw shapes returned by `GET /api/v1/home`. */

export interface ApiAdvertisementTape {
  id: number;
  text: string;
}

export interface ApiHomeHero {
  id: number;
  title: string;
  description: string;
  image: string;
  advertisement_tapes: ApiAdvertisementTape[];
  sort_order: number;
}

export interface ApiHomeCategory {
  id: number;
  name: string;
  image: string | null;
  sort_order: number;
  status: string;
  is_hero: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiHomeProductCategory {
  id: number;
  name: string;
}

export interface ApiHomeProduct {
  id: number;
  name: string;
  category: ApiHomeProductCategory;
  price: string;
  original_price: string | null;
  discount: string | null;
  status: string;
  model_number: string | null;
  weight: string | null;
  description: string | null;
  main_image: string | null;
  images: string[];
  colors: unknown[];
  sizes: unknown[];
  features: unknown[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiHomePageData {
  heroes: ApiHomeHero[];
  advertisement_tapes: ApiAdvertisementTape[];
  categories: ApiHomeCategory[];
  products: ApiHomeProduct[];
}

export interface ApiHomePageResponse {
  success: boolean;
  message: string;
  data: ApiHomePageData;
}
