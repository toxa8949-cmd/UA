import Link from "next/link";
import { COUNTRY_CODES } from "@/lib/constants";
import { ArrowUpRight } from "lucide-react";
import type { Country } from "@/types/db";

export function RelatedCountries({ countries }: { countries: Country[] }) {
  if (countries.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {countries.map((c) => (
        <Link
          key={c.id}
          href={`/countries/${c.slug}`}
          className="group flex items-center gap-4 rounded-2xl border border-sand-300 bg-white p-5 transition-colors hover:border-emerald/40"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-sand-50 font-mono text-xl font-bold text-ink">
            {COUNTRY_CODES[c.slug] ?? c.slug.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-semibold text-ink">{c.name}</span>
              <span>{c.emoji}</span>
            </div>
            <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">{c.short_description}</p>
          </div>
          <ArrowUpRight size={16} className="ml-auto shrink-0 text-emerald transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      ))}
    </div>
  );
}
