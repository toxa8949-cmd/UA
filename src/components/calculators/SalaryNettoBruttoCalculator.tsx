"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { formatMoney } from "@/lib/format";
import type { Country } from "@/types/db";

type Props = { countries: Country[] };

// Дуже спрощені орієнтовні ефективні ставки утримань (податки + соцвнески)
// для найманого працівника. Реальні цифри залежать від багатьох факторів.
const EFFECTIVE_DEDUCTION: Record<string, number> = {
  poland: 0.28,
  germany: 0.38,
  "czech-republic": 0.25,
  spain: 0.24,
  portugal: 0.27,
};

export function SalaryNettoBruttoCalculator({ countries }: Props) {
  const [countryId, setCountryId] = useState(countries[0]?.id ?? "");
  const [gross, setGross] = useState(0);
  const [children, setChildren] = useState(0);

  const country = countries.find((c) => c.id === countryId);
  const currency = country?.currency ?? "EUR";

  const result = useMemo(() => {
    const slug = country?.slug ?? "poland";
    let rate = EFFECTIVE_DEDUCTION[slug] ?? 0.28;
    // невелика знижка за дітей (умовна)
    rate = Math.max(0.1, rate - children * 0.01);
    const deductions = Math.round(gross * rate);
    const netto = gross - deductions;
    return { netto, deductions, rate };
  }, [gross, children, country]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Країна</span>
            <select value={countryId} onChange={(e) => setCountryId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
              {countries.map((c) => (
                <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Зарплата brutto ({currency})</span>
            <input type="number" min={0} value={gross || ""}
              onChange={(e) => setGross(+e.target.value)} placeholder="0"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Кількість дітей</span>
            <input type="number" min={0} value={children}
              onChange={(e) => setChildren(Math.max(0, +e.target.value))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="bg-emerald text-white">
          <p className="text-sm text-emerald-50">Приблизно netto (на руки)</p>
          <p className="mt-1 text-3xl font-bold">{formatMoney(result.netto, currency)}</p>
        </Card>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <p className="text-sm text-slate-500">Утримання</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{formatMoney(result.deductions, currency)}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Ефективна ставка</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{Math.round(result.rate * 100)}%</p>
          </Card>
        </div>
        <Card>
          <p className="text-sm text-slate-500">
            Це дуже приблизний розрахунок за усередненою ставкою податків і
            соцвнесків. Реальна сума залежить від податкового класу, пільг,
            типу договору та інших факторів. Для точного розрахунку зверніться
            до бухгалтера.
          </p>
        </Card>
      </div>
    </div>
  );
}
