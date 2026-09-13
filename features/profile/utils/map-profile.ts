import { resolveImageUrl } from "@/lib/images";
import type { ApiProfileData, ProfileUser } from "../types";

/** Derive up to two uppercase initials from a display name. */
export function getInitialsFromName(name?: string | null): string {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function mapProfileUser(data: ApiProfileData): ProfileUser {
  const avatarUrl = data.image ? resolveImageUrl(data.image) || undefined : undefined;

  return {
    id: String(data.id),
    name: data.name || "",
    email: data.email || "",
    mobile: data.mobile || undefined,
    initials: getInitialsFromName(data.name),
    avatarUrl,
    memberSince: data.createdAt || new Date().toISOString(),
    active: data.active ?? true,
    roles: Array.isArray(data.roles) ? data.roles : [],
  };
}
