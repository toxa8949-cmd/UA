"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { formatMoney } from "@/lib/format";
import { toEur, type Rates } from "@/lib/currency";
import type { Country } from "@/types/db";

type Props = { countries: Country[]; rates?: Rates };

const ITEMS: { key: string; label: string; rentMult: number; flat?: number }[] = [
  { key: "deposit", label: "Депозит за житло", rentMult: 2 },
  { key: "firstRent", label: "Перший місяць оренди", rentMult: 1 },
  { key: "tickets", label: "Дорога / квитки", rentMult: 0, flat: 0.4 },
  { key: "docs", label: "Документи та переклади", rentMult: 0, flat: 0.2 },
  { key: "insurance", label: "Страховка", rentMult: 0, flat: 0.25 },
  { key: "settle", label: "Облаштування (меблі, побут)", rentMult: 0.8 },
  { key: "reserve", label: "Резерв на 1-2 місяці", rentMult: 1.5 },
];

export function RelocationBudgetCalculator({ countries, rates }: Props) {
  const [countryId, setCountryId] = useState(countries[0]?.id ?? "");
  const [people, setPeople] = useState(1);

  const country = countries.find((c) => c.id === countryId) ?? countries[0];
  const currency = country?.currency ?? "EUR";
  const baseRent = country?.average_rent ?? 800;

  const breakdown = useMemo(() => {
    // оренда для сім'ї (як у моделі вартості життя)
    const rent = Math.round(baseRent * (1 + (people - 1) * 0.25));
    return ITEMS.map((it) => {
      const value = it.flat
        ? Math.round(baseRent * it.flat * people)
        : Math.round(rent * it.rentMult);
      return { ...it, value };
    });
  }, [baseRent, people]);

  const total = breakdown.reduce((a, b) => a + b.value, 0);
  const min = Math.round(total * 0.8);
  const comfort = Math.round(total * 1.25);

  if (!country) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      {/* Керування */}
      <Card className="h-fit">
        <div className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Країна</span>
            <select value={countryId} onChange={(e) => setCountryId(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-sand-300 px-3 py-2.5">
              {countries.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Кількість людей</span>
            <input type="number" min={1} max={8} value={people}
              onChange={(e) => setPeople(Math.min(8, Math.max(1, +e.target.value)))}
              className="mt-1.5 w-full rounded-xl border border-sand-300 px-3 py-2.5" />
          </label>
          <p className="text-sm text-slate-500">
            Калькулятор сам оцінить потрібний бюджет на основі середніх цін у країні.
          </p>
        </div>
      </Card>

      {/* Результат */}
      <div className="space-y-5">
        <Card className="border-emerald/20 bg-emerald">
          <p className="text-sm text-emerald-50">Орієнтовний бюджет переїзду · {country.name}</p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-3">
            <span className="font-display text-4xl font-bold text-white">{formatMoney(total, currency)}</span>
            <span className="text-lg text-emerald-50">≈ {formatMoney(toEur(total, currency, rates), "EUR")}</span>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <p className="text-sm text-slate-500">Мінімальний</p>
            <p className="mt-1 font-display text-xl font-bold text-ink">{formatMoney(min, currency)}</p>
            <p className="text-xs text-slate-400">якщо економити</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Комфортний</p>
            <p className="mt-1 font-display text-xl font-bold text-ink">{formatMoney(comfort, currency)}</p>
            <p className="text-xs text-slate-400">із запасом</p>
          </Card>
        </div>

        <Card>
          <h3 className="font-display font-bold text-ink">З чого складається</h3>
          <div className="mt-3 divide-y divide-sand-200">
            {breakdown.map((it) => (
              <div key={it.key} className="flex items-center justify-between py-2 text-sm">
                <span className="text-slate-600">{it.label}</span>
                <span className="font-mono font-medium text-ink">{formatMoney(it.value, currency)}</span>
              </div>
            ))}
          </div>
        </Card>

        <p className="text-sm text-slate-500">
          Розрахунок орієнтовний: базується на середній оренді країни. Реальні суми залежать
          від міста та ваших умов. Перевіряйте актуальні ціни перед переїздом.
        </p>
      </div>
    </div>
  );
}
