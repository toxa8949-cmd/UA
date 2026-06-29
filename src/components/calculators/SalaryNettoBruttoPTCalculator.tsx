"use client";

import { useState, useMemo } from "react";
import { calcSalaryPT, SALARY_PT_2026 } from "@/lib/salaryPT";
import { ArrowUpRight } from "lucide-react";
import { TermHint } from "./TermHint";

function fmt(n: number): string {
  return "€" + Math.round(n).toLocaleString("en-US").replace(/,/g, "\u00a0");
}
function fmtCents(n: number): string {
  const whole = Math.floor(n);
  const cents = Math.round((n - whole) * 100);
  return "€" + whole.toLocaleString("en-US").replace(/,/g, "\u00a0") + "," + String(cents).padStart(2, "0");
}

export function SalaryNettoBruttoPTCalculator() {
  const [bruto, setBruto] = useState(1500);
  const [payments, setPayments] = useState(14);

  const result = useMemo(() => calcSalaryPT(bruto, payments), [bruto, payments]);

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      {/* ── Інпути ── */}
      <div className="space-y-6 rounded-2xl border border-sand-300 bg-white p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Salário ilíquido (bruto), €/міс
          </label>
          <input
            type="number"
            min={0}
            step={100}
            value={bruto}
            onChange={(e) => setBruto(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-lg border border-sand-300 px-3 py-2.5 text-lg font-semibold text-ink outline-none focus:border-emerald"
          />
          <input
            type="range"
            min={0}
            max={8000}
            step={100}
            value={bruto}
            onChange={(e) => setBruto(Number(e.target.value))}
            className="mt-3 w-full accent-emerald"
          />
          <p className="mt-2 text-xs text-slate-400">
            Salário mínimo 2026: {fmt(SALARY_PT_2026.minimumWage)}/міс ×14.
          </p>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-ink">
            <TermHint
              label="Кількість виплат"
              hint="У Португалії — 14 виплат: 12 місяців + subsídio de férias (відпускні) + subsídio de Natal (різдвяні). Або 12 (subsídios prorrateados). Річна сума однакова."
            />
          </span>
          <div className="flex gap-2">
            {[12, 14].map((p) => (
              <button
                key={p}
                onClick={() => setPayments(p)}
                className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                  payments === p
                    ? "border-emerald bg-emerald-50 text-ink"
                    : "border-sand-300 text-slate-600"
                }`}
              >
                {p} виплат
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Результат ── */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-emerald bg-emerald-50 p-6">
          <p className="text-sm font-medium text-slate-500">Salário líquido</p>
          <p className="mt-1 font-display text-4xl font-bold text-ink">
            {fmtCents(result.liquidoPerPayment)}
            <span className="ml-2 text-base font-normal text-slate-400">
              líquido / виплата (×{result.payments})
            </span>
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-slate-500">Утримання разом</p>
              <p className="mt-1 font-display text-lg font-bold text-ink">{result.effectiveRate}%</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-slate-500">Líquido за рік (14)</p>
              <p className="mt-1 font-display text-lg font-bold text-ink">{fmt(result.liquidoAnnual)}</p>
            </div>
          </div>

          <dl className="mt-4 space-y-1.5 border-t border-emerald/20 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Ilíquido / місяць</dt>
              <dd className="text-ink">{fmt(result.brutoMonth)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">
                <TermHint
                  label="Segurança Social"
                  hint="Соцвнесок працівника — фіксовані 11% від ilíquido. Роботодавець доплачує ще 23,75%."
                />
              </dt>
              <dd className="text-ink">−{fmtCents(result.socialMonth)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">
                <TermHint
                  label="IRS (retenção na fonte)"
                  hint="Податок, що утримується із зарплати за офіційними таблицями retenção (Tabela I). Залежить від зарплати й сімейного стану."
                />
              </dt>
              <dd className="text-ink">−{fmtCents(result.irsMonth)}</dd>
            </div>
          </dl>
        </div>

        {/* Лід-форма */}
        <div className="rounded-2xl border border-emerald/30 bg-emerald-50/60 p-5">
          <p className="font-display font-semibold text-ink">
            Шукаєте роботу або консультацію щодо зарплати в Португалії?
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Питання про contrato de trabalho, IRS, Segurança Social, recibos verdes vs
            contrato — консультація фахівця.
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
          Розрахунок орієнтовний, станом на {SALARY_PT_2026.year} рік, за таблицею retenção
          Tabela I (não casado, sem dependentes, Continente). Не враховує утриманців
          (dependentes), casado único titular, Madeira/Açores, subsídio de alimentação та інших
          складових. Точні суми — у contabilista або на portaldasfinancas.gov.pt.
        </p>
      </div>
    </div>
  );
}
