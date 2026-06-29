"use client";

import { useState, useMemo } from "react";
import {
  calcCZ,
  CZ_EXPENSE_RATES,
  CZ_TAX_2026,
  type CzResult,
} from "@/lib/taxCZ";
import { ArrowUpRight, TrendingUp, Info } from "lucide-react";
import { TermHint } from "./TermHint";

function fmt(n: number): string {
  return n.toLocaleString("cs-CZ").replace(/\u00a0/g, " ") + " Kč";
}

const FORM_HINTS: Record<CzResult["form"], string> = {
  pausal_dan: "Фіксований платіж — податок, соц. і мед. внески разом. Без декларацій. Тільки якщо ви не платник DPH.",
  pausal_vydaje: "Списання % витрат без чеків — зменшує податок. Якщо реальні витрати менші, різниця залишається вам.",
  real_vydaje: "Віднімаються справжні витрати (з чеками). Вигідно, якщо витрати великі.",
};

export function TaxOsvcCZCalculator() {
  const [income, setIncome] = useState(60000);
  const [expenseRate, setExpenseRate] = useState(0.6);
  const [realExpenses, setRealExpenses] = useState(0);

  const results = useMemo(
    () => calcCZ(income, expenseRate, realExpenses),
    [income, expenseRate, realExpenses]
  );

  const best = useMemo(
    () => results.reduce((a, b) => (b.netMonth > a.netMonth ? b : a)),
    [results]
  );

  const annualTurnover = income * 12;
  const overVat = annualTurnover > CZ_TAX_2026.vatThreshold;

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      {/* ── Інпути ── */}
      <div className="space-y-6 rounded-2xl border border-sand-300 bg-white p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Місячний дохід (інвойс), Kč
          </label>
          <input
            type="number"
            min={0}
            step={2000}
            value={income}
            onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-lg border border-sand-300 px-3 py-2.5 text-lg font-semibold text-ink outline-none focus:border-emerald"
          />
          <input
            type="range"
            min={0}
            max={200000}
            step={2000}
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="mt-3 w-full accent-emerald"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            <TermHint label="Паушальні витрати" hint="Výdajový paušál — списання % доходу як витрат без чеків, для зменшення податку. Чим вищий %, тим менший податок." /> (за видом діяльності)
          </label>
          <select
            value={expenseRate}
            onChange={(e) => setExpenseRate(Number(e.target.value))}
            className="w-full rounded-lg border border-sand-300 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-emerald"
          >
            {CZ_EXPENSE_RATES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Реальні витрати, Kč/міс{" "}
            <span className="font-normal text-slate-400">(для режиму реальних витрат)</span>
          </label>
          <input
            type="number"
            min={0}
            step={1000}
            value={realExpenses}
            onChange={(e) => setRealExpenses(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-lg border border-sand-300 px-3 py-2.5 text-ink outline-none focus:border-emerald"
          />
          <p className="mt-1.5 text-xs text-slate-400">
            Паушальні витрати — це списання без чеків. Реальні витрати вводьте лише для
            режиму справжніх витрат (з документами).
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
                  {r.form === "pausal_dan" ? (
                    <div className="flex justify-between">
                      <dt className="text-slate-500"><TermHint label="Платіж (усе разом)" hint="Paušální daň — єдиний фіксований платіж за місяць, що включає податок, соціальне й медичне страхування разом." /></dt>
                      <dd className="text-ink">−{fmt(Math.round(r.taxYear / 12))}</dd>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <dt className="text-slate-500"><TermHint label="Sociální" hint="Sociální pojištění — соціальне страхування (пенсійне + на хворобу). Рахується від частки прибутку, є мінімальний внесок." /></dt>
                        <dd className="text-ink">−{fmt(Math.round(r.socialYear / 12))}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-500"><TermHint label="Zdravotní" hint="Zdravotní pojištění — медичне страхування. Рахується від частки прибутку, є мінімальний внесок." /></dt>
                        <dd className="text-ink">−{fmt(Math.round(r.healthYear / 12))}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-500"><TermHint label="Daň z příjmů" hint="Daň z příjmů — прибутковий податок. 15% (23% на високі доходи), зменшується на sleva na poplatníka." /></dt>
                        <dd className="text-ink">−{fmt(Math.round(r.taxYear / 12))}</dd>
                      </div>
                    </>
                  )}
                </dl>
                <p className="mt-3 text-xs leading-relaxed text-slate-400">
                  {FORM_HINTS[r.form]}
                </p>
              </div>
            );
          })}
        </div>

        {/* Попередження про DPH */}
        {overVat && (
          <div className="flex items-start gap-3 rounded-2xl border border-gold-500/40 bg-gold-50/60 p-4">
            <Info size={18} className="mt-0.5 shrink-0 text-gold-500" />
            <div className="text-sm leading-relaxed text-ink">
              <p className="font-medium">
                При обороті понад {fmt(CZ_TAX_2026.vatThreshold)}/рік потрібна реєстрація платником DPH
              </p>
              <p className="mt-1 text-slate-600">
                DPH (ПДВ) <strong>не зменшує ваш дохід</strong> — ви додаєте його до ціни й
                перераховуєте державі. Але з'являється обов'язок звітності. Також paušální daň
                доступний лише не платникам DPH. Уточніть у бухгалтера.
              </p>
            </div>
          </div>
        )}

        {/* Лід-форма */}
        <div className="rounded-2xl border border-emerald/30 bg-emerald-50/60 p-5">
          <p className="font-display font-semibold text-ink">
            Потрібна допомога з OSVČ у Чехії?
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Реєстрація živnostenský list, вибір режиму, ведення обліку — консультація
            україномовного бухгалтера.
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
          Розрахунок орієнтовний, станом на {CZ_TAX_2026.year} рік. Ставки sociálního a
          zdravotního pojištění, податків і суми paušální daň змінюються; можливі індивідуальні
          нюанси (вид діяльності, ліміти, перший рік). Перед прийняттям рішень звіртеся з
          бухгалтером або на офіційних ресурсах financnisprava.cz, cssz.cz.
        </p>
      </div>
    </div>
  );
}
