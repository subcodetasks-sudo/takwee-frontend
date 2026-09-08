import type { ProfileUser } from "../types";
import { MOCK_AUTH_USER } from "@/features/auth/utils/mock-auth";

export const MOCK_PROFILE_USER: ProfileUser = {
  id: MOCK_AUTH_USER.id,
  name: MOCK_AUTH_USER.name,
  email: MOCK_AUTH_USER.email,
  avatarUrl: MOCK_AUTH_USER.avatarUrl,
  initials: "LH",
  memberSince: "2024-03-12",
};

export function getMockProfileUser(): ProfileUser {
  return { ...MOCK_PROFILE_USER };
}

/** Derive up to two uppercase initials from a display name. */
export function getInitialsFromName(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
