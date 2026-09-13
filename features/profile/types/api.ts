/**
 * Raw Backend API Data Transfer Objects for Profile & Preferences
 */

export interface ApiProfileData {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  image: string | null;
  active: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
  default_address?: Record<string, unknown> | null;
}

export interface ApiUpdateProfileInput {
  name: string;
  mobile?: string;
  locale?: string;
  timezone?: string;
}

export interface ApiUpdatePasswordInput {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface ApiPreferencesNotifications {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface ApiPreferencesUi {
  theme: "system" | "light" | "dark";
  compact_mode: boolean;
}

export interface ApiPreferencesData {
  notifications: ApiPreferencesNotifications;
  ui: ApiPreferencesUi;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}
