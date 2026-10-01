import { Skeleton } from "@/components/ui/skeleton";

export function FaqSkeleton() {
  return (
    <div className="flex w-full flex-col gap-3.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-border/60 bg-card p-5 shadow-2xs"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              <Skeleton className="size-6 shrink-0 rounded-lg" />
              <Skeleton className="h-5 w-3/4 max-w-md rounded-md" />
            </div>
            <Skeleton className="size-5 shrink-0 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
