export default function AuthLoading() {
  return (
    <div className="w-full max-w-sm space-y-6 py-6 sm:py-8" aria-busy="true">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 rounded-lg bg-muted animate-pulse" />
        <div className="h-4 w-64 rounded bg-muted/70 animate-pulse" />
      </div>

      {/* Form Fields skeleton */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-3.5 w-16 rounded bg-muted animate-pulse" />
          <div className="h-11 w-full rounded-xl bg-muted/60 animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-3.5 w-20 rounded bg-muted animate-pulse" />
          <div className="h-11 w-full rounded-xl bg-muted/60 animate-pulse" />
        </div>
      </div>

      {/* Submit Button skeleton */}
      <div className="h-11 w-full rounded-xl bg-muted animate-pulse" />

      {/* Footer link skeleton */}
      <div className="mx-auto h-4 w-40 rounded bg-muted/60 animate-pulse" />
    </div>
  );
}
