/**
 * Raw backend DTOs for addresses, countries, and cities.
 */

export interface ApiAddressCountry {
  id: number;
  name: string;
  code: string;
  delivery_price: number;
}

export interface ApiAddressCity {
  id: number;
  name: string;
  delivery_price: number;
  country?: ApiAddressCountry;
}

export interface ApiAddress {
  id: number | string;
  label: string;
  recipient_name: string;
  phone_code: string;
  phone: string;
  full_phone?: string | null;
  country_id: number;
  city_id: number;
  region?: string | null;
  district?: string | null;
  street: string;
  apartment?: string | null;
  postal_code?: string | null;
  delivery_instructions?: string | null;
  is_default: boolean;
  delivery_price?: number | null;
  country?: ApiAddressCountry | null;
  city?: ApiAddressCity | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApiAddressInput {
  label: string;
  recipient_name: string;
  phone_code: string;
  phone: string;
  country_id: number;
  city_id: number;
  region?: string;
  district?: string;
  street: string;
  apartment?: string;
  postal_code?: string;
  delivery_instructions?: string;
  is_default?: boolean;
}

export interface ApiPaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface ApiPaginatedAddresses {
  data: ApiAddress[];
  meta?: ApiPaginationMeta;
  links?: {
    next?: string | null;
  };
}

export interface ApiCountry {
  id: number;
  name: string;
  code: string;
  delivery_price?: number | null;
  cities?: ApiAddressCity[] | null;
}

export interface ApiCity {
  id: number;
  name: string;
  delivery_price?: number | null;
  country?: ApiAddressCountry | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}
