"use server";

import { safeServerAction, serverFetch, type ActionState } from "@/lib/api-server";
import type {
  ApiForgotPasswordData,
  ApiForgotPasswordLinkData,
  ApiLoginData,
  ApiRegisterData,
  ApiResponse,
  ApiResendVerificationData,
  ApiSendOtpData,
  ApiVerifyResetCodeData,
} from "../types/api";
import type { AuthUser } from "../types";
import { clearSessionCookies, getSession, saveSessionCookies } from "./session";

/** Helper to format Laravel validation errors if present. */
function extractFieldErrors(data: unknown): Record<string, string[]> | undefined {
  if (typeof data !== "object" || data === null) return undefined;
  const d = data as { errors?: Record<string, string[]>; data?: Record<string, string[]> };
  return d.errors || (d.data && typeof d.data === "object" && !Array.isArray(d.data) ? d.data : undefined);
}

// ---------------------------------------------------------------------------
// 1. Login Action (POST /api/v1/auth/login)
// ---------------------------------------------------------------------------

export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
  /** Firebase Cloud Messaging web device token */
  fcm_token?: string | null;
}

export async function loginAction(
  input: LoginInput,
): Promise<ActionState<{ user: AuthUser; accessToken: string }>> {
  return safeServerAction(async () => {
    const body: Record<string, string> = {
      email: input.email.trim(),
      password: input.password,
    };
    if (input.fcm_token?.trim()) {
      body.fcm_token = input.fcm_token.trim();
    }

    const res = await serverFetch<ApiResponse<ApiLoginData>>("/api/v1/auth/login", {
      method: "POST",
      body,
      autoAuth: false,
    });

    if (!res?.success || !res.data?.accessToken) {
      throw new Error(res?.message || "Login failed");
    }

    const { user: apiUser, accessToken, accessExpiresIn, refreshToken, refreshExpiresIn } = res.data;

    const user: AuthUser = {
      id: String(apiUser.id),
      name: apiUser.name,
      email: apiUser.email,
      mobile: apiUser.mobile,
      avatarUrl: apiUser.image || undefined,
      active: apiUser.active,
      roles: apiUser.roles,
    };

    await saveSessionCookies({
      accessToken,
      refreshToken,
      user,
      accessExpiresIn,
      refreshExpiresIn,
      rememberMe: input.rememberMe,
    });

    return { user, accessToken };
  }).then((state) => {
    if (!state.success && state.data) {
      state.fieldErrors = extractFieldErrors(state.data);
    }
    return state;
  });
}

// ---------------------------------------------------------------------------
// 2. Register Action (POST /api/v1/auth/register)
// ---------------------------------------------------------------------------

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  mobile?: string;
}

export async function registerAction(
  input: RegisterInput,
): Promise<ActionState<ApiRegisterData>> {
  return safeServerAction(async () => {
    const res = await serverFetch<ApiResponse<ApiRegisterData>>("/api/v1/auth/register", {
      method: "POST",
      body: {
        name: input.name.trim(),
        email: input.email.trim(),
        mobile: input.mobile?.trim() || undefined,
        password: input.password,
        password_confirmation: input.confirmPassword || input.password,
      },
      autoAuth: false,
    });

    if (!res?.success || !res.data) {
      throw new Error(res?.message || "Registration failed");
    }

    return res.data;
  }).then((state) => {
    if (!state.success && state.data) {
      state.fieldErrors = extractFieldErrors(state.data);
    }
    return state;
  });
}

// ---------------------------------------------------------------------------
// 3. Verify Email Action (POST /api/v1/auth/verify)
// ---------------------------------------------------------------------------

export interface VerifyEmailInput {
  email: string;
  code: string;
}

export async function verifyEmailAction(
  input: VerifyEmailInput,
): Promise<ActionState<boolean>> {
  return safeServerAction(async () => {
    const res = await serverFetch<ApiResponse<boolean>>("/api/v1/auth/verify", {
      method: "POST",
      body: {
        email: input.email.trim(),
        code: input.code.trim(),
      },
      autoAuth: false,
    });

    if (!res?.success) {
      throw new Error(res?.message || "Verification failed");
    }

    return true;
  }).then((state) => {
    if (!state.success && state.data) {
      state.fieldErrors = extractFieldErrors(state.data);
    }
    return state;
  });
}

// ---------------------------------------------------------------------------
// 4. Resend Verification Code Action (POST /api/v1/auth/resend-verification)
// ---------------------------------------------------------------------------

export interface ResendVerificationInput {
  email: string;
}

export async function resendVerificationAction(
  input: ResendVerificationInput,
): Promise<ActionState<ApiResendVerificationData>> {
  return safeServerAction(async () => {
    const res = await serverFetch<ApiResponse<ApiResendVerificationData>>(
      "/api/v1/auth/resend-verification",
      {
        method: "POST",
        body: { email: input.email.trim() },
        autoAuth: false,
      },
    );

    if (!res?.success || !res.data) {
      throw new Error(res?.message || "Failed to resend verification code");
    }

    return res.data;
  }).then((state) => {
    if (!state.success && state.data) {
      state.fieldErrors = extractFieldErrors(state.data);
    }
    return state;
  });
}

// ---------------------------------------------------------------------------
// 5. Send OTP Action (POST /api/v1/auth/otp/send)
// ---------------------------------------------------------------------------

export interface SendOtpInput {
  mobile: string;
}

export async function sendOtpAction(
  input: SendOtpInput,
): Promise<ActionState<ApiSendOtpData>> {
  return safeServerAction(async () => {
    const res = await serverFetch<ApiResponse<ApiSendOtpData>>("/api/v1/auth/otp/send", {
      method: "POST",
      body: { mobile: input.mobile.trim() },
      autoAuth: false,
    });

    if (!res?.success || !res.data) {
      throw new Error(res?.message || "Failed to send OTP");
    }

    return res.data;
  }).then((state) => {
    if (!state.success && state.data) {
      state.fieldErrors = extractFieldErrors(state.data);
    }
    return state;
  });
}

// ---------------------------------------------------------------------------
// 6. Verify OTP Action (POST /api/v1/auth/otp/verify)
// ---------------------------------------------------------------------------

export interface VerifyOtpInput {
  mobile: string;
  code: string;
}

export async function verifyOtpAction(
  input: VerifyOtpInput,
): Promise<ActionState<{ user: AuthUser; accessToken: string }>> {
  return safeServerAction(async () => {
    const res = await serverFetch<ApiResponse<ApiLoginData>>("/api/v1/auth/otp/verify", {
      method: "POST",
      body: {
        mobile: input.mobile.trim(),
        code: input.code.trim(),
      },
      autoAuth: false,
    });

    if (!res?.success || !res.data?.accessToken) {
      throw new Error(res?.message || "OTP verification failed");
    }

    const { user: apiUser, accessToken, accessExpiresIn, refreshToken, refreshExpiresIn } = res.data;

    const user: AuthUser = {
      id: String(apiUser.id),
      name: apiUser.name,
      email: apiUser.email,
      mobile: apiUser.mobile,
      avatarUrl: apiUser.image || undefined,
      active: apiUser.active,
      roles: apiUser.roles,
    };

    await saveSessionCookies({
      accessToken,
      refreshToken,
      user,
      accessExpiresIn,
      refreshExpiresIn,
    });

    return { user, accessToken };
  }).then((state) => {
    if (!state.success && state.data) {
      state.fieldErrors = extractFieldErrors(state.data);
    }
    return state;
  });
}

// ---------------------------------------------------------------------------
// 7. Forgot Password Action (POST /api/v1/auth/forgot-password & forgot-password-link)
// ---------------------------------------------------------------------------

export interface ForgotPasswordInput {
  email: string;
  useLink?: boolean;
}

export async function forgotPasswordAction(
  input: ForgotPasswordInput,
): Promise<ActionState<ApiForgotPasswordData | ApiForgotPasswordLinkData>> {
  return safeServerAction(async () => {
    const endpoint = input.useLink
      ? "/api/v1/auth/forgot-password-link"
      : "/api/v1/auth/forgot-password";

    const res = await serverFetch<ApiResponse<ApiForgotPasswordData | ApiForgotPasswordLinkData>>(
      endpoint,
      {
        method: "POST",
        body: { email: input.email.trim() },
        autoAuth: false,
      },
    );

    if (!res?.success) {
      throw new Error(res?.message || "Failed to process forgot password request");
    }

    return res.data;
  }).then((state) => {
    if (!state.success && state.data) {
      state.fieldErrors = extractFieldErrors(state.data);
    }
    return state;
  });
}

// ---------------------------------------------------------------------------
// 8. Verify Reset Code Action (POST /api/v1/auth/verify-reset-code)
// ---------------------------------------------------------------------------

export interface VerifyResetCodeInput {
  email: string;
  code: string;
}

export async function verifyResetCodeAction(
  input: VerifyResetCodeInput,
): Promise<ActionState<ApiVerifyResetCodeData>> {
  return safeServerAction(async () => {
    const res = await serverFetch<ApiResponse<ApiVerifyResetCodeData>>(
      "/api/v1/auth/verify-reset-code",
      {
        method: "POST",
        body: {
          email: input.email.trim(),
          code: input.code.trim(),
        },
        autoAuth: false,
      },
    );

    if (!res?.success || !res.data) {
      throw new Error(res?.message || "Invalid reset code");
    }

    return res.data;
  }).then((state) => {
    if (!state.success && state.data) {
      state.fieldErrors = extractFieldErrors(state.data);
    }
    return state;
  });
}

// ---------------------------------------------------------------------------
// 9. Reset Password Action (POST /api/v1/auth/reset-password)
// ---------------------------------------------------------------------------

export interface ResetPasswordInput {
  token: string;
  password: string;
  confirmPassword?: string;
}

export async function resetPasswordAction(
  input: ResetPasswordInput,
): Promise<ActionState<null>> {
  return safeServerAction(async () => {
    const res = await serverFetch<ApiResponse<null>>("/api/v1/auth/reset-password", {
      method: "POST",
      body: {
        token: input.token,
        password: input.password,
        password_confirmation: input.confirmPassword || input.password,
      },
      autoAuth: false,
    });

    if (!res?.success) {
      throw new Error(res?.message || "Password reset failed");
    }

    return null;
  }).then((state) => {
    if (!state.success && state.data) {
      state.fieldErrors = extractFieldErrors(state.data);
    }
    return state;
  });
}

// ---------------------------------------------------------------------------
// 10. Logout Action (POST /api/v1/auth/logout)
// ---------------------------------------------------------------------------

export async function logoutAction(): Promise<ActionState<null>> {
  return safeServerAction(async () => {
    try {
      await serverFetch<ApiResponse<null>>("/api/v1/auth/logout", {
        method: "POST",
        autoAuth: true,
      });
    } catch {
      // Proceed with clearing local cookies even if the remote token is already expired
    } finally {
      await clearSessionCookies();
    }
    return null;
  });
}

// ---------------------------------------------------------------------------
// 11. Get Current Auth State Action
// ---------------------------------------------------------------------------

export async function getAuthSessionAction() {
  return getSession();
}
