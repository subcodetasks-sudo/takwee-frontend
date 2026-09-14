import { OrderDetailsContent } from "./OrderDetailsContent";

interface OrderDetailsViewProps {
  orderId: string;
}

/**
 * Server Component shell for order detail — suitable for JSON-LD later.
 * Authenticated fetch / interactivity lives in {@link OrderDetailsContent}.
 */
export async function OrderDetailsView({ orderId }: OrderDetailsViewProps) {
  return (
    <>
      {/* JSON-LD (Order) can be injected here when server order data is available. */}
      <OrderDetailsContent orderId={orderId} />
    </>
  );
}
