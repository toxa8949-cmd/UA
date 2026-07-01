/**
 * Скелетон каталогу «Українцям поруч»: показується миттєво,
 * поки з сервера стрімляться реальні дані (Suspense).
 */
export function PlacesSkeleton() {
  return (
    <div aria-hidden className="animate-pulse">
      {/* Панель фільтрів */}
      <div className="flex flex-wrap gap-2">
        <div className="h-10 w-full max-w-sm rounded-xl bg-sand-200" />
        <div className="h-10 w-32 rounded-xl bg-sand-200" />
        <div className="h-10 w-36 rounded-xl bg-sand-200" />
      </div>

      {/* Сітка карток */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-sand-300 bg-white"
          >
            <div className="aspect-[16/9] bg-sand-200" />
            <div className="space-y-3 p-5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-sand-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-sand-200" />
                  <div className="h-3 w-1/2 rounded bg-sand-200" />
                </div>
              </div>
              <div className="h-3 w-full rounded bg-sand-200" />
              <div className="h-3 w-5/6 rounded bg-sand-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
