export default function ProfileLoading() {
  return (
    <main className="page-shell flex min-h-dvh flex-1 flex-col" aria-busy="true">
      <section className="w-full flex-1 py-8 md:py-12">
        <div className="mx-auto space-y-8 md:space-y-10">
          {/* Profile Hero Skeleton */}
          <div className="rounded-2xl sm:rounded-3xl border border-border/60 bg-card p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
              <div className="size-20 sm:size-24 rounded-full bg-muted animate-pulse shrink-0 ring-4 ring-background shadow-md" />
              <div className="flex-1 space-y-2.5 text-center sm:text-start">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                  <div className="h-7 w-40 rounded-lg bg-muted animate-pulse mx-auto sm:mx-0" />
                  <div className="h-5 w-20 rounded-full bg-muted/60 animate-pulse mx-auto sm:mx-0" />
                </div>
                <div className="h-4 w-52 rounded bg-muted/70 animate-pulse mx-auto sm:mx-0" />
                <div className="h-4 w-36 rounded bg-muted/50 animate-pulse mx-auto sm:mx-0" />
              </div>
              <div className="h-10 w-28 rounded-xl bg-muted animate-pulse" />
            </div>
          </div>

          {/* Quick Links Section Skeleton */}
          <div className="space-y-3">
            <div className="h-5 w-32 rounded bg-muted animate-pulse" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border/60 bg-card p-6 sm:p-7 flex flex-col justify-between min-h-[160px] space-y-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="size-12 rounded-2xl bg-muted animate-pulse" />
                    <div className="size-6 rounded-full bg-muted/50 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-5 w-28 rounded-md bg-muted animate-pulse" />
                    <div className="h-3.5 w-4/5 rounded bg-muted/70 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences Section Skeleton */}
          <div className="space-y-3">
            <div className="h-5 w-32 rounded bg-muted animate-pulse" />
            <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="space-y-1">
                  <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-40 rounded bg-muted/70 animate-pulse" />
                </div>
                <div className="h-8 w-28 rounded-lg bg-muted animate-pulse" />
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="space-y-1">
                  <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-40 rounded bg-muted/70 animate-pulse" />
                </div>
                <div className="h-8 w-28 rounded-lg bg-muted animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
