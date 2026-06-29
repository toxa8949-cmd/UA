"use client";

import { useState, useMemo } from "react";
import { calcSalaryPL, calcZleceniePL, SALARY_PL_2026 } from "@/lib/salaryPL";
import { ArrowUpRight, Info } from "lucide-react";

function fmt(n: number): string {
  return Math.round(n).toLocaleString("en-US").replace(/,/g, "\u00a0") + " zł";
}

type Contract = "uop" | "zlecenie";

export function SalaryNettoBruttoPLCalculator() {
  const [brutto, setBrutto] = useState(8000);
  const [contract, setContract] = useState<Contract>("uop");
  // UoP options
  const [under26, setUnder26] = useState(false);
  const [elevatedKup, setElevatedKup] = useState(false);
  // Zlecenie options
  const [student, setStudent] = useState(false);
  const [chorobowa, setChorobowa] = useState(true);

  const uop = useMemo(
    () => calcSalaryPL(brutto, under26, elevatedKup, true),
    [brutto, under26, elevatedKup]
  );
  const zlec = useMemo(
    () => calcZleceniePL(brutto, student, chorobowa, true),
    [brutto, student, chorobowa]
  );

  const isZlec = contract === "zlecenie";
  const r = isZlec ? zlec : uop;
  const effectiveRate = brutto > 0 ? Math.round((1 - r.nettoMonth / brutto) * 100) : 0;
  const studentExempt = isZlec && zlec.isStudentExempt && zlec.pitYear === 0;

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

        {/* Тип договору */}
        <div>
          <span className="mb-2 block text-sm font-medium text-ink">Тип договору</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setContract("uop")}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                !isZlec ? "border-emerald bg-emerald-50 text-ink" : "border-sand-300 text-slate-500"
              }`}
            >
              Umowa o pracę
            </button>
            <button
              onClick={() => setContract("zlecenie")}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                isZlec ? "border-emerald bg-emerald-50 text-ink" : "border-sand-300 text-slate-500"
              }`}
            >
              Umowa zlecenie
            </button>
          </div>
        </div>

        {/* Опції UoP */}
        {!isZlec && (
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
        )}

        {/* Опції Zlecenie */}
        {isZlec && (
          <div className="space-y-2">
            <label
              className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 ${
                student ? "border-emerald bg-emerald-50" : "border-sand-300"
              }`}
            >
              <input
                type="checkbox"
                checked={student}
                onChange={(e) => setStudent(e.target.checked)}
                className="mt-0.5 accent-emerald"
              />
              <span>
                <span className="block text-sm font-medium text-ink">Студент до 26 років</span>
                <span className="block text-xs text-slate-500">
                  ZUS = 0, zdrowotna = 0, PIT = 0 → netto ≈ brutto
                </span>
              </span>
            </label>
            {!student && (
              <label
                className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 ${
                  chorobowa ? "border-emerald bg-emerald-50" : "border-sand-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={chorobowa}
                  onChange={(e) => setChorobowa(e.target.checked)}
                  className="mt-0.5 accent-emerald"
                />
                <span>
                  <span className="block text-sm font-medium text-ink">
                    Dobrowolna chorobowa (2,45%)
                  </span>
                  <span className="block text-xs text-slate-500">
                    Добровільний внесок на хворобу — за заявою
                  </span>
                </span>
              </label>
            )}
          </div>
        )}
      </div>

      {/* ── Результат ── */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-emerald bg-emerald-50 p-6">
          <p className="text-sm font-medium text-slate-500">
            {isZlec ? "Umowa zlecenie" : "Umowa o pracę"}
          </p>
          <p className="mt-1 font-display text-4xl font-bold text-ink">
            {fmt(r.nettoMonth)}
            <span className="ml-2 text-base font-normal text-slate-400">netto / місяць</span>
          </p>

          {studentExempt && (
            <p className="mt-3 rounded-lg bg-white/70 p-3 text-xs leading-relaxed text-slate-600">
              Студент до 26 на zlecenie звільнений від ZUS, zdrowotnej і PIT — на руки майже вся
              сума brutto. Звільнення PIT діє до {fmt(SALARY_PL_2026.pit.ulgaDlaMlodychLimit)}/рік;
              надлишок оподатковується.
            </p>
          )}

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-slate-500">Утримання разом</p>
              <p className="mt-1 font-display text-lg font-bold text-ink">{effectiveRate}%</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-slate-500">Netto за рік</p>
              <p className="mt-1 font-display text-lg font-bold text-ink">{fmt(r.nettoYear)}</p>
            </div>
          </div>

          <dl className="mt-4 space-y-1.5 border-t border-emerald/20 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Brutto / місяць</dt>
              <dd className="text-ink">{fmt(r.bruttoMonth)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">ZUS {isZlec ? "zleceniobiorcy" : "працівника"}</dt>
              <dd className="text-ink">−{fmt(r.zusYear / 12)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Składka zdrowotna</dt>
              <dd className="text-ink">−{fmt(r.zdrowotnaYear / 12)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">PIT</dt>
              <dd className="text-ink">−{fmt(r.pitYear / 12)}</dd>
            </div>
          </dl>

          {!isZlec && (
            <p className="mt-4 rounded-lg bg-white/70 p-3 text-xs leading-relaxed text-slate-600">
              Повна вартість для роботодавця:{" "}
              <strong className="text-ink">{fmt(uop.employerCostMonth)}/міс</strong>{" "}
              (brutto + ~{Math.round(SALARY_PL_2026.employerTotal * 100)}% внесків роботодавця).
            </p>
          )}
        </div>

        {/* Лід-форма */}
        <div className="rounded-2xl border border-emerald/30 bg-emerald-50/60 p-5">
          <p className="font-display font-semibold text-ink">
            Шукаєте роботу або консультацію щодо зарплати в Польщі?
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Питання про umowa o pracę, zlecenie, B2B vs etat, легалізацію доходу — консультація
            фахівця.
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
          Розрахунок орієнтовний, станом на {SALARY_PL_2026.year} рік, з PIT-2. Для umowa o pracę —
          koszty standardowe/podwyższone; для umowa zlecenie — koszty 20%, chorobowa добровільна.
          Не враховує PPK, авторських 50% KUP, спільного декларування. Розрахунок річний (з
          переходом на 32% після {fmt(SALARY_PL_2026.pit.threshold)}), поділений на 12. Точні суми —
          у кадровика або на podatki.gov.pl.
        </p>
      </div>
    </div>
  );
}
