import Link from "next/link";
import { ArrowRight } from "lucide-react";

const LINKS = [
  { href: "/countries", label: "Країни" },
  { href: "/articles", label: "Статті" },
  { href: "/calculators", label: "Калькулятори" },
  { href: "/services", label: "Сервіси" },
];

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      {/* Паспортний код-заглушка */}
      <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-sand-300 bg-sand-50">
        <span className="font-mono text-3xl font-bold text-slate-400">404</span>
      </div>

      <h1 className="mt-8 font-display text-3xl font-bold text-ink">Сторінку не знайдено</h1>
      <p className="mt-3 max-w-md text-slate-600">
        Можливо, адресу введено з помилкою або сторінку переміщено. Скористайтеся
        навігацією або поверніться на головну.
      </p>

      <Link
        href="/"
        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald px-6 py-3 font-semibold text-white hover:bg-emerald-700"
      >
        На головну <ArrowRight size={16} />
      </Link>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-full border border-sand-300 px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-sand-200 hover:text-ink"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
