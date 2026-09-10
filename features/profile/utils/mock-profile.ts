import type { ProfileUser } from "../types";

export const MOCK_PROFILE_USER: ProfileUser = {
  id: "user-demo-1",
  name: "Loai Wael Hassan",
  email: "loaiwael@example.com",
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
