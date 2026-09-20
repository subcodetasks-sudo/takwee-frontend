/**
 * Coerce API list payloads into an array.
 * Accepts a bare array or a Laravel-style `{ data: T[] }` page object.
 */
export function asArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    const nested = (value as { data?: unknown }).data;
    if (Array.isArray(nested)) return nested as T[];
  }
  return [];
}
