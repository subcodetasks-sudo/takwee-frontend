/** Authenticated account identity (shared across profile, checkout, etc.). */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  /** Optional profile photo URL. */
  avatarUrl?: string;
}

/** Server-issued session bound to a cookie token. */
export interface AuthSession {
  token: string;
  userId: string;
  /** ISO date string. */
  expiresAt: string;
}

export interface AuthSnapshot {
  user: AuthUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
}

/** Registration payload submitted by the sign-up form. */
export type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

/** Login credentials submitted by the sign-in form. */
export type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

/** Verification OTP payload submitted by the verify form. */
export type VerifyOtpFormData = {
  email: string;
  code: string;
};

