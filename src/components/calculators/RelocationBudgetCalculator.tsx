"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { formatMoney } from "@/lib/format";
import { toEur } from "@/lib/currency";
import type { Country } from "@/types/db";

type Props = { countries: Country[] };

const FIELDS = [
  { key: "tickets", label: "Квитки / дорога" },
  { key: "deposit", label: "Депозит за житло" },
  { key: "firstRent", label: "Перший місяць оренди" },
  { key: "docs", label: "Документи" },
  { key: "insurance", label: "Страховка" },
  { key: "moving", label: "Перевезення речей" },
  { key: "reserve", label: "Резерв на непередбачене" },
] as const;

type FieldKey = (typeof FIELDS)[number]["key"];

export function RelocationBudgetCalculator({ countries }: Props) {
  const [countryId, setCountryId] = useState(countries[0]?.id ?? "");
  const [people, setPeople] = useState(1);
  const [values, setValues] = useState<Record<FieldKey, number>>({
    tickets: 0, deposit: 0, firstRent: 0, docs: 0, insurance: 0, moving: 0, reserve: 0,
  });

  const country = countries.find((c) => c.id === countryId);
  const currency = country?.currency ?? "EUR";

  const base = useMemo(
    () => Object.values(values).reduce((a, b) => a + (Number(b) || 0), 0),
    [values]
  );

  const minBudget = base;
  const comfort = Math.round(base * 1.3);
  const risky = Math.round(base * 0.8);

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
            <span className="text-sm font-medium text-slate-700">Кількість людей</span>
            <input type="number" min={1} value={people}
              onChange={(e) => setPeople(Math.max(1, +e.target.value))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          {FIELDS.map((f) => (
            <label key={f.key} className="block">
              <span className="text-sm font-medium text-slate-700">{f.label} ({currency})</span>
              <input type="number" min={0} value={values[f.key] || ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: +e.target.value }))}
                placeholder="0"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
            </label>
          ))}
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="bg-emerald text-white">
          <p className="text-sm text-emerald-50">Комфортний бюджет</p>
          <p className="mt-1 text-3xl font-bold">{formatMoney(comfort, currency)}</p>
          <p className="mt-1 text-emerald-50">≈ {formatMoney(toEur(comfort, currency), "EUR")}</p>
        </Card>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <p className="text-sm text-slate-500">Мінімальний</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{formatMoney(minBudget, currency)}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Ризиковий</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{formatMoney(risky, currency)}</p>
          </Card>
        </div>
        <Card>
          <h3 className="font-semibold text-slate-900">Чеклист переїзду</h3>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
            <li>· Закордонний паспорт та документи</li>
            <li>· Бронювання житла на перші дні</li>
            <li>· Страховка на період адаптації</li>
            <li>· Запас коштів на 2–3 місяці</li>
            <li>· Відкриття банківського рахунку</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
