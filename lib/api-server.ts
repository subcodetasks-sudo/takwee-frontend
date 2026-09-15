import { cookies } from "next/headers";
import { z } from "zod";
import {
  ApiError,
  apiRequest,
  isUnauthorizedStatus,
  type RequestOptions,
} from "./api-client";
import {
  SESSION_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  USER_COOKIE_NAME,
} from "@/features/auth/utils/session-cookie";

export { ApiError } from "./api-client";

/**
 * Standard server action response structure
 */
export type ActionState<TData = unknown, TErrors = Record<string, string[]>> = {
  success: boolean;
  data?: TData;
  message?: string;
  fieldErrors?: TErrors;
  statusCode?: number;
};

export interface ServerActionOptions<TInput, TOutput> {
  /**
   * Optional Zod schema to validate inputs before executing the handler
   */
  schema?: z.ZodType<TInput>;
  /**
   * Main server action logic to execute
   */
  handler: (validatedInput: TInput) => Promise<TOutput>;
  /**
   * Optional custom success message
   */
  successMessage?: string | ((data: TOutput) => string);
  /**
   * Re-throw Next.js redirect/notFound control errors if triggered inside handler
   */
  rethrowNextErrors?: boolean;
}

export interface ServerFetchOptions<T = unknown> extends RequestOptions {
  /**
   * Optional Zod schema to validate and transform API response data
   */
  schema?: z.ZodType<T>;
  /**
   * Next.js caching configuration
   */
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  /**
   * Next.js cache mode
   */
  cache?: RequestCache;
  /**
   * Automatically attach session auth token from cookies (defaults to true)
   */
  autoAuth?: boolean;
}

/**
 * Checks whether an error is an internal Next.js control flow error (e.g. redirect(), notFound())
 */
export function isNextInternalError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const digest = (error as { digest?: unknown }).digest;
  return (
    typeof digest === "string" &&
    (digest.startsWith("NEXT_REDIRECT") || digest.startsWith("NEXT_NOT_FOUND"))
  );
}

/**
 * Deletes all session cookies on the server.
 * Safe to call in Server Actions and Route Handlers.
 * In read-only Server Component render phases, cookie mutation is suppressed.
 */
export async function clearServerSessionCookies(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    cookieStore.delete(REFRESH_COOKIE_NAME);
    cookieStore.delete(USER_COOKIE_NAME);
    cookieStore.delete("token");
  } catch {
    // In Server Component (RSC) rendering context, cookies cannot be mutated
  }
}

/**
 * Helper to define type-safe Server Actions with automatic:
 * 1. Zod input validation (FormData or Plain Objects)
 * 2. Field-level error formatting
 * 3. ApiError catching & HTTP status extraction
 * 4. Consistent result shape: { success, data?, message?, fieldErrors? }
 */
export function createServerAction<TInput = void, TOutput = unknown>(
  options: ServerActionOptions<TInput, TOutput>,
): (input?: unknown) => Promise<ActionState<TOutput>> {
  return async (input?: unknown): Promise<ActionState<TOutput>> => {
    try {
      let parsedInput: TInput;

      // Automatically handle FormData to plain object conversion if schema is provided
      let rawData = input;
      if (typeof FormData !== "undefined" && input instanceof FormData) {
        const entries: Record<string, unknown> = {};
        input.forEach((val, key) => {
          if (entries[key] !== undefined) {
            if (Array.isArray(entries[key])) {
              (entries[key] as unknown[]).push(val);
            } else {
              entries[key] = [entries[key], val];
            }
          } else {
            entries[key] = val;
          }
        });
        rawData = entries;
      }

      if (options.schema) {
        const validation = options.schema.safeParse(rawData);
        if (!validation.success) {
          const fieldErrors = validation.error.flatten()
            .fieldErrors as Record<string, string[]>;
          return {
            success: false,
            message: "Validation failed",
            fieldErrors,
            statusCode: 400,
          };
        }
        parsedInput = validation.data;
      } else {
        parsedInput = rawData as TInput;
      }

      const result = await options.handler(parsedInput);

      const message =
        typeof options.successMessage === "function"
          ? options.successMessage(result)
          : options.successMessage;

      return {
        success: true,
        data: result,
        message,
        statusCode: 200,
      };
    } catch (error: unknown) {
      // Re-throw redirect() or notFound() so Next.js handles navigation correctly
      if (options.rethrowNextErrors !== false && isNextInternalError(error)) {
        throw error;
      }

      if (error instanceof ApiError) {
        if (isUnauthorizedStatus(error.status)) {
          await clearServerSessionCookies();
        }
        return {
          success: false,
          message: error.message,
          statusCode: error.status,
          data: error.data as TOutput,
        };
      }

      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
          statusCode: 500,
        };
      }

      return {
        success: false,
        message: "An unexpected error occurred",
        statusCode: 500,
      };
    }
  };
}

/**
 * Convenient wrapper to safely execute any async operation inside a server action
 * without creating a formal schema.
 */
export async function safeServerAction<T>(
  action: () => Promise<T>,
): Promise<ActionState<T>> {
  try {
    const data = await action();
    return {
      success: true,
      data,
      statusCode: 200,
    };
  } catch (error: unknown) {
    if (isNextInternalError(error)) {
      throw error;
    }

    if (error instanceof ApiError) {
      if (isUnauthorizedStatus(error.status)) {
        await clearServerSessionCookies();
      }
      return {
        success: false,
        message: error.message,
        statusCode: error.status,
        data: error.data as T,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
      statusCode: 500,
    };
  }
}

/**
 * Server-side fetch helper with automatic session token injection,
 * Next.js caching options, and optional Zod response validation.
 */
export async function serverFetch<T = unknown>(
  endpoint: string,
  options: ServerFetchOptions<T> = {},
): Promise<T> {
  const { schema, autoAuth = true, ...requestOptions } = options;

  let token = requestOptions.token;
  if (autoAuth && token === undefined) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    } catch {
      // Outside dynamic request context (e.g. static generation)
    }
  }

  try {
    const result = await apiRequest<T>(endpoint, {
      ...requestOptions,
      token,
    });

    if (schema) {
      const validation = schema.safeParse(result);
      if (!validation.success) {
        const issues = validation.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");

        throw new ApiError(
          500,
          "Response Validation Error",
          validation.error.flatten(),
          `API response validation failed for ${endpoint}: ${issues}`,
        );
      }
      return validation.data;
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof ApiError && isUnauthorizedStatus(error.status)) {
      await clearServerSessionCookies();
    }
    throw error;
  }
}

/**
 * Safe server fetch wrapper that catches ApiError and unexpected errors,
 * returning a standard ActionState<T> result instead of throwing.
 */
export async function safeServerFetch<T = unknown>(
  endpoint: string,
  options: ServerFetchOptions<T> = {},
): Promise<ActionState<T>> {
  return safeServerAction(() => serverFetch<T>(endpoint, options));
}

/**
 * HTTP shortcut methods for server-side API requests
 */
export const apiServer = {
  fetch: serverFetch,
  safe: safeServerFetch,

  get<T = unknown>(
    endpoint: string,
    options?: Omit<ServerFetchOptions<T>, "method" | "body">,
  ): Promise<T> {
    return serverFetch<T>(endpoint, { ...options, method: "GET" });
  },

  post<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: Omit<ServerFetchOptions<T>, "method" | "body">,
  ): Promise<T> {
    return serverFetch<T>(endpoint, { ...options, method: "POST", body });
  },

  put<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: Omit<ServerFetchOptions<T>, "method" | "body">,
  ): Promise<T> {
    return serverFetch<T>(endpoint, { ...options, method: "PUT", body });
  },

  patch<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: Omit<ServerFetchOptions<T>, "method" | "body">,
  ): Promise<T> {
    return serverFetch<T>(endpoint, { ...options, method: "PATCH", body });
  },

  delete<T = unknown>(
    endpoint: string,
    options?: Omit<ServerFetchOptions<T>, "method">,
  ): Promise<T> {
    return serverFetch<T>(endpoint, { ...options, method: "DELETE" });
  },
};
