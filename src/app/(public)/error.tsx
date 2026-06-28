"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-sand-300 bg-sand-50">
        <span className="font-mono text-2xl font-bold text-slate-400">:(</span>
      </div>

      <h1 className="mt-8 font-display text-3xl font-bold text-ink">Щось пішло не так</h1>
      <p className="mt-3 max-w-md text-slate-600">
        Сталася технічна помилка. Спробуйте оновити сторінку — зазвичай це допомагає.
      </p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald px-6 py-3 font-semibold text-white hover:bg-emerald-700"
        >
          <RotateCcw size={16} /> Спробувати знову
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-ink/20 px-6 py-3 font-semibold text-ink hover:bg-sand-200"
        >
          На головну
        </Link>
      </div>
    </div>
  );
}
