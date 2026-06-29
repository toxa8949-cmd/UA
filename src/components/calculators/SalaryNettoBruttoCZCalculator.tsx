"use client";

import { useState, useMemo } from "react";
import { calcSalaryCZ, SALARY_CZ_2026 } from "@/lib/salaryCZ";
import { ArrowUpRight } from "lucide-react";
import { TermHint } from "./TermHint";
import { EurHint } from "./EurHint";

function fmt(n: number): string {
  return Math.round(n).toLocaleString("en-US").replace(/,/g, "\u00a0") + " Kč";
}

export function SalaryNettoBruttoCZCalculator({ eurRate = 0.04 }: { eurRate?: number }) {
  const [brutto, setBrutto] = useState(50000);
  const [children, setChildren] = useState(0);

  const result = useMemo(() => calcSalaryCZ(brutto, children), [brutto, children]);

  const effectiveRate = brutto > 0
    ? Math.round((1 - result.nettoMonth / brutto) * 100)
    : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      {/* ── Інпути ── */}
      <div className="space-y-6 rounded-2xl border border-sand-300 bg-white p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Hrubá mzda (brutto), Kč/міс
          </label>
          <input
            type="number"
            min={0}
            step={2000}
            value={brutto}
            onChange={(e) => setBrutto(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-lg border border-sand-300 px-3 py-2.5 text-lg font-semibold text-ink outline-none focus:border-emerald"
          />
          <input
            type="range"
            min={0}
            max={200000}
            step={2000}
            value={brutto}
            onChange={(e) => setBrutto(Number(e.target.value))}
            className="mt-3 w-full accent-emerald"
          />
          <p className="mt-2 text-xs text-slate-400">
            Мінімальна зарплата 2026: {fmt(SALARY_CZ_2026.minimumWage)} brutto
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Кількість дітей <span className="font-normal text-slate-400">(sleva na dítě)</span>
          </label>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setChildren(n)}
                className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                  children === n
                    ? "border-emerald bg-emerald-50 text-ink"
                    : "border-sand-300 text-slate-600"
                }`}
              >
                {n === 4 ? "4+" : n}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            Дитяча пільга зменшує податок, а якщо перевищує його — повертається як daňový bonus.
          </p>
        </div>
      </div>

      {/* ── Результат ── */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-emerald bg-emerald-50 p-6">
          <p className="text-sm font-medium text-slate-500">HPP (hlavní pracovní poměr)</p>
          <p className="mt-1 font-display text-4xl font-bold text-ink">
            {fmt(result.nettoMonth)}
            <span className="ml-2 text-base font-normal text-slate-400">čistá / місяць</span>
            <EurHint amount={result.nettoMonth} eurRate={eurRate} />
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-slate-500">Утримання разом</p>
              <p className="mt-1 font-display text-lg font-bold text-ink">{effectiveRate}%</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-slate-500">Čistá за рік</p>
              <p className="mt-1 font-display text-lg font-bold text-ink">{fmt(result.nettoYear)}<EurHint amount={result.nettoYear} eurRate={eurRate} /></p>
            </div>
          </div>

          <dl className="mt-4 space-y-1.5 border-t border-emerald/20 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Hrubá mzda / місяць</dt>
              <dd className="text-ink">{fmt(result.bruttoMonth)}<EurHint amount={result.bruttoMonth} eurRate={eurRate} /></dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500"><TermHint label="Sociální (7,1%)" hint="Sociální pojištění працівника (7,1%) — пенсійне та на хворобу. Решту (24,8%) платить роботодавець окремо." /></dt>
              <dd className="text-ink">−{fmt(result.socialMonth)}<EurHint amount={result.socialMonth} eurRate={eurRate} /></dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500"><TermHint label="Zdravotní (4,5%)" hint="Zdravotní pojištění працівника (4,5%) — медичне. Решту (9%) платить роботодавець." /></dt>
              <dd className="text-ink">−{fmt(result.healthMonth)}<EurHint amount={result.healthMonth} eurRate={eurRate} /></dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">
                Daň po slevě{children > 0 ? " (з пільгою на дітей)" : ""}
              </dt>
              <dd className="text-ink">
                {result.taxMonth < 0 ? "+" : "−"}{fmt(Math.abs(result.taxMonth))}
                <EurHint amount={Math.abs(result.taxMonth)} eurRate={eurRate} />
              </dd>
            </div>
          </dl>

          {result.taxMonth < 0 && (
            <p className="mt-4 rounded-lg bg-white/70 p-3 text-xs leading-relaxed text-slate-600">
              Дитяча пільга перевищує податок — різниця повертається як{" "}
              <strong className="text-ink">daňový bonus</strong> (доплата до зарплати).
            </p>
          )}

          <p className="mt-4 rounded-lg bg-white/70 p-3 text-xs leading-relaxed text-slate-600">
            Повна вартість для роботодавця:{" "}
            <strong className="text-ink">{fmt(result.employerCostMonth)}/міс</strong>{" "}
            (hrubá + {Math.round(SALARY_CZ_2026.employerTotal * 100)}% внесків роботодавця).
          </p>
        </div>

        {/* Лід-форма */}
        <div className="rounded-2xl border border-emerald/30 bg-emerald-50/60 p-5">
          <p className="font-display font-semibold text-ink">
            Шукаєте роботу або консультацію щодо зарплати в Чехії?
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Питання про HPP, dohody (DPP/DPČ), OSVČ vs zaměstnanec, легалізацію доходу —
            консультація фахівця.
          </p>
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
          Розрахунок орієнтовний, станом на {SALARY_CZ_2026.year} рік, для HPP із sleva na
          poplatníka. Не враховує інших slev (на подружжя, інвалідність, студента-платника),
          dohod (DPP/DPČ) та бонусів. 23% застосовується до частини понад{" "}
          {fmt(SALARY_CZ_2026.thresholdMonthly)}/міс. Точні суми — у mzdové účetní або на
          financnisprava.cz.
        </p>
      </div>
    </div>
  );
}
