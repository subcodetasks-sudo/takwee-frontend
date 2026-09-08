import type { OrderShippingAddress, OrderSummary } from "../types";

const ISTANBUL_HOME: OrderShippingAddress = {
  fullName: "Layla Al-Hassan",
  line1: "Nişantaşı, Teşvikiye Cad. No: 42",
  line2: "Apt 5",
  city: "Istanbul",
  region: "Şişli",
  postalCode: "34365",
  country: "Türkiye",
  phone: "+90 532 000 00 00",
};

const RIYADH_HOME: OrderShippingAddress = {
  fullName: "Layla Al-Hassan",
  line1: "Olaya Street, Building 18",
  city: "Riyadh",
  region: "Riyadh Province",
  postalCode: "12211",
  country: "Saudi Arabia",
  phone: "+966 50 000 0000",
};

export const MOCK_ORDERS: OrderSummary[] = [
  {
    id: "ord-2",
    number: "LL-2031",
    placedAt: "2026-09-04",
    status: "shipped",
    totalTRY: 3290,
    shippingTRY: 0,
    itemCount: 1,
    items: [
      {
        name: "Olive Heritage Abaya",
        slug: "olive-heritage-embroidered-abaya",
        quantity: 1,
        size: "54",
        color: "Olive Green",
        priceTRY: 3290,
        image: "/imgs/hero-slide-3.jpg",
      },
    ],
    shippingAddress: ISTANBUL_HOME,
    payment: { method: "card", brand: "Visa", last4: "4242" },
    tracking: {
      carrier: "Aramex Express",
      trackingNumber: "ARM-99482103",
      estimatedDelivery: "2026-09-10",
      currentStep: 3,
      trackingUrl: "#",
      steps: [
        { key: "placed", date: "2026-09-04", completed: true, current: false },
        { key: "tailoring", date: "2026-09-06", completed: true, current: false },
        { key: "shipped", date: "2026-09-07", completed: false, current: true },
        { key: "delivered", date: "2026-09-10", completed: false, current: false },
      ],
    },
  },
  {
    id: "ord-3",
    number: "LL-2019",
    placedAt: "2026-09-06",
    status: "processing",
    totalTRY: 2150,
    shippingTRY: 0,
    itemCount: 1,
    items: [
      {
        name: "Travel Wrap Abaya",
        slug: "travel-kimono-abaya",
        quantity: 1,
        size: "58",
        color: "Midnight Black",
        priceTRY: 2150,
        image: "/imgs/hero-slide-1.jpg",
      },
    ],
    shippingAddress: RIYADH_HOME,
    payment: { method: "cashOnDelivery" },
    tracking: {
      carrier: "DHL Express",
      trackingNumber: "DHL-481920",
      estimatedDelivery: "2026-09-14",
      currentStep: 2,
      trackingUrl: "#",
      steps: [
        { key: "placed", date: "2026-09-06", completed: true, current: false },
        { key: "tailoring", date: "2026-09-07", completed: false, current: true },
        { key: "shipped", completed: false, current: false },
        { key: "delivered", completed: false, current: false },
      ],
    },
  },
  {
    id: "ord-1",
    number: "LL-2048",
    placedAt: "2026-08-28",
    deliveredAt: "2026-09-02",
    status: "delivered",
    totalTRY: 4890,
    shippingTRY: 0,
    itemCount: 2,
    items: [
      {
        name: "Linen A-Line Abaya",
        slug: "classic-linen-aline-abaya",
        quantity: 1,
        size: "56",
        color: "Natural Sand",
        priceTRY: 3890,
        image: "/imgs/hero-slide-1.jpg",
      },
      {
        name: "Soft Sheila — Sand",
        slug: "classic-linen-aline-abaya",
        quantity: 1,
        size: "Standard",
        color: "Sand",
        priceTRY: 1000,
        image: "/imgs/hero-slide-2.jpg",
      },
    ],
    shippingAddress: ISTANBUL_HOME,
    payment: { method: "card", brand: "Mastercard", last4: "8899" },
    tracking: {
      carrier: "Aramex Express",
      trackingNumber: "ARM-88204910",
      currentStep: 4,
      steps: [
        { key: "placed", date: "2026-08-28", completed: true, current: false },
        { key: "tailoring", date: "2026-08-29", completed: true, current: false },
        { key: "shipped", date: "2026-08-31", completed: true, current: false },
        { key: "delivered", date: "2026-09-02", completed: true, current: false },
      ],
    },
  },
  {
    id: "ord-4",
    number: "LL-1980",
    placedAt: "2026-08-10",
    cancelledAt: "2026-08-11",
    cancelReasonKey: "customerRequested",
    status: "cancelled",
    totalTRY: 3450,
    shippingTRY: 0,
    itemCount: 1,
    items: [
      {
        name: "Silk Linen Blend Kimono Abaya",
        slug: "midnight-silk-linen-abaya",
        quantity: 1,
        size: "56",
        color: "Desert Dune",
        priceTRY: 3450,
        image: "/imgs/hero-slide-2.jpg",
      },
    ],
    shippingAddress: RIYADH_HOME,
    payment: { method: "bankTransfer" },
  },
];

export function getMockOrders(): OrderSummary[] {
  return MOCK_ORDERS;
}

export function getMockOrderById(orderId: string): OrderSummary | undefined {
  return MOCK_ORDERS.find((order) => order.id === orderId);
}

export function getAllMockOrderIds(): string[] {
  return MOCK_ORDERS.map((order) => order.id);
}
