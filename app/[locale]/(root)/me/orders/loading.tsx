export default function OrdersLoading() {
  return (
    <main className="page-shell flex min-h-dvh flex-1 flex-col" aria-busy="true">
      <section className="w-full flex-1 py-5 sm:py-8 md:py-12">
        <div className="space-y-5 sm:space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-2 sm:space-y-3">
            <div className="h-4 w-28 rounded bg-muted animate-pulse" />
            <div className="space-y-1">
              <div className="h-8 sm:h-10 w-44 rounded-lg bg-muted animate-pulse" />
              <div className="h-4 w-60 rounded bg-muted/70 animate-pulse" />
            </div>
          </div>

          {/* Orders List Skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-4">
                  <div className="space-y-1">
                    <div className="h-5 w-32 rounded bg-muted animate-pulse" />
                    <div className="h-3.5 w-24 rounded bg-muted/70 animate-pulse" />
                  </div>
                  <div className="h-6 w-24 rounded-full bg-muted animate-pulse" />
                </div>
                <div className="flex gap-4">
                  <div className="aspect-3/4 w-16 sm:w-20 rounded-xl bg-muted animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                    <div className="h-3.5 w-1/3 rounded bg-muted/70 animate-pulse" />
                    <div className="h-4 w-20 rounded bg-muted animate-pulse pt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
