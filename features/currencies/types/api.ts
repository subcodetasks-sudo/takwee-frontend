/** Raw shapes returned by `GET /api/v1/currencies`. */
export interface ApiCurrencyItem {
  id: number;
  name: string;
  code: string;
  symbol: string;
  exchange_rate: number | string;
  is_default: boolean;
}

export interface ApiCurrenciesResponse {
  success: boolean;
  message: string;
  data: ApiCurrencyItem[];
}
