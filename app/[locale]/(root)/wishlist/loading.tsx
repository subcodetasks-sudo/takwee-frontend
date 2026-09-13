import { ProductCardSkeleton } from "@/features/product";

export default function WishlistLoading() {
  return (
    <main className="page-shell flex min-h-dvh flex-1 flex-col" aria-busy="true">
      <section className="w-full flex-1 py-6 sm:py-8 md:py-12 space-y-6 sm:space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between border-b border-border/60 pb-5">
          <div className="space-y-1.5">
            <div className="h-8 sm:h-10 w-44 rounded-lg bg-muted animate-pulse" />
            <div className="h-4 w-28 rounded bg-muted/70 animate-pulse" />
          </div>
          <div className="h-9 w-28 rounded-lg bg-muted animate-pulse" />
        </div>

        {/* Product Cards Grid Skeleton */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
