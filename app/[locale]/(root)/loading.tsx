import { ProductCardSkeleton } from "@/features/product";

export default function RootLoading() {
  return (
    <main className="w-full flex flex-col flex-1" aria-busy="true">
      {/* Hero Banner Skeleton */}
      <section className="relative w-full min-h-[600px] md:min-h-[750px] overflow-hidden bg-muted/30">
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <div className="relative page-shell flex min-h-[600px] md:min-h-[750px] flex-col justify-end pb-16 sm:pb-20 md:pb-24">
          <div className="max-w-2xl space-y-4">
            <div className="h-6 w-28 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-10 sm:h-14 w-3/4 rounded-lg bg-muted animate-pulse" />
              <div className="h-10 sm:h-14 w-1/2 rounded-lg bg-muted animate-pulse" />
            </div>
            <div className="h-4 sm:h-5 w-4/5 rounded bg-muted/70 animate-pulse" />
            <div className="flex gap-3 pt-2">
              <div className="h-11 sm:h-12 w-36 rounded-xl bg-muted animate-pulse" />
              <div className="h-11 sm:h-12 w-32 rounded-xl bg-muted/60 animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-8">
            <div className="h-2 w-8 rounded-full bg-muted animate-pulse" />
            <div className="h-2 w-2 rounded-full bg-muted/60 animate-pulse" />
            <div className="h-2 w-2 rounded-full bg-muted/60 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Category Tiles Skeleton */}
      <section className="page-shell relative w-full overflow-hidden bg-background py-8 sm:py-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 lg:gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-full">
              <div className="overflow-hidden rounded-xl sm:rounded-2xl bg-muted/50 ring-1 ring-border/40">
                <div className="aspect-square w-full animate-pulse bg-muted/60" />
                <div className="px-2.5 py-2.5">
                  <div className="mx-auto h-3 w-16 rounded bg-muted animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section Skeleton */}
      <section className="w-full bg-background py-8 sm:py-12 md:py-14">
        <div className="page-shell space-y-8">
          <div className="space-y-2 text-center">
            <div className="mx-auto h-8 w-48 animate-pulse rounded-lg bg-muted" />
            <div className="mx-auto h-4 w-72 animate-pulse rounded bg-muted/70" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
