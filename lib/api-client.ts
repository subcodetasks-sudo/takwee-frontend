/**
 * API client configuration and environment variables
 */
const DEFAULT_TIMEOUT = Number(process.env.API_TIMEOUT_MS) || 15_000;

export function getApiBaseUrl(): string {
  // If running in browser, NEXT_PUBLIC_API_BASE_URL takes precedence
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "";
  }
  // Server-side environment can use private API_BASE_URL or fallback to NEXT_PUBLIC_API_BASE_URL
  return process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";
}

/**
 * Standard API error class encapsulating status codes and server error details
 */
export class ApiError<T = unknown> extends Error {
  public status: number;
  public statusText: string;
  public data?: T;

  constructor(status: number, statusText: string, data?: T, message?: string) {
    super(message || `Request failed with status ${status}: ${statusText}`);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

/**
 * Checks whether an HTTP status code corresponds to an unauthorized / unauthenticated error.
 * Includes standard 401 Unauthorized as well as 402 (custom backend payment / unauthenticated code).
 */
export function isUnauthorizedStatus(status: number): boolean {
  return status === 401 || status === 402;
}

export type QueryParams = Record<
  string,
  string | number | boolean | undefined | null | (string | number | boolean)[]
>;

export interface RequestOptions extends Omit<RequestInit, "body"> {
  /**
   * Base URL override (defaults to configured API base URL)
   */
  baseUrl?: string;
  /**
   * Query parameters to append to the URL
   */
  params?: QueryParams;
  /**
   * Request body (can be an object, FormData, Blob, string, etc.)
   */
  body?: unknown;
  /**
   * Request timeout in milliseconds (default: 15000ms)
   */
  timeout?: number;
  /**
   * Authentication bearer token or custom token resolver
   */
  token?: string | null;
  /**
   * Automatically logout the user and clear session cookies if a 401/402 response is received.
   * Defaults to true.
   */
  handleUnauthorized?: boolean;
}

let isHandlingUnauthorized = false;

/**
 * Endpoints that should NOT trigger automatic logout when returning 401/402
 * (e.g. login/register/reset where 401/402 represents invalid credentials).
 */
const BYPASS_UNAUTHORIZED_PATTERNS = [
  "/auth/login",
  "/auth/register",
  "/auth/otp",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify",
  "/api/auth/clear-session",
];

function shouldHandleUnauthorized(
  endpoint: string,
  options: RequestOptions,
): boolean {
  if (options.handleUnauthorized === false) return false;
  return !BYPASS_UNAUTHORIZED_PATTERNS.some((pattern) =>
    endpoint.includes(pattern),
  );
}

/**
 * Executes client-side unauthorized handling:
 * 1. Clears accessible client cookies.
 * 2. Calls the server route to delete HttpOnly cookies.
 * 3. Dispatches "auth:unauthorized" window event for React Query / UI sync.
 * 4. Redirects to login if current page is protected (/me, /checkout).
 */
export async function handleClientUnauthorized(
  endpoint?: string,
): Promise<void> {
  if (typeof window === "undefined") return;

  if (isHandlingUnauthorized) return;
  isHandlingUnauthorized = true;

  try {
    // 1. Delete client-accessible cookies
    const cookieNames = ["ll_session", "ll_refresh_token", "ll_user", "token"];
    for (const name of cookieNames) {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0`;
      if (window.location.hostname) {
        document.cookie = `${name}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0`;
      }
    }

    // 2. Call internal route to delete secure HttpOnly cookies
    await fetch("/api/auth/clear-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => null);

    // 3. Dispatch window event for React Query / listeners
    window.dispatchEvent(
      new CustomEvent("auth:unauthorized", {
        detail: { endpoint, timestamp: Date.now() },
      }),
    );

    // 4. Redirect if user is on a protected route
    const pathname = window.location.pathname;
    const isProtected =
      pathname.includes("/me") || pathname.includes("/checkout");

    if (isProtected) {
      const segments = pathname.split("/").filter(Boolean);
      const firstSegment = segments[0];
      const hasLocale = ["ar", "en", "tr"].includes(firstSegment);
      const loginBase = hasLocale ? `/${firstSegment}/login` : "/login";
      const redirectTarget = encodeURIComponent(
        pathname + window.location.search,
      );
      window.location.href = `${loginBase}?redirect=${redirectTarget}`;
    }
  } catch (err) {
    console.error("[api-client] Failed to handle unauthorized error:", err);
  } finally {
    // Reset debounce lock after 2 seconds
    setTimeout(() => {
      isHandlingUnauthorized = false;
    }, 2000);
  }
}

/**
 * Format query parameters into URLSearchParams string
 */
function buildQueryString(params?: QueryParams): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v !== undefined && v !== null) {
          searchParams.append(key, String(v));
        }
      });
    } else {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

/**
 * Normalizes and resolves the complete URL
 */
function resolveUrl(
  endpoint: string,
  baseUrl?: string,
  params?: QueryParams,
): string {
  const query = buildQueryString(params);

  // If endpoint is already an absolute URL, attach query parameters and return
  if (/^https?:\/\//i.test(endpoint)) {
    return `${endpoint}${query}`;
  }

  const base = (baseUrl !== undefined ? baseUrl : getApiBaseUrl()).replace(
    /\/+$/,
    "",
  );
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  return `${base}${path}${query}`;
}

/**
 * Core request function supporting all HTTP verbs, automatic JSON serialization/parsing,
 * abort signal timeout handling, and typed error responses.
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    baseUrl,
    params,
    body,
    headers: customHeaders = {},
    timeout = DEFAULT_TIMEOUT,
    token,
    signal: userSignal,
    ...fetchOptions
  } = options;

  const url = resolveUrl(endpoint, baseUrl, params);

  const headers = new Headers(customHeaders);

  // Set Authorization header if token is provided
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let finalBody: BodyInit | null | undefined = undefined;

  // Automatically handle body serialization based on type
  if (body !== undefined && body !== null) {
    if (
      body instanceof FormData ||
      body instanceof Blob ||
      body instanceof ArrayBuffer ||
      body instanceof URLSearchParams ||
      typeof body === "string"
    ) {
      finalBody = body as BodyInit;
    } else {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      finalBody = JSON.stringify(body);
    }
  }

  // Set Accept header by default if not specified
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  // Setup timeout abort controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Propagate caller signal if provided
  if (userSignal) {
    if (userSignal.aborted) {
      controller.abort();
    } else {
      userSignal.addEventListener("abort", () => controller.abort(), {
        once: true,
      });
    }
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      body: finalBody,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    // Determine content type
    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    let responseData: unknown;
    if (isJson) {
      responseData = await response.json().catch(() => null);
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        responseData &&
        typeof responseData === "object" &&
        ("message" in responseData || "error" in responseData)
          ? (responseData as { message?: unknown; error?: unknown }).message ||
            (responseData as { message?: unknown; error?: unknown }).error
          : undefined;

      if (
        isUnauthorizedStatus(response.status) &&
        shouldHandleUnauthorized(endpoint, options)
      ) {
        // Trigger client logout flow asynchronously (non-blocking)
        void handleClientUnauthorized(endpoint);
      }

      throw new ApiError(
        response.status,
        response.statusText,
        responseData,
        typeof errorMessage === "string" ? errorMessage : undefined,
      );
    }

    return responseData as T;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError(
        408,
        "Request Timeout",
        undefined,
        `Request timed out after ${timeout}ms`,
      );
    }

    throw error;
  }
}

/**
 * Convenient HTTP method shortcuts
 */
export const http = {
  /**
   * HTTP GET method
   */
  get<T = unknown>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "body">,
  ): Promise<T> {
    return apiRequest<T>(endpoint, { ...options, method: "GET" });
  },

  /**
   * HTTP POST method
   */
  post<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ): Promise<T> {
    return apiRequest<T>(endpoint, { ...options, method: "POST", body });
  },

  /**
   * HTTP PUT method
   */
  put<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ): Promise<T> {
    return apiRequest<T>(endpoint, { ...options, method: "PUT", body });
  },

  /**
   * HTTP PATCH method
   */
  patch<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ): Promise<T> {
    return apiRequest<T>(endpoint, { ...options, method: "PATCH", body });
  },

  /**
   * HTTP DELETE method
   */
  delete<T = unknown>(
    endpoint: string,
    options?: Omit<RequestOptions, "method">,
  ): Promise<T> {
    return apiRequest<T>(endpoint, { ...options, method: "DELETE" });
  },
};
