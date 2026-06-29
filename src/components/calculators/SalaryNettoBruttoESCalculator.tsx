"use client";

import { useState, useMemo } from "react";
import { calcSalaryES, SALARY_ES_2026 } from "@/lib/salaryES";
import { ArrowUpRight } from "lucide-react";
import { TermHint } from "./TermHint";

function fmt(n: number): string {
  return "€" + Math.round(n).toLocaleString("en-US").replace(/,/g, "\u00a0");
}

export function SalaryNettoBruttoESCalculator() {
  const [bruto, setBruto] = useState(30000);
  const [payments, setPayments] = useState(14);
  const [indefinido, setIndefinido] = useState(true);
  const [children, setChildren] = useState(0);

  const result = useMemo(
    () => calcSalaryES(bruto, payments, indefinido, children),
    [bruto, payments, indefinido, children]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      {/* ── Інпути ── */}
      <div className="space-y-6 rounded-2xl border border-sand-300 bg-white p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Bruto, €/рік
          </label>
          <input
            type="number"
            min={0}
            step={1000}
            value={bruto}
            onChange={(e) => setBruto(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-lg border border-sand-300 px-3 py-2.5 text-lg font-semibold text-ink outline-none focus:border-emerald"
          />
          <input
            type="range"
            min={0}
            max={100000}
            step={1000}
            value={bruto}
            onChange={(e) => setBruto(Number(e.target.value))}
            className="mt-3 w-full accent-emerald"
          />
          <p className="mt-2 text-xs text-slate-400">
            В Іспанії зарплату зазвичай вказують річну (bruto anual). SMI 2026:{" "}
            {fmt(SALARY_ES_2026.smiMonthly)}/міс ×14.
          </p>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-ink">
            <TermHint
              label="Кількість виплат"
              hint="В Іспанії зарплату часто ділять на 14 виплат (12 місяців + 2 extra влітку й на Різдво) або 12 (prorrateadas). Річна сума однакова, різниться лише місячна."
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
                {p} pagas
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-ink">Тип договору</span>
          <div className="flex gap-2">
            <button
              onClick={() => setIndefinido(true)}
              className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                indefinido ? "border-emerald bg-emerald-50 text-ink" : "border-sand-300 text-slate-600"
              }`}
            >
              Indefinido
            </button>
            <button
              onClick={() => setIndefinido(false)}
              className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                !indefinido ? "border-emerald bg-emerald-50 text-ink" : "border-sand-300 text-slate-600"
              }`}
            >
              Temporal
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Кількість дітей{" "}
            <span className="font-normal text-slate-400">(mínimo familiar)</span>
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
        </div>
      </div>

      {/* ── Результат ── */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-emerald bg-emerald-50 p-6">
          <p className="text-sm font-medium text-slate-500">Salario neto</p>
          <p className="mt-1 font-display text-4xl font-bold text-ink">
            {fmt(result.netoPerPayment)}
            <span className="ml-2 text-base font-normal text-slate-400">
              neto / виплата (×{result.payments})
            </span>
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-slate-500">Утримання разом</p>
              <p className="mt-1 font-display text-lg font-bold text-ink">{result.effectiveRate}%</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-slate-500">Neto за рік</p>
              <p className="mt-1 font-display text-lg font-bold text-ink">{fmt(result.netoAnnual)}</p>
            </div>
          </div>

          <dl className="mt-4 space-y-1.5 border-t border-emerald/20 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Bruto / рік</dt>
              <dd className="text-ink">{fmt(result.brutoAnnual)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">
                <TermHint
                  label="Seguridad Social"
                  hint="Соцвнески працівника (~6.5%): contingencias comunes, desempleo, FP, MEI. Решту (~30%) платить роботодавець."
                />
              </dt>
              <dd className="text-ink">−{fmt(result.socialAnnual)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">
                <TermHint
                  label="IRPF (retención)"
                  hint="Прибутковий податок, що утримується із зарплати. Прогресивний, з урахуванням mínimo personal y familiar."
                />
              </dt>
              <dd className="text-ink">−{fmt(result.irpfAnnual)}</dd>
            </div>
          </dl>
        </div>

        {/* Лід-форма */}
        <div className="rounded-2xl border border-emerald/30 bg-emerald-50/60 p-5">
          <p className="font-display font-semibold text-ink">
            Шукаєте роботу або консультацію щодо зарплати в Іспанії?
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Питання про nómina, contrato, IRPF, Seguridad Social — консультація україномовного
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
          Розрахунок орієнтовний, станом на {SALARY_ES_2026.year} рік. IRPF має регіональну
          частину (Comunidad Autónoma) — тут загальна шкала. Не враховує всіх особистих
          відрахувань, пенсійних планів, situación familiar conjunta. Точні суми — у asesor
          laboral або на agenciatributaria.es.
        </p>
      </div>
    </div>
  );
}
