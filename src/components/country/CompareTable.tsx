"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { formatMoney } from "@/lib/format";
import type { Country } from "@/types/db";

type Props = { countries: Country[] };

const ROWS: { label: string; get: (c: Country) => string }[] = [
  { label: "Столиця", get: (c) => c.capital ?? "—" },
  { label: "Валюта", get: (c) => c.currency ?? "—" },
  { label: "Мова", get: (c) => c.language ?? "—" },
  { label: "Середня зарплата", get: (c) => c.average_salary != null && c.currency ? formatMoney(c.average_salary, c.currency) : "—" },
  { label: "Мінімальна зарплата", get: (c) => c.minimum_salary != null && c.currency ? formatMoney(c.minimum_salary, c.currency) : "—" },
  { label: "Середня оренда", get: (c) => c.average_rent != null && c.currency ? formatMoney(c.average_rent, c.currency) : "—" },
  { label: "Індекс вартості життя", get: (c) => c.cost_of_living_index != null ? String(c.cost_of_living_index) : "—" },
  { label: "Податки", get: (c) => c.tax_summary ?? "—" },
  { label: "Бізнес", get: (c) => c.business_summary ?? "—" },
  { label: "Медицина", get: (c) => c.healthcare_summary ?? "—" },
];

export function CompareTable({ countries }: Props) {
  const [selected, setSelected] = useState<string[]>(
    countries.slice(0, 2).map((c) => c.id)
  );

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 5) return prev;
      return [...prev, id];
    });
  }

  const chosen = countries.filter((c) => selected.includes(c.id));

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {countries.map((c) => {
          const active = selected.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => toggle(c.id)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-brand-600 bg-brand-50 text-brand-700"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {c.emoji} {c.name}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-slate-500">Оберіть від 2 до 5 країн для порівняння.</p>

      {chosen.length >= 2 ? (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-44 border-b border-slate-200 p-3 text-left text-slate-500"></th>
                {chosen.map((c) => (
                  <th key={c.id} className="border-b border-slate-200 p-3 text-left font-semibold text-slate-900">
                    {c.emoji} {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label} className="align-top">
                  <td className="border-b border-slate-100 p-3 font-medium text-slate-600">{row.label}</td>
                  {chosen.map((c) => (
                    <td key={c.id} className="border-b border-slate-100 p-3 text-slate-700">{row.get(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Card className="mt-6">
          <p className="text-slate-500">Оберіть щонайменше дві країни, щоб побачити порівняння.</p>
        </Card>
      )}
    </div>
  );
}
