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
  // 1. Pending
  {
    id: "ord-5",
    number: "LL-2055",
    placedAt: "2026-09-14",
    status: "pending",
    totalTRY: 4200,
    shippingTRY: 0,
    itemCount: 1,
    canCancel: true,
    items: [
      {
        name: "Raw Linen Kimono Abaya",
        slug: "raw-linen-kimono-abaya",
        quantity: 1,
        size: "56",
        color: "Natural Ecru",
        priceTRY: 4200,
        image: "/imgs/hero-slide-1.jpg",
      },
    ],
    shippingAddress: ISTANBUL_HOME,
    payment: { method: "card", brand: "Visa", last4: "4242" },
    tracking: {
      carrier: "Aramex Express",
      trackingNumber: "ARM-99482155",
      currentStep: 1,
      steps: [
        { key: "placed", date: "2026-09-14", completed: true, current: true },
        { key: "processing", completed: false, current: false },
        { key: "shipped", completed: false, current: false },
        { key: "in_transit", completed: false, current: false },
        { key: "out_for_delivery", completed: false, current: false },
        { key: "delivered", completed: false, current: false },
      ],
    },
  },

  // 2. Processing
  {
    id: "ord-3",
    number: "LL-2019",
    placedAt: "2026-09-12",
    status: "processing",
    totalTRY: 2150,
    shippingTRY: 0,
    itemCount: 1,
    canCancel: true,
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
      estimatedDelivery: "2026-09-18",
      currentStep: 2,
      trackingUrl: "#",
      steps: [
        { key: "placed", date: "2026-09-12", completed: true, current: false },
        { key: "processing", date: "2026-09-13", completed: false, current: true },
        { key: "shipped", completed: false, current: false },
        { key: "in_transit", completed: false, current: false },
        { key: "out_for_delivery", completed: false, current: false },
        { key: "delivered", completed: false, current: false },
      ],
    },
  },

  // 3. Shipped
  {
    id: "ord-2",
    number: "LL-2031",
    placedAt: "2026-09-10",
    status: "shipped",
    totalTRY: 3290,
    shippingTRY: 0,
    itemCount: 1,
    canCancel: false,
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
      estimatedDelivery: "2026-09-16",
      currentStep: 3,
      trackingUrl: "#",
      steps: [
        { key: "placed", date: "2026-09-10", completed: true, current: false },
        { key: "processing", date: "2026-09-11", completed: true, current: false },
        { key: "shipped", date: "2026-09-12", completed: false, current: true },
        { key: "in_transit", completed: false, current: false },
        { key: "out_for_delivery", completed: false, current: false },
        { key: "delivered", completed: false, current: false },
      ],
    },
  },

  // 4. In Transit
  {
    id: "ord-6",
    number: "LL-2028",
    placedAt: "2026-09-08",
    status: "in_transit",
    totalTRY: 5120,
    shippingTRY: 0,
    itemCount: 1,
    canCancel: false,
    items: [
      {
        name: "Embroidered Organza Abaya",
        slug: "embroidered-organza-abaya",
        quantity: 1,
        size: "56",
        color: "Dusty Rose",
        priceTRY: 5120,
        image: "/imgs/hero-slide-2.jpg",
      },
    ],
    shippingAddress: RIYADH_HOME,
    payment: { method: "card", brand: "Mastercard", last4: "1092" },
    tracking: {
      carrier: "DHL Express",
      trackingNumber: "DHL-984120",
      estimatedDelivery: "2026-09-15",
      currentStep: 4,
      trackingUrl: "#",
      steps: [
        { key: "placed", date: "2026-09-08", completed: true, current: false },
        { key: "processing", date: "2026-09-09", completed: true, current: false },
        { key: "shipped", date: "2026-09-10", completed: true, current: false },
        { key: "in_transit", date: "2026-09-11", completed: false, current: true },
        { key: "out_for_delivery", completed: false, current: false },
        { key: "delivered", completed: false, current: false },
      ],
    },
  },

  // 5. Out for Delivery
  {
    id: "ord-7",
    number: "LL-2025",
    placedAt: "2026-09-07",
    status: "out_for_delivery",
    totalTRY: 3600,
    shippingTRY: 0,
    itemCount: 1,
    canCancel: false,
    items: [
      {
        name: "Contemporary Linen Cloche",
        slug: "contemporary-linen-cloche",
        quantity: 1,
        size: "54",
        color: "Stone Grey",
        priceTRY: 3600,
        image: "/imgs/hero-slide-1.jpg",
      },
    ],
    shippingAddress: ISTANBUL_HOME,
    payment: { method: "card", brand: "Visa", last4: "8821" },
    tracking: {
      carrier: "Aramex Express",
      trackingNumber: "ARM-77219904",
      estimatedDelivery: "2026-09-14",
      currentStep: 5,
      trackingUrl: "#",
      steps: [
        { key: "placed", date: "2026-09-07", completed: true, current: false },
        { key: "processing", date: "2026-09-08", completed: true, current: false },
        { key: "shipped", date: "2026-09-09", completed: true, current: false },
        { key: "in_transit", date: "2026-09-11", completed: true, current: false },
        { key: "out_for_delivery", date: "2026-09-14", completed: false, current: true },
        { key: "delivered", completed: false, current: false },
      ],
    },
  },

  // 6. Delivered
  {
    id: "ord-1",
    number: "LL-2048",
    placedAt: "2026-08-28",
    deliveredAt: "2026-09-02",
    status: "delivered",
    totalTRY: 4890,
    shippingTRY: 0,
    itemCount: 2,
    canCancel: false,
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
      currentStep: 6,
      steps: [
        { key: "placed", date: "2026-08-28", completed: true, current: false },
        { key: "processing", date: "2026-08-29", completed: true, current: false },
        { key: "shipped", date: "2026-08-31", completed: true, current: false },
        { key: "in_transit", date: "2026-09-01", completed: true, current: false },
        { key: "out_for_delivery", date: "2026-09-02", completed: true, current: false },
        { key: "delivered", date: "2026-09-02", completed: true, current: false },
      ],
    },
  },

  // 7. Failed
  {
    id: "ord-8",
    number: "LL-2012",
    placedAt: "2026-08-20",
    status: "failed",
    totalTRY: 2980,
    shippingTRY: 0,
    itemCount: 1,
    canCancel: false,
    items: [
      {
        name: "Farasha Pure Linen Abaya",
        slug: "farasha-pure-linen-abaya",
        quantity: 1,
        size: "58",
        color: "Onyx Black",
        priceTRY: 2980,
        image: "/imgs/hero-slide-3.jpg",
      },
    ],
    shippingAddress: RIYADH_HOME,
    payment: { method: "card", brand: "Visa", last4: "5512" },
    tracking: {
      carrier: "DHL Express",
      trackingNumber: "DHL-667102",
      currentStep: 4,
      steps: [
        { key: "placed", date: "2026-08-20", completed: true, current: false },
        { key: "processing", date: "2026-08-21", completed: true, current: false },
        { key: "shipped", date: "2026-08-22", completed: true, current: false },
        { key: "in_transit", date: "2026-08-24", completed: false, current: true },
      ],
    },
  },

  // 8. Returned
  {
    id: "ord-9",
    number: "LL-2005",
    placedAt: "2026-08-15",
    status: "returned",
    totalTRY: 3750,
    shippingTRY: 0,
    itemCount: 1,
    canCancel: false,
    items: [
      {
        name: "Raw Linen Trench Abaya",
        slug: "raw-linen-trench-abaya",
        quantity: 1,
        size: "54",
        color: "Almond",
        priceTRY: 3750,
        image: "/imgs/hero-slide-1.jpg",
      },
    ],
    shippingAddress: ISTANBUL_HOME,
    payment: { method: "card", brand: "Mastercard", last4: "9001" },
  },

  // 9. Cancelled
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
    canCancel: false,
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
