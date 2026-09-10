/** Raw shapes returned by `GET /api/v1/settings`. */

export type ApiSettingType = "string" | "boolean" | "json" | "number";

export interface ApiSettingItem {
  key: string;
  value: string | boolean | number | string[] | null;
  type: ApiSettingType;
  isPublic: boolean;
}

export interface ApiSettingsResponse {
  success: boolean;
  message: string;
  data: ApiSettingItem[];
}
