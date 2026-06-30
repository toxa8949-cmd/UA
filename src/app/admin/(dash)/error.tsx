"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
      <h2 className="text-lg font-semibold text-red-700">Помилка в адмінці</h2>
      <p className="mt-2 text-sm text-red-600">{error.message}</p>
      {error.digest && (
        <p className="mt-1 font-mono text-xs text-red-400">digest: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
      >
        Спробувати знову
      </button>
    </div>
  );
}
