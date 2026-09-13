export default function ContentPageLoading() {
  return (
    <main className="flex-1" aria-busy="true">
      <div className="page-shell py-8 sm:py-12 md:py-16">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-4 border-b border-border/60 pb-8">
            <div className="h-4 w-28 rounded bg-muted animate-pulse" />
            <div className="flex items-center gap-3">
              <div className="h-8 sm:h-11 w-3/4 rounded-lg bg-muted animate-pulse" />
              <div className="h-6 w-20 rounded-full bg-muted/60 animate-pulse" />
            </div>
            <div className="h-4 w-40 rounded bg-muted/60 animate-pulse" />
          </div>

          {/* Body Content Blocks Skeleton */}
          <div className="space-y-6">
            <div className="space-y-2.5">
              <div className="h-4 w-full rounded bg-muted/70 animate-pulse" />
              <div className="h-4 w-11/12 rounded bg-muted/70 animate-pulse" />
              <div className="h-4 w-4/5 rounded bg-muted/70 animate-pulse" />
            </div>

            <div className="h-7 w-48 rounded-lg bg-muted animate-pulse pt-4" />

            <div className="space-y-2.5">
              <div className="h-4 w-full rounded bg-muted/70 animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-muted/70 animate-pulse" />
              <div className="h-4 w-3/4 rounded bg-muted/70 animate-pulse" />
            </div>

            {/* Callout box skeleton */}
            <div className="rounded-xl border border-primary-200/60 bg-primary-50/30 p-5 space-y-2">
              <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-muted/70 animate-pulse" />
            </div>

            {/* List items skeleton */}
            <div className="space-y-3 ps-4 pt-2">
              <div className="h-4 w-3/4 rounded bg-muted/70 animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-muted/70 animate-pulse" />
              <div className="h-4 w-4/5 rounded bg-muted/70 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
