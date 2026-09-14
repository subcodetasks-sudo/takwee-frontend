import { ProductCardSkeleton } from "./ProductCardSkeleton";

export function ProductDetailsSkeleton() {
  return (
    <div className="w-full flex-1" aria-busy="true">
      <article className="page-shell flex w-full flex-col gap-6 py-6 pb-24 sm:gap-8 sm:py-8 sm:pb-28 md:py-10 md:pb-12">
        {/* Breadcrumb Skeleton */}
        <div className="-mb-1 flex items-center gap-2">
          <div className="h-4 w-24 rounded bg-muted animate-pulse" />
          <span className="text-muted-foreground/40">/</span>
          <div className="h-4 w-20 rounded bg-muted/70 animate-pulse" />
        </div>

        {/* 2-Column Hero Skeleton */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-start">
          {/* Gallery Skeleton (Col 1-7) */}
          <div className="space-y-4 lg:col-span-7">
            <div className="aspect-3/4 w-full rounded-2xl sm:rounded-3xl bg-muted/60 animate-pulse ring-1 ring-border/50" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-3/4 w-20 sm:w-24 rounded-lg sm:rounded-xl bg-muted/60 animate-pulse ring-1 ring-border/40"
                />
              ))}
            </div>
          </div>

          {/* Details Skeleton (Col 8-12) */}
          <div className="space-y-6 lg:col-span-5">
            {/* Badge & Title */}
            <div className="space-y-2">
              <div className="h-5 w-20 rounded-md bg-muted animate-pulse" />
              <div className="h-8 sm:h-9 w-4/5 rounded-lg bg-muted animate-pulse" />
              <div className="h-5 w-32 rounded bg-muted/70 animate-pulse" />
            </div>

            {/* Price */}
            <div className="space-y-1 border-y border-border/60 py-4">
              <div className="h-7 w-28 rounded-md bg-muted animate-pulse" />
              <div className="h-3.5 w-44 rounded bg-muted/60 animate-pulse" />
            </div>

            {/* Color Swatches */}
            <div className="space-y-2.5">
              <div className="h-4 w-20 rounded bg-muted animate-pulse" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="size-7 rounded-full bg-muted animate-pulse ring-1 ring-border/50"
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                <div className="h-4 w-24 rounded bg-muted/70 animate-pulse" />
              </div>
              <div className="flex flex-wrap gap-2">
                {["52", "54", "56", "58", "60"].map((size) => (
                  <div
                    key={size}
                    className="h-9 w-12 rounded-lg bg-muted animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 pt-2">
              <div className="h-12 flex-1 rounded-xl bg-muted animate-pulse" />
              <div className="size-12 rounded-xl bg-muted animate-pulse" />
            </div>

            {/* Guarantees Box */}
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="size-5 rounded bg-muted animate-pulse" />
                <div className="h-3.5 w-3/4 rounded bg-muted animate-pulse" />
              </div>
              <div className="flex items-center gap-3">
                <div className="size-5 rounded bg-muted animate-pulse" />
                <div className="h-3.5 w-2/3 rounded bg-muted animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="mt-8 space-y-6">
          <div className="flex border-b border-border/60 gap-6">
            <div className="h-9 w-28 rounded-t-lg bg-muted animate-pulse" />
            <div className="h-9 w-28 rounded-t-lg bg-muted/60 animate-pulse" />
            <div className="h-9 w-28 rounded-t-lg bg-muted/60 animate-pulse" />
          </div>
          <div className="space-y-3 py-4">
            <div className="h-4 w-full rounded bg-muted/70 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-muted/70 animate-pulse" />
            <div className="h-4 w-4/6 rounded bg-muted/70 animate-pulse" />
          </div>
        </div>

        {/* Related Products Skeleton */}
        <div className="mt-6 rounded-2xl bg-muted/40 p-5 sm:rounded-3xl sm:p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <div className="h-6 w-36 rounded bg-muted animate-pulse" />
            <div className="h-4 w-56 rounded bg-muted/70 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
