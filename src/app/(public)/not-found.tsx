import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="text-6xl font-bold text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Сторінку не знайдено</h1>
      <p className="mt-2 text-slate-600">Можливо, сторінку видалено або адреса введена з помилкою.</p>
      <Link href="/" className="mt-6 rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700">
        На головну
      </Link>
    </div>
  );
}
