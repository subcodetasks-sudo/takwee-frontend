export default function CartLoading() {
  return (
    <main className="page-shell flex min-h-dvh flex-1 flex-col" aria-busy="true">
      <section className="w-full flex-1 py-4 sm:py-8 md:py-12">
        <div className="space-y-6 sm:space-y-10">
          {/* Header */}
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-muted animate-pulse" />
            <div className="flex items-center gap-3">
              <div className="h-8 sm:h-10 w-44 rounded-lg bg-muted animate-pulse" />
              <div className="h-6 w-16 rounded-full bg-muted/60 animate-pulse" />
            </div>
          </div>

          {/* 2-Column Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left Items Column */}
            <div className="lg:col-span-8 space-y-4">
              <div className="h-12 w-full animate-pulse rounded-2xl bg-muted/50" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-2xl sm:rounded-3xl border border-border/60 bg-card"
                >
                  <div className="aspect-3/4 w-20 sm:w-24 rounded-xl bg-muted animate-pulse shrink-0" />
                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div className="space-y-2">
                      <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                      <div className="h-3 w-1/3 rounded bg-muted/70 animate-pulse" />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="h-5 w-20 rounded bg-muted animate-pulse" />
                      <div className="h-8 w-24 rounded-lg bg-muted animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl sm:rounded-3xl border border-border/60 bg-card p-6 space-y-5">
                <div className="h-6 w-36 rounded bg-muted animate-pulse" />
                <div className="space-y-3 border-y border-border/50 py-4">
                  <div className="flex justify-between">
                    <div className="h-4 w-20 rounded bg-muted animate-pulse" />
                    <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                    <div className="h-4 w-12 rounded bg-muted animate-pulse" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-12 rounded bg-muted animate-pulse" />
                    <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                  </div>
                </div>
                <div className="flex justify-between pt-1">
                  <div className="h-6 w-20 rounded bg-muted animate-pulse" />
                  <div className="h-6 w-24 rounded bg-muted animate-pulse" />
                </div>
                <div className="h-12 w-full rounded-xl bg-muted animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
