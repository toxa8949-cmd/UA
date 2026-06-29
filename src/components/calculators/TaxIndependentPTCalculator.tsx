"use client";

import { useState, useMemo } from "react";
import { calcPT, PT_COEFFICIENTS, PT_TAX_2026 } from "@/lib/taxPT";
import { ArrowUpRight, Info } from "lucide-react";

function fmt(n: number): string {
  return "€" + Math.round(n).toLocaleString("en-US").replace(/,/g, "\u00a0");
}

export function TaxIndependentPTCalculator() {
  const [income, setIncome] = useState(3000);
  const [coefficient, setCoefficient] = useState(0.75);
  const [firstYear, setFirstYear] = useState(false);

  const result = useMemo(
    () => calcPT(income, coefficient, firstYear),
    [income, coefficient, firstYear]
  );

  // для порівняння: скільки було б без пільги новачка
  const normal = useMemo(
    () => calcPT(income, coefficient, false),
    [income, coefficient]
  );

  const annualTurnover = income * 12;
  const overIva = annualTurnover > PT_TAX_2026.ivaThreshold;

  const rows = [
    { label: "Segurança Social", value: result.ssYear },
    { label: "IRS", value: result.irsYear },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      {/* ── Інпути ── */}
      <div className="space-y-6 rounded-2xl border border-sand-300 bg-white p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Місячний дохід, €
          </label>
          <input
            type="number"
            min={0}
            step={250}
            value={income}
            onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-lg border border-sand-300 px-3 py-2.5 text-lg font-semibold text-ink outline-none focus:border-emerald"
          />
          <input
            type="range"
            min={0}
            max={10000}
            step={250}
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="mt-3 w-full accent-emerald"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Коефіцієнт (за видом діяльності)
          </label>
          <select
            value={coefficient}
            onChange={(e) => setCoefficient(Number(e.target.value))}
            className="w-full rounded-lg border border-sand-300 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-emerald"
          >
            {PT_COEFFICIENTS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-slate-400">
            Оподатковується не весь дохід, а його частина: дохід × коефіцієнт.
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-sand-300 p-3">
          <input
            type="checkbox"
            checked={firstYear}
            onChange={(e) => setFirstYear(e.target.checked)}
            className="mt-0.5 accent-emerald"
          />
          <span>
            <span className="block text-sm font-medium text-ink">Перший рік діяльності</span>
            <span className="block text-xs text-slate-500">
              Коефіцієнт −50%, звільнення від Segurança Social перші 12 місяців
            </span>
          </span>
        </label>
      </div>

      {/* ── Результат ── */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-emerald bg-emerald-50 p-6">
          <p className="text-sm font-medium text-slate-500">Regime simplificado</p>
          <p className="mt-1 font-display text-4xl font-bold text-ink">
            {fmt(result.netMonth)}
            <span className="ml-2 text-base font-normal text-slate-400">на руки / місяць</span>
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-slate-500">База IRS (дохід × коеф.)</p>
              <p className="mt-1 font-display text-lg font-bold text-ink">
                {fmt(result.irsBase)}<span className="text-xs font-normal text-slate-400"> /рік</span>
              </p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-slate-500">На руки за рік</p>
              <p className="mt-1 font-display text-lg font-bold text-ink">{fmt(result.netYear)}</p>
            </div>
          </div>

          <dl className="mt-4 space-y-1.5 border-t border-emerald/20 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Дохід / рік</dt>
              <dd className="text-ink">{fmt(result.grossYear)}</dd>
            </div>
            {rows.map((r) => (
              <div key={r.label} className="flex justify-between">
                <dt className="text-slate-500">{r.label}</dt>
                <dd className="text-ink">−{fmt(r.value)}</dd>
              </div>
            ))}
          </dl>

          {firstYear && (
            <p className="mt-4 rounded-lg bg-white/70 p-3 text-xs leading-relaxed text-slate-600">
              З пільгою новачка ви економите{" "}
              <strong className="text-ink">{fmt(result.netYear - normal.netYear)}/рік</strong>{" "}
              порівняно зі звичайним режимом ({fmt(normal.netMonth)}/міс). Пільга діє обмежений
              час — після нього розрахунок повертається до звичайного.
            </p>
          )}
        </div>

        {/* Попередження про IVA */}
        {overIva && (
          <div className="flex items-start gap-3 rounded-2xl border border-gold-500/40 bg-gold-50/60 p-4">
            <Info size={18} className="mt-0.5 shrink-0 text-gold-500" />
            <div className="text-sm leading-relaxed text-ink">
              <p className="font-medium">
                При обороті понад {fmt(PT_TAX_2026.ivaThreshold)}/рік ви втрачаєте звільнення від IVA
              </p>
              <p className="mt-1 text-slate-600">
                Доведеться реєструватися платником IVA (ПДВ, 23%). IVA{" "}
                <strong>не зменшує ваш дохід</strong> — ви додаєте його до ціни й перераховуєте
                державі, але з'являється обов'язок звітності. Уточніть у бухгалтера.
              </p>
            </div>
          </div>
        )}

        {/* Лід-форма */}
        <div className="rounded-2xl border border-emerald/30 bg-emerald-50/60 p-5">
          <p className="font-display font-semibold text-ink">
            Потрібна допомога з recibos verdes у Португалії?
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Відкриття діяльності (início de atividade), вибір коефіцієнта, IRS і Segurança
            Social — консультація україномовного бухгалтера.
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
          Розрахунок орієнтовний, станом на {PT_TAX_2026.year} рік. Ставки IRS, Segurança Social
          і коефіцієнти змінюються; можливі індивідуальні нюанси (правило підтвердження витрат
          15%, дедукції, сімейний стан). Перед прийняттям рішень звіртеся з бухгалтером або на
          portaldasfinancas.gov.pt і seg-social.pt.
        </p>
      </div>
    </div>
  );
}
