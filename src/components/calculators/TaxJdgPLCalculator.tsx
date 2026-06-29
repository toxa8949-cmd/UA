"use client";

import { useState, useMemo } from "react";
import {
  calcPL,
  RYCZALT_RATES,
  ZUS_OPTIONS,
  PL_TAX_2026,
  type ZusType,
  type TaxResult,
} from "@/lib/taxPL";
import { ArrowUpRight, TrendingUp } from "lucide-react";

function fmt(n: number): string {
  return n.toLocaleString("pl-PL").replace(/,/g, " ") + " zł";
}

const FORM_HINTS: Record<TaxResult["form"], string> = {
  ryczalt: "Податок від обороту — витрати не зменшують податок. Але «на руки» показано вже після ваших реальних витрат.",
  liniowy: "Фіксовані 19%. Витрати зменшують і податок, і суму на руки.",
  skala: "12% до 120 000 zł/рік, 32% вище. Є kwota wolna 30 000 zł.",
};

export function TaxJdgPLCalculator() {
  const [income, setIncome] = useState(15000);
  const [ryczaltRate, setRyczaltRate] = useState(0.12);
  const [zusType, setZusType] = useState<ZusType>("full");
  const [expenses, setExpenses] = useState(0);

  const results = useMemo(
    () => calcPL(income, ryczaltRate, zusType, expenses),
    [income, ryczaltRate, zusType, expenses]
  );

  // найвигідніша форма (максимум на руки)
  const best = useMemo(
    () => results.reduce((a, b) => (b.netMonth > a.netMonth ? b : a)),
    [results]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      {/* ── Інпути ── */}
      <div className="space-y-6 rounded-2xl border border-sand-300 bg-white p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Місячний дохід (інвойс), zł
          </label>
          <input
            type="number"
            min={0}
            step={500}
            value={income}
            onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-lg border border-sand-300 px-3 py-2.5 text-lg font-semibold text-ink outline-none focus:border-emerald"
          />
          <input
            type="range"
            min={0}
            max={50000}
            step={500}
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="mt-3 w-full accent-emerald"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Ставка ryczałt (за видом діяльності)
          </label>
          <select
            value={ryczaltRate}
            onChange={(e) => setRyczaltRate(Number(e.target.value))}
            className="w-full rounded-lg border border-sand-300 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-emerald"
          >
            {RYCZALT_RATES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink">Тип ZUS</label>
          <div className="space-y-2">
            {ZUS_OPTIONS.map((z) => (
              <label
                key={z.value}
                className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 transition-colors ${
                  zusType === z.value ? "border-emerald bg-emerald-50" : "border-sand-300"
                }`}
              >
                <input
                  type="radio"
                  name="zus"
                  checked={zusType === z.value}
                  onChange={() => setZusType(z.value)}
                  className="mt-0.5 accent-emerald"
                />
                <span>
                  <span className="block text-sm font-medium text-ink">{z.label}</span>
                  <span className="block text-xs text-slate-500">{z.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Місячні витрати, zł{" "}
            <span className="font-normal text-slate-400">(для liniowy/skala)</span>
          </label>
          <input
            type="number"
            min={0}
            step={100}
            value={expenses}
            onChange={(e) => setExpenses(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-lg border border-sand-300 px-3 py-2.5 text-ink outline-none focus:border-emerald"
          />
          <p className="mt-1.5 text-xs text-slate-400">
            На ryczałt витрати не зменшують податок, але «на руки» рахується вже після них —
            щоб порівняння форм було чесним.
          </p>
        </div>
      </div>

      {/* ── Результат ── */}
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {results.map((r) => {
            const isBest = r.form === best.form;
            return (
              <div
                key={r.form}
                className={`relative rounded-2xl border p-5 ${
                  isBest ? "border-emerald bg-emerald-50" : "border-sand-300 bg-white"
                }`}
              >
                {isBest && (
                  <span className="absolute -top-2.5 left-4 inline-flex items-center gap-1 rounded-full bg-emerald px-2 py-0.5 text-xs font-medium text-white">
                    <TrendingUp size={12} /> Найвигідніше
                  </span>
                )}
                <p className="text-sm font-medium text-slate-500">{r.formLabel}</p>
                <p className="mt-1 font-display text-2xl font-bold text-ink">
                  {fmt(r.netMonth)}
                </p>
                <p className="text-xs text-slate-400">на руки / місяць</p>

                <dl className="mt-4 space-y-1.5 border-t border-sand-300 pt-3 text-xs">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">ZUS</dt>
                    <dd className="text-ink">−{fmt(Math.round(r.zusYear / 12))}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Zdrowotna</dt>
                    <dd className="text-ink">−{fmt(Math.round(r.zdrowotnaYear / 12))}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Податок</dt>
                    <dd className="text-ink">−{fmt(Math.round(r.taxYear / 12))}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs leading-relaxed text-slate-400">
                  {FORM_HINTS[r.form]}
                </p>
              </div>
            );
          })}
        </div>

        {/* Лід-форма */}
        <div className="rounded-2xl border border-emerald/30 bg-emerald-50/60 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display font-semibold text-ink">
                Потрібна допомога з ФОП (JDG) у Польщі?
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Відкриття, вибір форми оподаткування, ведення обліку — консультація
                україномовного бухгалтера.
              </p>
            </div>
          </div>
          <a
            href="/contact"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-emerald px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Отримати консультацію
            <ArrowUpRight size={15} />
          </a>
        </div>

        {/* Дисклеймер */}
        <p className="text-xs leading-relaxed text-slate-400">
          Розрахунок орієнтовний, станом на {PL_TAX_2026.year} рік. Ставки ZUS, składki
          zdrowotnej та податків змінюються; можливі індивідуальні нюанси (пільги, ліміти,
          вид діяльності). Перед прийняттям рішень звіртеся з бухгалтером або на офіційних
          ресурсах ZUS і podatki.gov.pl.
        </p>
      </div>
    </div>
  );
}
