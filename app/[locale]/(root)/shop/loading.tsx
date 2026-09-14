import { ShopLoadingSkeleton } from "@/features/shop";

export default function ShopLoading() {
  return (
    <main className="flex flex-1 flex-col" aria-busy="true">
      {/* Shop Hero Skeleton */}
      <section className="relative w-full overflow-hidden bg-muted/40 py-12 sm:py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background" />
        <div className="relative page-shell flex flex-col items-center justify-center text-center space-y-3">
          <div className="h-8 sm:h-10 md:h-12 w-48 sm:w-64 rounded-lg bg-muted animate-pulse" />
          <div className="h-4 sm:h-5 w-72 sm:w-96 max-w-full rounded bg-muted/70 animate-pulse" />
        </div>
      </section>

      {/* Catalog Bar & Grid Skeleton */}
      <ShopLoadingSkeleton />
    </main>
  );
}

