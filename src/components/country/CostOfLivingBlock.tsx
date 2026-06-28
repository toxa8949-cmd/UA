import Link from "next/link";
import { formatMoney } from "@/lib/format";
import { ArrowUpRight } from "lucide-react";
import type { CostBreakdown } from "@/lib/costModel";

export function CostOfLivingBlock({
  single,
  family,
  currency,
  averageSalary,
}: {
  single: CostBreakdown;
  family: CostBreakdown;
  currency: string;
  averageSalary: number | null;
}) {
  const cards = [
    { label: "Одна людина", value: single.total, hint: "оренда, їжа, транспорт" },
    { label: "Сім'я (2+2)", value: family.total, hint: "двоє дорослих, двоє дітей" },
    averageSalary
      ? { label: "Середня зарплата", value: averageSalary, hint: "до сплати податків" }
      : null,
  ].filter(Boolean) as { label: string; value: number; hint: string }[];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-sand-300 bg-white p-5">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-ink">
              {formatMoney(c.value, currency)}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">{c.hint}</p>
          </div>
        ))}
      </div>
      <Link
        href="/calculators/cost-of-living"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-emerald hover:text-emerald-700"
      >
        Порахувати точніше в калькуляторі
        <ArrowUpRight size={15} />
      </Link>
      <p className="mt-2 text-xs text-slate-400">
        Орієнтовні значення на основі середніх цін. Реальні суми залежать від міста та звичок.
      </p>
    </div>
  );
}
