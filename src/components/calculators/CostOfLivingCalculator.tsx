"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatMoney } from "@/lib/format";
import { toEur, type Rates } from "@/lib/currency";
import type { Country } from "@/types/db";

type Props = { countries: Country[]; rates?: Rates };

const FIELDS = [
  { key: "rent", label: "Оренда житла" },
  { key: "food", label: "Їжа та продукти" },
  { key: "transport", label: "Транспорт" },
  { key: "school", label: "Садок / школа" },
  { key: "health", label: "Медицина" },
  { key: "comms", label: "Звʼязок та інтернет" },
  { key: "other", label: "Інші витрати" },
] as const;

type FieldKey = (typeof FIELDS)[number]["key"];

export function CostOfLivingCalculator({ countries, rates }: Props) {
  const [countryId, setCountryId] = useState(countries[0]?.id ?? "");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [values, setValues] = useState<Record<FieldKey, number>>({
    rent: 0, food: 0, transport: 0, school: 0, health: 0, comms: 0, other: 0,
  });

  const country = countries.find((c) => c.id === countryId);
  const currency = country?.currency ?? "EUR";

  // Передзаповнення оренди з даних країни
  function applyDefaults(id: string) {
    const c = countries.find((x) => x.id === id);
    if (c?.average_rent) {
      setValues((v) => ({ ...v, rent: c.average_rent! }));
    }
  }

  const total = useMemo(
    () => Object.values(values).reduce((a, b) => a + (Number(b) || 0), 0),
    [values]
  );
  const totalEur = toEur(total, currency, rates);

  const level = useMemo(() => {
    const idx = country?.cost_of_living_index ?? 50;
    if (totalEur < idx * 25) return { label: "Низький", color: "emerald" as const };
    if (totalEur < idx * 45) return { label: "Середній", color: "gold" as const };
    return { label: "Високий", color: "slate" as const };
  }, [totalEur, country]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Країна</span>
            <select
              value={countryId}
              onChange={(e) => { setCountryId(e.target.value); applyDefaults(e.target.value); }}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              {countries.map((c) => (
                <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Дорослих</span>
              <input type="number" min={1} value={adults}
                onChange={(e) => setAdults(Math.max(1, +e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Дітей</span>
              <input type="number" min={0} value={children}
                onChange={(e) => setChildren(Math.max(0, +e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
            </label>
          </div>

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
          <p className="text-sm text-emerald-50">Місячні витрати ({currency})</p>
          <p className="mt-1 text-3xl font-bold">{formatMoney(total, currency)}</p>
          <p className="mt-1 text-emerald-50">≈ {formatMoney(totalEur, "EUR")}</p>
          <div className="mt-4">
            <Badge color={level.color}>Рівень витрат: {level.label}</Badge>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-slate-900">На сімʼю</h3>
          <p className="mt-1 text-sm text-slate-600">
            {adults} дорослих{children > 0 ? `, ${children} дітей` : ""}
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Розрахунок орієнтовний. Курс EUR оновлюється щодня за даними ЄЦБ. Для точних цифр
            враховуйте конкретне місто та особисті звички.
          </p>
        </Card>
      </div>
    </div>
  );
}
