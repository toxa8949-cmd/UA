"use client";

import { useState, useMemo } from "react";
import { calcDE, DE_TAX_2026 } from "@/lib/taxDE";
import { ArrowUpRight, Info } from "lucide-react";
import { TermHint } from "./TermHint";

function fmt(n: number): string {
  return "€" + Math.round(n).toLocaleString("en-US").replace(/,/g, "\u00a0");
}

export function TaxFreelancerDECalculator() {
  const [income, setIncome] = useState(5000);
  const [expenses, setExpenses] = useState(0);
  const [social, setSocial] = useState(350);
  const [isGewerbe, setIsGewerbe] = useState(false);

  const result = useMemo(
    () => calcDE(income, expenses, social, isGewerbe),
    [income, expenses, social, isGewerbe]
  );

  const annualTurnover = income * 12;
  const overKlein = annualTurnover > DE_TAX_2026.kleinunternehmerCurrentYear;

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
            max={15000}
            step={250}
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="mt-3 w-full accent-emerald"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Місячні витрати, € <span className="font-normal text-slate-400">(Betriebsausgaben)</span>
          </label>
          <input
            type="number"
            min={0}
            step={100}
            value={expenses}
            onChange={(e) => setExpenses(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-lg border border-sand-300 px-3 py-2.5 text-ink outline-none focus:border-emerald"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Соц. страхування, €/міс{" "}
            <span className="font-normal text-slate-400">(медичне + догляд)</span>
          </label>
          <input
            type="number"
            min={0}
            step={50}
            value={social}
            onChange={(e) => setSocial(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-lg border border-sand-300 px-3 py-2.5 text-ink outline-none focus:border-emerald"
          />
          <p className="mt-1.5 text-xs text-slate-400">
            Індивідуальне. Орієнтир: ~{DE_TAX_2026.socialHint.low} €/міс при низькому доході,
            до ~{DE_TAX_2026.socialHint.high} €/міс при високому (GKV+Pflege). PKV дуже різниться.
          </p>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-ink"><TermHint label="Тип діяльності" hint="Freiberufler (вільні професії: IT-консалтинг, дизайн) не платять Gewerbesteuer. Gewerbe (торгівля, бізнес) — платять." /></span>
          <div className="space-y-2">
            <label
              className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 ${
                !isGewerbe ? "border-emerald bg-emerald-50" : "border-sand-300"
              }`}
            >
              <input
                type="radio"
                checked={!isGewerbe}
                onChange={() => setIsGewerbe(false)}
                className="mt-0.5 accent-emerald"
              />
              <span>
                <span className="block text-sm font-medium text-ink">Freiberufler</span>
                <span className="block text-xs text-slate-500">
                  вільна професія (IT-консалтинг, дизайн) — без Gewerbesteuer
                </span>
              </span>
            </label>
            <label
              className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 ${
                isGewerbe ? "border-emerald bg-emerald-50" : "border-sand-300"
              }`}
            >
              <input
                type="radio"
                checked={isGewerbe}
                onChange={() => setIsGewerbe(true)}
                className="mt-0.5 accent-emerald"
              />
              <span>
                <span className="block text-sm font-medium text-ink">Gewerbe</span>
                <span className="block text-xs text-slate-500">
                  підприємництво (торгівля) — з Gewerbesteuer
                </span>
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* ── Результат ── */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-emerald bg-emerald-50 p-6">
          <p className="text-sm font-medium text-slate-500">
            {isGewerbe ? "Gewerbe" : "Freiberufler"}
          </p>
          <p className="mt-1 font-display text-4xl font-bold text-ink">
            {fmt(result.netMonth)}
            <span className="ml-2 text-base font-normal text-slate-400">на руки / місяць</span>
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-slate-500">zvE (оподатк. дохід)</p>
              <p className="mt-1 font-display text-lg font-bold text-ink">
                {fmt(result.zvE)}<span className="text-xs font-normal text-slate-400"> /рік</span>
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
              <dt className="text-slate-500"><TermHint label="Соц. страхування" hint="Krankenversicherung + Pflegeversicherung — медичне страхування та страхування догляду. У Німеччині індивідуальне (державне GKV або приватне PKV)." /></dt>
              <dd className="text-ink">−{fmt(result.socialYear)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500"><TermHint label="Einkommensteuer" hint="Einkommensteuer — прибутковий податок. Рахується за прогресивною формулою §32a EStG." /></dt>
              <dd className="text-ink">−{fmt(result.estYear)}</dd>
            </div>
            {result.soliYear > 0 && (
              <div className="flex justify-between">
                <dt className="text-slate-500"><TermHint label="Solidaritätszuschlag" hint="Solidaritätszuschlag (Soli) — додатковий збір 5.5% від податку. Більшість із низьким/середнім доходом його не платять." /></dt>
                <dd className="text-ink">−{fmt(result.soliYear)}</dd>
              </div>
            )}
            {isGewerbe && result.gewStYear > 0 && (
              <div className="flex justify-between">
                <dt className="text-slate-500"><TermHint label="Gewerbesteuer (після §35)" hint="Gewerbesteuer — промисловий податок (тільки для Gewerbe). Частково зараховується в Einkommensteuer за §35 EStG." /></dt>
                <dd className="text-ink">−{fmt(result.gewStYear)}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Примітка про USt / Kleinunternehmer */}
        <div className="flex items-start gap-3 rounded-2xl border border-gold-500/40 bg-gold-50/60 p-4">
          <Info size={18} className="mt-0.5 shrink-0 text-gold-500" />
          <div className="text-sm leading-relaxed text-ink">
            {overKlein ? (
              <>
                <p className="font-medium">
                  При обороті понад {fmt(DE_TAX_2026.kleinunternehmerCurrentYear)}/рік ви — платник USt
                </p>
                <p className="mt-1 text-slate-600">
                  Kleinunternehmerregelung не діє. Нараховуєте USt (19%) у рахунках і
                  перераховуєте державі. USt <strong>не зменшує дохід</strong> — клієнт платить її
                  зверху. Уточніть у Steuerberater.
                </p>
              </>
            ) : (
              <>
                <p className="font-medium">USt (ПДВ, 19%) — окремо від цього розрахунку</p>
                <p className="mt-1 text-slate-600">
                  За Kleinunternehmerregelung (§19 UStG: оборот ≤{" "}
                  {fmt(DE_TAX_2026.kleinunternehmerPrevYear)} торік і ≤{" "}
                  {fmt(DE_TAX_2026.kleinunternehmerCurrentYear)} цьогоріч) можна не нараховувати
                  USt. Інакше додаєте 19% до рахунків і перераховуєте державі — на «на руки» це не
                  впливає.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Лід-форма */}
        <div className="rounded-2xl border border-emerald/30 bg-emerald-50/60 p-5">
          <p className="font-display font-semibold text-ink">
            Потрібна допомога з реєстрацією в Німеччині?
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Anmeldung, вибір Freiberufler/Gewerbe, Einkommensteuer, USt і соцстрахування —
            консультація україномовного Steuerberater.
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
          Розрахунок орієнтовний, станом на {DE_TAX_2026.year} рік (формула §32a EStG). Не
          враховує Kirchensteuer, сімейного стану (Splitting), реального Hebesatz вашого міста
          (взято типовий 400%) та індивідуального соцстрахування. Gewerbesteuer і §35 EStG
          спрощено. Перед прийняттям рішень звіртеся зі Steuerberater або на bundesfinanzministerium.de.
        </p>
      </div>
    </div>
  );
}
