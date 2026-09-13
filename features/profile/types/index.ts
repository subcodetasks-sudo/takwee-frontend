export * from "./api";

export interface ProfileUser {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  /** Display initials for avatar fallback. */
  initials: string;
  /** Profile photo URL resolved from API image. */
  avatarUrl?: string;
  /** ISO date string used for "member since". */
  memberSince: string;
  active: boolean;
  roles: string[];
}

export interface ProfileDetailsFormData {
  name: string;
  email: string;
  mobile?: string;
  avatarUrl?: string;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfilePreferencesData {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  ui: {
    theme: "system" | "light" | "dark";
    compactMode: boolean;
  };
}

export type UserPreferences = ProfilePreferencesData;
