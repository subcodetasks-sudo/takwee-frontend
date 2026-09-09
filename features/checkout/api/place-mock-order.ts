import type { OrderItemSummary, OrderSummary } from "@/features/orders/types";
import type { PlaceOrderInput, PlaceOrderResult } from "../types";

function buildOrderNumber(): string {
  const n = 2000 + Math.floor(Math.random() * 900);
  return `LL-${n}`;
}

function buildOrderId(): string {
  return `ord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/** Simulated latency for boutique place-order UX. */
export async function placeMockOrder(
  input: PlaceOrderInput,
): Promise<PlaceOrderResult> {
  await new Promise((resolve) => setTimeout(resolve, 650));

  const labelById = new Map(input.labels.map((l) => [l.id, l]));

  const items: OrderItemSummary[] = input.items.map((item) => {
    const label = labelById.get(item.id);
    const selectedColor =
      item.product.colors.find((c) => c.id === item.selectedColorId) ??
      item.product.colors[0];
    const image =
      selectedColor?.images[0] ??
      item.product.colors[0]?.images[0] ??
      undefined;

    return {
      name: label?.name ?? item.product.slug,
      quantity: item.quantity,
      image,
      size: item.selectedSize,
      color: label?.color,
      priceTRY: item.product.priceTRY,
      slug: item.product.slug,
    };
  });

  const totalTRY = input.subtotalTRY + input.taxTRY;
  const today = new Date().toISOString().slice(0, 10);

  const order: OrderSummary = {
    id: buildOrderId(),
    number: buildOrderNumber(),
    placedAt: today,
    status: "processing",
    totalTRY,
    shippingTRY: 0,
    itemCount: input.items.reduce((sum, i) => sum + i.quantity, 0),
    items,
    shippingAddress: input.shippingAddress,
    payment:
      input.paymentMethod === "card"
        ? { method: "card", brand: "Visa", last4: "4242" }
        : { method: input.paymentMethod },
    tracking: {
      carrier: "Aramex Express",
      trackingNumber: `ARM-${Math.floor(10000000 + Math.random() * 89999999)}`,
      estimatedDelivery: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      currentStep: 1,
      trackingUrl: "#",
      steps: [
        { key: "placed", date: today, completed: true, current: true },
        { key: "tailoring", completed: false, current: false },
        { key: "shipped", completed: false, current: false },
        { key: "delivered", completed: false, current: false },
      ],
    },
  };

  return { order };
}
