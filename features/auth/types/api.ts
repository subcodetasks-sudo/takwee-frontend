/** Raw shapes returned by the backend authentication endpoints (`/api/v1/auth/*`). */

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  image: string | null;
  active: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
  default_address?: unknown;
}

export interface ApiLoginData {
  user: ApiUser;
  accessToken: string;
  tokenType: string;
  accessExpiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
}

export interface ApiRegisterData {
  user: ApiUser;
  verificationCode?: string;
}

export interface ApiSendOtpData {
  mobile: string;
  verificationCode: string;
}

export interface ApiResendVerificationData {
  verificationCode: string;
}

export interface ApiForgotPasswordData {
  reset_code?: string;
}

export interface ApiForgotPasswordLinkData {
  reset_link: string;
  expires_at: string;
}

export interface ApiVerifyResetCodeData {
  token: string;
}

export interface ApiVerifyResetLinkData {
  email: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiValidationErrorPayload {
  message?: string;
  errors?: Record<string, string[]>;
  data?: Record<string, string[]>;
}
