"use client";

import { useState, useMemo } from "react";
import { calcES, ES_TAX_2026 } from "@/lib/taxES";
import { ArrowUpRight, Info } from "lucide-react";
import { TermHint } from "./TermHint";

function fmt(n: number): string {
  return "€" + Math.round(n).toLocaleString("en-US").replace(/,/g, "\u00a0");
}

function fmtCents(n: number): string {
  const whole = Math.floor(n);
  const cents = Math.round((n - whole) * 100);
  const wholeStr = whole.toLocaleString("en-US").replace(/,/g, "\u00a0");
  return "€" + wholeStr + "," + String(cents).padStart(2, "0");
}

export function TaxAutonomoESCalculator() {
  const [income, setIncome] = useState(2500);
  const [expenses, setExpenses] = useState(0);
  const [firstYear, setFirstYear] = useState(false);

  const result = useMemo(
    () => calcES(income, expenses, firstYear),
    [income, expenses, firstYear]
  );
  const normal = useMemo(() => calcES(income, expenses, false), [income, expenses]);

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      {/* ── Інпути ── */}
      <div className="space-y-6 rounded-2xl border border-sand-300 bg-white p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">Місячний дохід, €</label>
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
            max={8000}
            step={250}
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="mt-3 w-full accent-emerald"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Місячні витрати, € <span className="font-normal text-slate-400">(deducibles)</span>
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
            Документально підтверджені витрати діяльності. Зменшують і cuota, і базу IRPF.
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
            <span className="block text-sm font-medium text-ink">Перший рік (tarifa plana)</span>
            <span className="block text-xs text-slate-500">
              Пільгова cuota ~80 €/міс перші 12 місяців
            </span>
          </span>
        </label>
      </div>

      {/* ── Результат ── */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-emerald bg-emerald-50 p-6">
          <p className="text-sm font-medium text-slate-500">Estimación directa simplificada</p>
          <p className="mt-1 font-display text-4xl font-bold text-ink">
            {fmt(result.netMonth)}
            <span className="ml-2 text-base font-normal text-slate-400">на руки / місяць</span>
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-slate-500"><TermHint label="Cuota autónomos" hint="Обов'язковий соцвнесок самозайнятого в Іспанії. Рахується за траншами реального доходу (rendimiento neto)." /></p>
              <p className="mt-1 font-display text-lg font-bold text-ink">
                {fmtCents(result.cuotaMonth)}<span className="text-xs font-normal text-slate-400"> /міс</span>
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
            <div className="flex justify-between">
              <dt className="text-slate-500"><TermHint label="Cuota autónomos / рік" hint="Cuota de autónomos — обов'язковий соцвнесок самозайнятого. Рахується за траншами реального доходу." /></dt>
              <dd className="text-ink">−{fmt(result.cuotaYear)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500"><TermHint label="IRPF" hint="IRPF — прибутковий податок (impuesto sobre la renta). Прогресивний, за траншами доходу." /></dt>
              <dd className="text-ink">−{fmt(result.irpfYear)}</dd>
            </div>
          </dl>

          {firstYear && (
            <p className="mt-4 rounded-lg bg-white/70 p-3 text-xs leading-relaxed text-slate-600">
              З tarifa plana ви економите{" "}
              <strong className="text-ink">{fmt(result.netYear - normal.netYear)}/рік</strong>{" "}
              порівняно зі звичайною cuota ({fmt(normal.netMonth)}/міс).{" "}
              <span className="text-gold-500">
                Суму tarifa plana на 2026 ще не підтверджено офіційно — орієнтовно 80 €/міс.
              </span>
            </p>
          )}
        </div>

        {/* Примітка про IVA (в Іспанії немає порогу звільнення) */}
        <div className="flex items-start gap-3 rounded-2xl border border-gold-500/40 bg-gold-50/60 p-4">
          <Info size={18} className="mt-0.5 shrink-0 text-gold-500" />
          <div className="text-sm leading-relaxed text-ink">
            <p className="font-medium">IVA (ПДВ, 21%) — окремо від цього розрахунку</p>
            <p className="mt-1 text-slate-600">
              В Іспанії немає порогу звільнення від IVA — autónomo зазвичай реєструється й
              декларує IVA з початку діяльності (крім звільнених сфер: медицина, освіта тощо).
              IVA <strong>не зменшує дохід</strong> — ви додаєте його до інвойсу й перераховуєте
              державі. Також пам'ятайте про retenciones (15% / 7% перші роки) — це авансові
              утримання, не додатковий податок.
            </p>
          </div>
        </div>

        {/* Лід-форма */}
        <div className="rounded-2xl border border-emerald/30 bg-emerald-50/60 p-5">
          <p className="font-display font-semibold text-ink">
            Потрібна допомога з autónomo в Іспанії?
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Реєстрація (alta de autónomo), вибір бази cuota, IRPF, IVA та декларації —
            консультація україномовного gestor/бухгалтера.
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
          Розрахунок орієнтовний, станом на {ES_TAX_2026.year} рік. IRPF залежить від автономної
          спільноти (тут — загальна шкала); cuota за траншами та tarifa plana можуть змінюватися.
          Розрахунок не враховує сімейних дедукцій і регіональних відмінностей. Перед прийняттям
          рішень звіртеся з gestor або на seg-social.es і agenciatributaria.es.
        </p>
      </div>
    </div>
  );
}
