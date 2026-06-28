export default function Loading() {
  return (
    <div className="container py-12">
      <div className="h-9 w-64 animate-pulse rounded-lg bg-sand-200" />
      <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-sand-200/70" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-44 animate-pulse rounded-2xl border border-sand-300 bg-sand-100" />
        ))}
      </div>
    </div>
  );
}
