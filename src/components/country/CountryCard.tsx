import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { formatMoney } from "@/lib/format";
import type { Country } from "@/types/db";

export function CountryCard({ country }: { country: Country }) {
  return (
    <Link href={`/countries/${country.slug}`}>
      <Card className="h-full">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{country.emoji}</span>
          <div>
            <h3 className="font-semibold text-slate-900">{country.name}</h3>
            <p className="text-xs text-slate-500">{country.capital}</p>
          </div>
        </div>
        <p className="mt-3 line-clamp-3 text-sm text-slate-600">{country.short_description}</p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          {country.average_salary != null && country.currency && (
            <span>Сер. зарплата: {formatMoney(country.average_salary, country.currency)}</span>
          )}
          {country.average_rent != null && country.currency && (
            <span>Оренда: {formatMoney(country.average_rent, country.currency)}</span>
          )}
        </div>
      </Card>
    </Link>
  );
}
