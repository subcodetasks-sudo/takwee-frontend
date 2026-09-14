import { ProductCardSkeleton } from "@/features/product";

export function ShopLoadingSkeleton() {
  return (
    <section className="page-shell w-full py-6 sm:py-8 md:py-10 space-y-6" aria-busy="true">
      {/* Filter controls & count bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-24 rounded-lg bg-muted animate-pulse" />
          <div className="h-4 w-32 rounded bg-muted/70 animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-36 rounded-lg bg-muted animate-pulse" />
          <div className="hidden sm:flex items-center gap-1">
            <div className="size-9 rounded-lg bg-muted animate-pulse" />
            <div className="size-9 rounded-lg bg-muted animate-pulse" />
          </div>
        </div>
      </div>

      {/* Filter chips skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <div className="h-8 w-16 rounded-full bg-muted animate-pulse shrink-0" />
        <div className="h-8 w-20 rounded-full bg-muted/70 animate-pulse shrink-0" />
        <div className="h-8 w-24 rounded-full bg-muted/70 animate-pulse shrink-0" />
        <div className="h-8 w-20 rounded-full bg-muted/70 animate-pulse shrink-0" />
        <div className="h-8 w-28 rounded-full bg-muted/70 animate-pulse shrink-0" />
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
