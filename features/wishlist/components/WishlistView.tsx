import { WishlistHeader } from "./WishlistHeader";
import { WishlistEmptyState } from "./WishlistEmptyState";
import type { WishlistItem } from "../types";

interface WishlistViewProps {
  items?: WishlistItem[];
}

export async function WishlistView({ items = [] }: WishlistViewProps) {
  const itemCount = items.length;

  return (
    <section className="w-full flex-1 py-5 sm:py-8 md:py-12">
      <div className="space-y-6 sm:space-y-10">
        <WishlistHeader itemCount={itemCount} />

        {itemCount === 0 ? (
          <WishlistEmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {/* Wishlist items list will be connected here */}
          </div>
        )}
      </div>
    </section>
  );
}
