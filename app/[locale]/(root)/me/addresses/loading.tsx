export default function AddressesLoading() {
  return (
    <main className="page-shell flex min-h-dvh flex-1 flex-col" aria-busy="true">
      <section className="w-full flex-1 py-5 sm:py-8 md:py-12">
        <div className="space-y-5 sm:space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-2 sm:space-y-3">
            <div className="h-4 w-28 rounded bg-muted animate-pulse" />
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-1">
                <div className="h-8 sm:h-10 w-40 rounded-lg bg-muted animate-pulse" />
                <div className="h-4 w-52 rounded bg-muted/70 animate-pulse" />
              </div>
              <div className="h-9 w-32 rounded-lg bg-muted animate-pulse" />
            </div>
          </div>

          {/* Addresses Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-lg bg-muted animate-pulse" />
                    <div className="h-4 w-20 rounded bg-muted animate-pulse" />
                  </div>
                  <div className="h-5 w-14 rounded-full bg-muted animate-pulse" />
                </div>
                <div className="space-y-1.5 pt-1">
                  <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                  <div className="h-3.5 w-1/2 rounded bg-muted/80 animate-pulse" />
                </div>
                <div className="pt-2 border-t border-border/40 flex justify-end gap-2">
                  <div className="h-7 w-16 rounded-md bg-muted animate-pulse" />
                  <div className="h-7 w-16 rounded-md bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
