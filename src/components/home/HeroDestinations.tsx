import Link from "next/link";
import { COUNTRY_CODES } from "@/lib/constants";
import { formatMoney } from "@/lib/format";
import type { Country } from "@/types/db";
import { ArrowUpRight } from "lucide-react";

/**
 * Сигнатурний елемент головної: панель напрямків.
 * Кожна країна — великий код (PL/DE/...) + ключова метрика (середня зарплата).
 * Працює і як візуальний якір, і як соц-доказ масштабу, і як швидка навігація.
 */
export function HeroDestinations({ countries }: { countries: Country[] }) {
  return (
    <div className="mx-auto mt-10 max-w-4xl">
      <p className="mb-3 text-center font-mono text-xs uppercase tracking-widest text-slate-400">
        Оберіть країну — і ми проведемо вас крок за кроком
      </p>
      <div className="grid gap-px overflow-hidden rounded-2xl border border-sand-300 bg-sand-300 sm:grid-cols-2 lg:grid-cols-5">
        {countries.map((c) => {
          const code = COUNTRY_CODES[c.slug] ?? c.slug.slice(0, 2).toUpperCase();
          return (
            <Link
              key={c.id}
              href={`/countries/${c.slug}`}
              className="group relative flex flex-col justify-between bg-white p-5 transition-colors hover:bg-sand-100"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-3xl font-bold tracking-tight text-ink transition-colors group-hover:text-emerald">
                  {code}
                </span>
                <ArrowUpRight
                  size={16}
                  className="text-slate-300 transition-all group-hover:text-emerald group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
              <div className="mt-6">
                <p className="text-sm font-medium text-ink">{c.name}</p>
                {c.average_salary != null && c.currency ? (
                  <p className="mt-0.5 text-xs text-slate-500">
                    Середня зарплата{" "}
                    <span className="text-slate-600">{formatMoney(c.average_salary, c.currency)}</span>
                  </p>
                ) : (
                  <p className="mt-0.5 text-xs text-slate-400">{c.capital ?? ""}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
