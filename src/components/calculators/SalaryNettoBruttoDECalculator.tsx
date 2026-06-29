"use client";

import { useState, useMemo } from "react";
import { calcSalaryDE, SALARY_DE_2026, type SteuerklasseDE } from "@/lib/salaryDE";
import { ArrowUpRight } from "lucide-react";
import { TermHint } from "./TermHint";

function fmt(n: number): string {
  return "€" + Math.round(n).toLocaleString("en-US").replace(/,/g, "\u00a0");
}

const KLASSEN: { value: SteuerklasseDE; label: string; hint: string }[] = [
  { value: "I", label: "I", hint: "Неодружені — базовий розрахунок." },
  { value: "IV", label: "IV", hint: "Подружжя з приблизно рівними доходами — близько до класу I." },
  { value: "III", label: "III", hint: "Подружжя, де ви заробляєте більше — нижчий податок (Ehegattensplitting)." },
];

export function SalaryNettoBruttoDECalculator() {
  const [brutto, setBrutto] = useState(4000);
  const [klasse, setKlasse] = useState<SteuerklasseDE>("I");
  const [hasChild, setHasChild] = useState(false);
  const [kirche, setKirche] = useState(false);

  const result = useMemo(
    () => calcSalaryDE(brutto, klasse, hasChild, kirche),
    [brutto, klasse, hasChild, kirche]
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
            Brutto, €/міс
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
            max={12000}
            step={250}
            value={brutto}
            onChange={(e) => setBrutto(Number(e.target.value))}
            className="mt-3 w-full accent-emerald"
          />
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-ink">
            <TermHint
              label="Steuerklasse"
              hint="Податковий клас залежить від сімейного стану. Впливає на розмір Lohnsteuer. I — неодружені, III/IV — подружжя."
            />
          </span>
          <div className="flex gap-2">
            {KLASSEN.map((k) => (
              <button
                key={k.value}
                onClick={() => setKlasse(k.value)}
                title={k.hint}
                className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                  klasse === k.value
                    ? "border-emerald bg-emerald-50 text-ink"
                    : "border-sand-300 text-slate-600"
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            {KLASSEN.find((k) => k.value === klasse)?.hint}
          </p>
        </div>

        <div className="space-y-2">
          <label
            className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 ${
              hasChild ? "border-emerald bg-emerald-50" : "border-sand-300"
            }`}
          >
            <input
              type="checkbox"
              checked={hasChild}
              onChange={(e) => setHasChild(e.target.checked)}
              className="mt-0.5 accent-emerald"
            />
            <span>
              <span className="block text-sm font-medium text-ink">Є діти</span>
              <span className="block text-xs text-slate-500">
                Нижча ставка Pflegeversicherung (1,8% замість 2,4%)
              </span>
            </span>
          </label>

          <label
            className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 ${
              kirche ? "border-emerald bg-emerald-50" : "border-sand-300"
            }`}
          >
            <input
              type="checkbox"
              checked={kirche}
              onChange={(e) => setKirche(e.target.checked)}
              className="mt-0.5 accent-emerald"
            />
            <span>
              <span className="block text-sm font-medium text-ink">
                <TermHint
                  label="Kirchensteuer"
                  hint="Церковний податок 8-9% від Lohnsteuer. Платять лише члени церкви; беремо 9%."
                />
              </span>
            </span>
          </label>
        </div>
      </div>

      {/* ── Результат ── */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-emerald bg-emerald-50 p-6">
          <p className="text-sm font-medium text-slate-500">
            Steuerklasse {klasse}
          </p>
          <p className="mt-1 font-display text-4xl font-bold text-ink">
            {fmt(result.nettoMonth)}
            <span className="ml-2 text-base font-normal text-slate-400">Netto / місяць</span>
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
              <dt className="text-slate-500">
                <TermHint
                  label="Sozialversicherung"
                  hint="Соцвнески працівника: пенсійне (RV), безробіття (AV), медичне (KV), догляд (PV). Решту доплачує роботодавець."
                />
              </dt>
              <dd className="text-ink">−{fmt(result.socialMonth)}</dd>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <dt className="pl-3">RV {fmt(result.socialBreakdown.rv)} · KV {fmt(result.socialBreakdown.kv)} · PV {fmt(result.socialBreakdown.pv)} · AV {fmt(result.socialBreakdown.av)}</dt>
              <dd></dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">
                <TermHint
                  label="Lohnsteuer"
                  hint="Прибутковий податок із зарплати за формулою §32a EStG. Залежить від доходу й Steuerklasse."
                />
              </dt>
              <dd className="text-ink">−{fmt(result.lohnsteuerMonth)}</dd>
            </div>
            {result.soliMonth > 0 && (
              <div className="flex justify-between">
                <dt className="text-slate-500">
                  <TermHint label="Soli" hint="Solidaritätszuschlag — 5.5% від податку. Більшість із низьким/середнім доходом не платять." />
                </dt>
                <dd className="text-ink">−{fmt(result.soliMonth)}</dd>
              </div>
            )}
            {result.kirchensteuerMonth > 0 && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Kirchensteuer</dt>
                <dd className="text-ink">−{fmt(result.kirchensteuerMonth)}</dd>
              </div>
            )}
          </dl>

          <p className="mt-4 rounded-lg bg-white/70 p-3 text-xs leading-relaxed text-slate-600">
            Повна вартість для роботодавця:{" "}
            <strong className="text-ink">{fmt(result.employerCostMonth)}/міс</strong>{" "}
            (brutto + ~{Math.round(SALARY_DE_2026.employerSocialApprox * 100)}% внесків роботодавця).
          </p>
        </div>

        {/* Лід-форма */}
        <div className="rounded-2xl border border-emerald/30 bg-emerald-50/60 p-5">
          <p className="font-display font-semibold text-ink">
            Шукаєте роботу або консультацію щодо зарплати в Німеччині?
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Питання про Steuerklasse, Lohnsteuer, Minijob vs Vollzeit, легалізацію доходу —
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
          Розрахунок орієнтовний, станом на {SALARY_DE_2026.year} рік. Спрощена база податку
          (без точного Vorsorgepauschale), тому офіційний Lohnsteuer може трохи відрізнятися.
          Klasse III рахується через Ehegattensplitting, IV ≈ I. Не враховує Freibeträge,
          Minijob, регіональних відмінностей. Точні суми — у Lohnbuchhalter або в офіційному
          Brutto-Netto-Rechner.
        </p>
      </div>
    </div>
  );
}
