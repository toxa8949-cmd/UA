"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatMoney } from "@/lib/format";
import { toEur, type Rates } from "@/lib/currency";
import {
  estimateCost,
  CATEGORY_LABELS,
  LIFESTYLE_LABELS,
  type Lifestyle,
  type CityTier,
} from "@/lib/costModel";
import { COUNTRY_CODES } from "@/lib/constants";
import type { Country } from "@/types/db";

type Props = { countries: Country[]; rates?: Rates };

export function CostOfLivingCalculator({ countries, rates }: Props) {
  const [countryId, setCountryId] = useState(countries[0]?.id ?? "");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [lifestyle, setLifestyle] = useState<Lifestyle>("standard");
  const [city, setCity] = useState<CityTier>("capital");

  const country = countries.find((c) => c.id === countryId) ?? countries[0];
  const currency = country?.currency ?? "EUR";

  const breakdown = useMemo(
    () => (country ? estimateCost(country, { adults, children, lifestyle, city }) : null),
    [country, adults, children, lifestyle, city]
  );

  const totalEur = breakdown ? toEur(breakdown.total, currency, rates) : 0;
  const maxCat = breakdown
    ? Math.max(...CATEGORY_LABELS.map((c) => breakdown[c.key]))
    : 1;

  // Порівняння з середньою зарплатою країни
  const salaryShare =
    breakdown && country?.average_salary
      ? Math.round((breakdown.total / country.average_salary) * 100)
      : null;

  if (!country || !breakdown) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      {/* ── Керування ── */}
      <Card className="h-fit">
        <div className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Країна</span>
            <select
              value={countryId}
              onChange={(e) => setCountryId(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-sand-300 px-3 py-2.5"
            >
              {countries.map((c) => (
                <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Дорослих</span>
              <input type="number" min={1} max={6} value={adults}
                onChange={(e) => setAdults(Math.min(6, Math.max(1, +e.target.value)))}
                className="mt-1.5 w-full rounded-xl border border-sand-300 px-3 py-2.5" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Дітей</span>
              <input type="number" min={0} max={6} value={children}
                onChange={(e) => setChildren(Math.min(6, Math.max(0, +e.target.value)))}
                className="mt-1.5 w-full rounded-xl border border-sand-300 px-3 py-2.5" />
            </label>
          </div>

          {/* Рівень життя */}
          <div>
            <span className="text-sm font-medium text-slate-700">Рівень життя</span>
            <div className="mt-1.5 grid grid-cols-3 gap-1.5">
              {LIFESTYLE_LABELS.map((l) => (
                <button
                  key={l.value}
                  onClick={() => setLifestyle(l.value)}
                  className={`rounded-xl border px-2 py-2 text-xs font-medium transition-colors ${
                    lifestyle === l.value
                      ? "border-emerald bg-emerald-50 text-emerald-800"
                      : "border-sand-300 text-slate-600 hover:bg-sand-100"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Місто */}
          <div>
            <span className="text-sm font-medium text-slate-700">Місто</span>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setCity("capital")}
                className={`rounded-xl border px-2 py-2 text-xs font-medium transition-colors ${
                  city === "capital" ? "border-emerald bg-emerald-50 text-emerald-800" : "border-sand-300 text-slate-600 hover:bg-sand-100"
                }`}
              >
                Столиця / велике
              </button>
              <button
                onClick={() => setCity("regional")}
                className={`rounded-xl border px-2 py-2 text-xs font-medium transition-colors ${
                  city === "regional" ? "border-emerald bg-emerald-50 text-emerald-800" : "border-sand-300 text-slate-600 hover:bg-sand-100"
                }`}
              >
                Регіон / мале
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Результат ── */}
      <div className="space-y-5">
        <Card className="border-emerald/20 bg-emerald">
          <p className="text-sm text-emerald-50">
            Орієнтовні витрати на місяць · {country.name}
          </p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-display text-4xl font-bold text-white">
              {formatMoney(breakdown.total, currency)}
            </span>
            <span className="text-lg text-emerald-50">≈ {formatMoney(totalEur, "EUR")}</span>
          </div>
          {salaryShare != null && (
            <p className="mt-2 text-sm text-emerald-50">
              Це ≈ {salaryShare}% від середньої зарплати в країні
            </p>
          )}
        </Card>

        {/* Розбивка по категоріях зі смугами */}
        <Card>
          <h3 className="font-display font-bold text-ink">Розбивка витрат</h3>
          <div className="mt-4 space-y-3">
            {CATEGORY_LABELS.map((cat) => {
              const value = breakdown[cat.key];
              const pct = Math.round((value / maxCat) * 100);
              return (
                <div key={cat.key}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{cat.label}</span>
                    <span className="font-mono font-medium text-ink">{formatMoney(value, currency)}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-sand-200">
                    <div className="h-full rounded-full bg-emerald" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <p className="text-sm text-slate-500">
          Розрахунок орієнтовний: базується на середній оренді в країні та типових
          пропорціях витрат. Реальні суми залежать від міста, звичок і конкретної
          ситуації. Курс EUR оновлюється щодня за даними ЄЦБ.
        </p>
      </div>
    </div>
  );
}
