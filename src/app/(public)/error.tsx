"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold text-slate-900">Щось пішло не так</h1>
      <p className="mt-2 text-slate-600">Спробуйте оновити сторінку.</p>
      <button onClick={reset} className="mt-6 rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700">
        Спробувати знову
      </button>
    </div>
  );
}
