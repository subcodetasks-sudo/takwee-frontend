import { ApiError, getApiBaseUrl, http } from "@/lib/api-client";
import type { Address, AddressFormData } from "../types";
import type {
  ApiAddress,
  ApiPaginatedAddresses,
  ApiResponse,
} from "../types/api";
import { mapAddress, mapAddressFormToApi, mapAddresses } from "../utils/map-address";

const ADDRESSES_PATH = "/api/v1/addresses";
const LIST_PER_PAGE = 100;

function requireApiAndToken(token: string) {
  if (!getApiBaseUrl()) {
    throw new Error("API_BASE_URL / NEXT_PUBLIC_API_BASE_URL is not configured");
  }
  if (!token) {
    throw new Error("Authentication required");
  }
}

function localeHeaders(locale?: string): Record<string, string> {
  return locale ? { "Accept-Language": locale } : {};
}

function extractFieldErrors(data: unknown): Record<string, string[]> | undefined {
  if (typeof data !== "object" || data === null) return undefined;
  const d = data as {
    errors?: Record<string, string[]>;
    data?: Record<string, string[]>;
  };
  return (
    d.errors ||
    (d.data && typeof d.data === "object" && !Array.isArray(d.data)
      ? d.data
      : undefined)
  );
}

function throwWithFieldErrors(error: unknown, fallback: string): never {
  if (error instanceof ApiError) {
    const fieldErrors = extractFieldErrors(error.data);
    const message =
      (error.data &&
      typeof error.data === "object" &&
      "message" in error.data &&
      typeof (error.data as { message?: unknown }).message === "string"
        ? (error.data as { message: string }).message
        : undefined) ||
      error.message ||
      fallback;
    const enriched = new Error(message) as Error & {
      fieldErrors?: Record<string, string[]>;
    };
    if (fieldErrors) enriched.fieldErrors = fieldErrors;
    throw enriched;
  }
  throw error instanceof Error ? error : new Error(fallback);
}

function unwrapAddressPage(
  res: ApiResponse<ApiPaginatedAddresses | ApiAddress[]>,
): { items: ApiAddress[]; lastPage: number } {
  if (Array.isArray(res.data)) {
    return { items: res.data, lastPage: 1 };
  }

  const page = res.data;
  const items = Array.isArray(page?.data) ? page.data : [];
  const lastPage = page?.meta?.last_page ?? 1;
  return { items, lastPage };
}

async function fetchAddressPage(
  token: string,
  page: number,
  locale?: string,
): Promise<ApiResponse<ApiPaginatedAddresses | ApiAddress[]>> {
  return http.get<ApiResponse<ApiPaginatedAddresses | ApiAddress[]>>(
    ADDRESSES_PATH,
    {
      token,
      params: {
        per_page: LIST_PER_PAGE,
        sort: "-id",
        page,
      },
      headers: localeHeaders(locale),
    },
  );
}

/**
 * Client-side address book fetch (GET /api/v1/addresses).
 * Walks paginated results. Throws on failure — use as React Query queryFn.
 */
export async function fetchAddresses(
  token: string,
  locale?: string,
): Promise<Address[]> {
  requireApiAndToken(token);

  const first = await fetchAddressPage(token, 1, locale);

  if (!first?.success || first.data == null) {
    throw new ApiError(
      500,
      "Invalid Payload",
      first,
      first?.message || "Failed to load addresses",
    );
  }

  const { items, lastPage } = unwrapAddressPage(first);
  const collected = [...items];

  for (let page = 2; page <= lastPage; page += 1) {
    const next = await fetchAddressPage(token, page, locale);
    if (next?.success && next.data != null) {
      collected.push(...unwrapAddressPage(next).items);
    }
  }

  return mapAddresses(collected);
}

export async function createAddress(
  token: string,
  formData: AddressFormData,
  locale?: string,
): Promise<Address> {
  requireApiAndToken(token);

  try {
    const res = await http.post<ApiResponse<ApiAddress>>(
      ADDRESSES_PATH,
      mapAddressFormToApi(formData),
      {
        token,
        headers: localeHeaders(locale),
      },
    );

    if (!res?.success || !res.data) {
      throw new ApiError(
        500,
        "Invalid Payload",
        res,
        res?.message || "Failed to create address",
      );
    }

    return mapAddress(res.data);
  } catch (error) {
    throwWithFieldErrors(error, "Failed to create address");
  }
}

export async function updateAddress(
  token: string,
  id: string,
  formData: AddressFormData,
  locale?: string,
): Promise<Address> {
  requireApiAndToken(token);

  try {
    const res = await http.put<ApiResponse<ApiAddress>>(
      `${ADDRESSES_PATH}/${id}`,
      mapAddressFormToApi(formData),
      {
        token,
        headers: localeHeaders(locale),
      },
    );

    if (!res?.success || !res.data) {
      throw new ApiError(
        500,
        "Invalid Payload",
        res,
        res?.message || "Failed to update address",
      );
    }

    return mapAddress(res.data);
  } catch (error) {
    throwWithFieldErrors(error, "Failed to update address");
  }
}

export async function setDefaultAddress(
  token: string,
  id: string,
  locale?: string,
): Promise<Address> {
  requireApiAndToken(token);

  const res = await http.post<ApiResponse<ApiAddress>>(
    `${ADDRESSES_PATH}/${id}/default`,
    undefined,
    {
      token,
      headers: localeHeaders(locale),
    },
  );

  if (!res?.success || !res.data) {
    throw new ApiError(
      500,
      "Invalid Payload",
      res,
      res?.message || "Failed to set default address",
    );
  }

  return mapAddress(res.data);
}

export async function deleteAddress(
  token: string,
  id: string,
  locale?: string,
): Promise<void> {
  requireApiAndToken(token);

  const res = await http.delete<ApiResponse<null>>(`${ADDRESSES_PATH}/${id}`, {
    token,
    headers: localeHeaders(locale),
  });

  if (res && res.success === false) {
    throw new ApiError(
      500,
      "Invalid Payload",
      res,
      res.message || "Failed to delete address",
    );
  }
}
