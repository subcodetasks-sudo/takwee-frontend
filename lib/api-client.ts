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
