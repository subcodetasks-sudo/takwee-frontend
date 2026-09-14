import { ShopViewClient } from "./ShopViewClient";

interface ShopViewProps {
  /** `/shop/[filter]` segment — category slug or legacy promo filter. */
  pathFilter?: string;
  /** Optional search query from URL searchParams (`/shop?search=...`). */
  searchQuery?: string;
}

/**
 * Server Component shell for the shop PLP — suitable for JSON-LD / ItemList.
 * Catalog interactivity lives in {@link ShopViewClient}.
 */
export async function ShopView({ pathFilter, searchQuery }: ShopViewProps) {
  return (
    <>
      {/* JSON-LD (CollectionPage / ItemList) can be injected here. */}
      <ShopViewClient pathFilter={pathFilter} searchQuery={searchQuery} />
    </>
  );
}
