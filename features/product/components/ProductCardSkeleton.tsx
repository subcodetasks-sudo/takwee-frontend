import { cn } from "@/lib/utils";

interface ProductCardSkeletonProps {
  className?: string;
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl sm:rounded-2xl bg-card ring-1 ring-border/60",
        className,
      )}
      aria-hidden="true"
    >
      {/* Image container skeleton */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-muted/60 animate-pulse">
        {/* Wishlist icon placeholder */}
        <div className="absolute left-2 top-2 sm:left-3 sm:top-3 size-7 sm:size-9 rounded-full bg-background/80 shadow-xs" />
        {/* Badge placeholder */}
        <div className="absolute right-2 top-2 sm:right-3 sm:top-3 h-5 w-12 sm:h-6 sm:w-16 rounded sm:rounded-md bg-background/80 shadow-xs" />
      </div>

      {/* Details area skeleton */}
      <div className="flex flex-1 flex-col gap-2.5 px-3 py-3 sm:px-3.5 sm:py-3.5">
        {/* Title skeleton */}
        <div className="space-y-1.5 pt-0.5">
          <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
          <div className="h-4 w-3/5 rounded bg-muted animate-pulse" />
        </div>

        {/* Rating skeleton */}
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-16 rounded bg-muted animate-pulse" />
          <div className="h-3 w-6 rounded bg-muted animate-pulse" />
        </div>

        {/* Color swatches skeleton */}
        <div className="flex items-center gap-1.5 pt-1">
          <div className="size-4.5 rounded-full bg-muted animate-pulse ring-1 ring-border/40" />
          <div className="size-4.5 rounded-full bg-muted animate-pulse ring-1 ring-border/40" />
          <div className="size-4.5 rounded-full bg-muted animate-pulse ring-1 ring-border/40" />
        </div>

        {/* Price & Action footer */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="h-5 w-20 rounded bg-muted animate-pulse" />
          <div className="size-8 rounded-full bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}
