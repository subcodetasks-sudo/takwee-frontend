export interface ProfileUser {
  id: string;
  name: string;
  email: string;
  /** Display initials for avatar fallback. */
  initials: string;
  /** Optional profile photo URL (blob/data URL while mocked). */
  avatarUrl?: string;
  /** ISO date string used for “member since”. */
  memberSince: string;
}

export interface ProfileDetailsFormData {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
