"use client";

import { useState, useMemo } from "react";
import { calcSalaryPL, SALARY_PL_2026 } from "@/lib/salaryPL";
import { ArrowUpRight, Info } from "lucide-react";

function fmt(n: number): string {
  return Math.round(n).toLocaleString("en-US").replace(/,/g, "\u00a0") + " zł";
}

export function SalaryNettoBruttoPLCalculator() {
  const [brutto, setBrutto] = useState(8000);
  const [under26, setUnder26] = useState(false);
  const [elevatedKup, setElevatedKup] = useState(false);

  const result = useMemo(
    () => calcSalaryPL(brutto, under26, elevatedKup, true),
    [brutto, under26, elevatedKup]
  );

  const effectiveRate = brutto > 0
    ? Math.round((1 - result.nettoMonth / brutto) * 100)
    : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      {/* ── Інпути ── */}
      <div className="space-y-6 rounded-2xl border border-sand-300 bg-white p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Зарплата brutto, zł/міс
          </label>
          <input
            type="number"
            min={0}
            step={250}
            value={brutto}
            onChange={(e) => setBrutto(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-lg border border-sand-300 px-3 py-2.5 text-lg font-semibold text-ink outline-none focus:border-emerald"
          />
          <input
            type="range"
            min={0}
            max={30000}
            step={250}
            value={brutto}
            onChange={(e) => setBrutto(Number(e.target.value))}
            className="mt-3 w-full accent-emerald"
          />
          <p className="mt-2 text-xs text-slate-400">
            Мінімальна зарплата 2026: {fmt(SALARY_PL_2026.minimumWage)} brutto
          </p>
        </div>

        <div className="space-y-2">
          <label
            className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 ${
              under26 ? "border-emerald bg-emerald-50" : "border-sand-300"
            }`}
          >
            <input
              type="checkbox"
              checked={under26}
              onChange={(e) => setUnder26(e.target.checked)}
              className="mt-0.5 accent-emerald"
            />
            <span>
              <span className="block text-sm font-medium text-ink">Вік до 26 років</span>
              <span className="block text-xs text-slate-500">
                Ulga dla młodych — 0% PIT до {fmt(SALARY_PL_2026.pit.ulgaDlaMlodychLimit)}/рік
              </span>
            </span>
          </label>

          <label
            className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 ${
              elevatedKup ? "border-emerald bg-emerald-50" : "border-sand-300"
            }`}
          >
            <input
              type="checkbox"
              checked={elevatedKup}
              onChange={(e) => setElevatedKup(e.target.checked)}
              className="mt-0.5 accent-emerald"
            />
            <span>
              <span className="block text-sm font-medium text-ink">Іногородній працівник</span>
              <span className="block text-xs text-slate-500">
                Підвищені koszty uzyskania (300 zł/міс)
              </span>
            </span>
          </label>
        </div>
      </div>

      {/* ── Результат ── */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-emerald bg-emerald-50 p-6">
          <p className="text-sm font-medium text-slate-500">Umowa o pracę</p>
          <p className="mt-1 font-display text-4xl font-bold text-ink">
            {fmt(result.nettoMonth)}
            <span className="ml-2 text-base font-normal text-slate-400">netto / місяць</span>
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-slate-500">Утримання разом</p>
              <p className="mt-1 font-display text-lg font-bold text-ink">{effectiveRate}%</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-slate-500">Netto за рік</p>
              <p className="mt-1 font-display text-lg font-bold text-ink">{fmt(result.nettoYear)}</p>
            </div>
          </div>

          <dl className="mt-4 space-y-1.5 border-t border-emerald/20 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Brutto / місяць</dt>
              <dd className="text-ink">{fmt(result.bruttoMonth)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">ZUS працівника</dt>
              <dd className="text-ink">−{fmt(result.zusYear / 12)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Składka zdrowotna</dt>
              <dd className="text-ink">−{fmt(result.zdrowotnaYear / 12)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">PIT</dt>
              <dd className="text-ink">−{fmt(result.pitYear / 12)}</dd>
            </div>
          </dl>

          <p className="mt-4 rounded-lg bg-white/70 p-3 text-xs leading-relaxed text-slate-600">
            Повна вартість для роботодавця:{" "}
            <strong className="text-ink">{fmt(result.employerCostMonth)}/міс</strong>{" "}
            (brutto + ~{Math.round(SALARY_PL_2026.employerTotal * 100)}% внесків роботодавця).
          </p>
        </div>

        {/* Лід-форма */}
        <div className="rounded-2xl border border-emerald/30 bg-emerald-50/60 p-5">
          <p className="font-display font-semibold text-ink">
            Шукаєте роботу або консультацію щодо зарплати в Польщі?
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Питання про umowa o pracę, B2B vs etat, легалізацію доходу — консультація фахівця.
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
          Розрахунок орієнтовний, станом на {SALARY_PL_2026.year} рік, для umowa o pracę з PIT-2.
          Не враховує PPK, авторських 50% KUP, спільного декларування з подружжям та інших пільг.
          Розрахунок річний (з урахуванням переходу на 32% після{" "}
          {fmt(SALARY_PL_2026.pit.threshold)}), поділений на 12. Точні суми — у кадровика або на
          podatki.gov.pl.
        </p>
      </div>
    </div>
  );
}
