export default function OrderDetailsLoading() {
  return (
    <main className="page-shell flex min-h-dvh flex-1 flex-col" aria-busy="true">
      <section className="w-full flex-1 py-5 sm:py-8 md:py-12">
        <div className="mx-auto space-y-5 sm:space-y-8">
          <div className="space-y-2.5 sm:space-y-4">
            <div className="h-4 w-28 rounded bg-muted animate-pulse" />
            <div className="h-8 w-48 rounded-lg bg-muted animate-pulse" />
            <div className="h-4 w-36 rounded bg-muted/70 animate-pulse" />
          </div>
          <div className="h-28 rounded-xl bg-muted/60 animate-pulse sm:rounded-2xl" />
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-xl border border-border/60 p-3 sm:gap-4 sm:p-5"
              >
                <div className="size-14 shrink-0 rounded-lg bg-muted animate-pulse sm:size-24" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
                  <div className="h-3.5 w-1/3 rounded bg-muted/70 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
