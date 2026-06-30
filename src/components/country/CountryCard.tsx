import Link from "next/link";
import { formatMoney } from "@/lib/format";
import { COUNTRY_CODES } from "@/lib/constants";
import { ArrowUpRight } from "lucide-react";
import type { Country } from "@/types/db";

export function CountryCard({ country }: { country: Country }) {
  const code = COUNTRY_CODES[country.slug] ?? country.slug.slice(0, 2).toUpperCase();

  return (
    <Link
      href={`/countries/${country.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-sand-300 bg-white transition-colors hover:border-emerald/40"
    >
      {country.cover_image ? (
        /* Банер без тексту — назву й прапор накладаємо поверх із затемненням */
        <div className="relative aspect-[3/2] overflow-hidden bg-sand-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={country.cover_image}
            alt={country.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {/* Затемнення зверху для читабельності тексту */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent" />
          <div className="absolute left-4 top-3 flex items-center gap-2">
            <span className="font-display text-2xl font-bold text-white drop-shadow-sm">
              {country.name}
            </span>
            <span className="text-2xl leading-none drop-shadow-sm">{country.emoji}</span>
          </div>
        </div>
      ) : (
        /* Без банера — паспортна смуга з кодом країни */
        <div className="flex items-start justify-between border-b border-sand-200 bg-sand-50 px-5 py-4">
          <div>
            <div className="font-mono text-3xl font-bold tracking-tight text-ink">{code}</div>
            <div className="mt-0.5 text-sm font-medium text-slate-600">{country.name}</div>
          </div>
          <span className="text-3xl leading-none">{country.emoji}</span>
        </div>
      )}

      {/* Тіло */}
      <div className="px-5 py-4">
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
          {country.short_description}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {country.average_salary != null && country.currency && (
            <div>
              <dt className="text-xs text-slate-500">Сер. зарплата</dt>
              <dd className="font-mono font-medium text-ink">{formatMoney(country.average_salary, country.currency)}</dd>
            </div>
          )}
          {country.average_rent != null && country.currency && (
            <div>
              <dt className="text-xs text-slate-500">Оренда</dt>
              <dd className="font-mono font-medium text-ink">{formatMoney(country.average_rent, country.currency)}</dd>
            </div>
          )}
        </dl>

        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald">
          Детальніше
          <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}
