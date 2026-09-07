import type { OrderSummary, ProfileUser } from "../types";

export const MOCK_PROFILE_USER: ProfileUser = {
  id: "user-demo-1",
  name: "Layla Al-Hassan",
  email: "layla@example.com",
  initials: "LH",
  memberSince: "2024-03-12",
};

export const MOCK_ORDERS: OrderSummary[] = [
  {
    id: "ord-1",
    number: "LL-2048",
    placedAt: "2026-08-28",
    status: "delivered",
    totalTRY: 4890,
    itemCount: 2,
    items: [
      { name: "Linen A-Line Abaya", quantity: 1 },
      { name: "Soft Sheila — Sand", quantity: 1 },
    ],
  },
  {
    id: "ord-2",
    number: "LL-2031",
    placedAt: "2026-08-14",
    status: "shipped",
    totalTRY: 3290,
    itemCount: 1,
    items: [{ name: "Olive Heritage Abaya", quantity: 1 }],
  },
  {
    id: "ord-3",
    number: "LL-2019",
    placedAt: "2026-07-02",
    status: "processing",
    totalTRY: 2150,
    itemCount: 1,
    items: [{ name: "Travel Wrap Abaya", quantity: 1 }],
  },
];

export function getMockProfileUser(): ProfileUser {
  return MOCK_PROFILE_USER;
}

export function getMockOrders(): OrderSummary[] {
  return MOCK_ORDERS;
}
