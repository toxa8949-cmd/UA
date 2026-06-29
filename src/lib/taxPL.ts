// Калькулятор податків JDG (ФОП) у Польщі.
// Дані станом на 2026 (джерела: ZUS, podatki.gov.pl, gov.pl).
// Розрахунок ведеться в РІЧНОМУ циклі (важливо для skala через kwota wolna
// та перехід на 32%), потім ділиться на 12.

export const PL_TAX_2026 = {
  year: 2026,
  kwotaWolna: 30000,        // неоподатковуваний мінімум (skala)
  skala12Limit: 120000,     // поріг переходу 12% → 32%
  skalaLow: 0.12,
  skalaHigh: 0.32,
  liniowy: 0.19,
  zdrowotnaLiniowy: 0.049,  // 4.9% від доходу
  zdrowotnaSkala: 0.09,     // 9% від доходу
  zdrowotnaMin: 432.54,     // мін. składka zdrowotna (з лютого 2026)
  // ZUS соціальний — місячні суми
  zusFull: 1926.77,         // повний (Duży ZUS)
  zusPref: 456.18,          // preferencyjny (24 міс), без Fundusz Pracy
  zusStart: 0,              // Ulga na start (6 міс) — соц. ZUS = 0
  // składka zdrowotna для ryczałt — місячні фікс. суми за порогами річного доходу
  ryczaltZdrowotna: {
    low: 498.35,            // дохід до 60 000 zł/рік
    mid: 830.58,            // 60 000 – 300 000
    high: 1495.04,          // понад 300 000
  },
  ryczaltZdrowotnaThreshold1: 60000,
  ryczaltZdrowotnaThreshold2: 300000,
  // Поріг обов'язкової реєстрації платником VAT (річний оборот).
  // Стандартне звільнення (zwolnienie z VAT) — 200 000 zł/рік.
  // Винятки: окремі види діяльності (консалтинг, юридичні, ювелірні тощо)
  // зобов'язані реєструватися з першої злотої.
  vatThreshold: 200000,
} as const;

// Ставки ryczałt за видом діяльності
export const RYCZALT_RATES: { value: number; label: string; hint: string }[] = [
  { value: 0.12, label: "12% — IT, програмування", hint: "розробка ПЗ, IT-консалтинг" },
  { value: 0.085, label: "8.5% — більшість послуг", hint: "послуги, оренда" },
  { value: 0.15, label: "15% — маркетинг, реклама", hint: "реклама, консалтинг, дослідження" },
  { value: 0.14, label: "14% — медицина", hint: "медичні послуги" },
  { value: 0.03, label: "3% — торгівля", hint: "магазини, e-commerce" },
  { value: 0.055, label: "5.5% — будівництво", hint: "будівельні роботи" },
  { value: 0.17, label: "17% — окремі профпослуги", hint: "деякі вільні професії" },
];

export type ZusType = "full" | "pref" | "start";

export const ZUS_OPTIONS: { value: ZusType; label: string; hint: string }[] = [
  { value: "full", label: "Повний ZUS", hint: "звичайний, після пільгових періодів" },
  { value: "pref", label: "Preferencyjny ZUS", hint: "перші 24 місяці" },
  { value: "start", label: "Ulga na start", hint: "перші 6 місяців, соц. ZUS = 0" },
];

function zusMonthly(type: ZusType): number {
  if (type === "pref") return PL_TAX_2026.zusPref;
  if (type === "start") return PL_TAX_2026.zusStart;
  return PL_TAX_2026.zusFull;
}

export type TaxResult = {
  form: "ryczalt" | "liniowy" | "skala";
  formLabel: string;
  grossYear: number;
  zusYear: number;
  zdrowotnaYear: number;
  taxYear: number;
  netYear: number;
  netMonth: number;
};

// Складка zdrowotna для ryczałt — за річним доходом
function ryczaltZdrowotnaYear(grossYear: number): number {
  const t = PL_TAX_2026;
  let monthly: number;
  if (grossYear <= t.ryczaltZdrowotnaThreshold1) monthly = t.ryczaltZdrowotna.low;
  else if (grossYear <= t.ryczaltZdrowotnaThreshold2) monthly = t.ryczaltZdrowotna.mid;
  else monthly = t.ryczaltZdrowotna.high;
  return monthly * 12;
}

/**
 * Рахує всі три форми оподаткування за місячним інвойсом.
 * @param monthlyGross місячний дохід (інвойс) у zł
 * @param ryczaltRate обрана ставка ryczałt
 * @param zusType тип ZUS
 * @param monthlyExpenses місячні витрати (для liniowy/skala; ryczałt їх ігнорує)
 */
export function calcPL(
  monthlyGross: number,
  ryczaltRate: number,
  zusType: ZusType,
  monthlyExpenses = 0
): TaxResult[] {
  const t = PL_TAX_2026;
  const grossYear = monthlyGross * 12;
  const zusYear = zusMonthly(zusType) * 12;
  const expensesYear = monthlyExpenses * 12;

  // ── RYCZAŁT ── податок від обороту, витрати не враховуються
  const ryczaltZdrowotna = ryczaltZdrowotnaYear(grossYear);
  const ryczaltTax = grossYear * ryczaltRate;
  // На руки = оборот - ПОДАТОК від обороту - ZUS - zdrowotna - РЕАЛЬНІ витрати.
  // Витрати не зменшують податок на ryczałt, але людина їх реально платить,
  // тож для чесного порівняння «на руки» їх віднімаємо.
  const ryczaltNet = grossYear - expensesYear - zusYear - ryczaltZdrowotna - ryczaltTax;

  // ── LINIOWY 19% ── база = дохід - витрати - соц.ZUS
  const liniowyBase = Math.max(0, grossYear - expensesYear - zusYear);
  const liniowyZdrowotna = Math.max(liniowyBase * t.zdrowotnaLiniowy, t.zdrowotnaMin * 12);
  const liniowyTax = liniowyBase * t.liniowy;
  const liniowyNet = grossYear - expensesYear - zusYear - liniowyZdrowotna - liniowyTax;

  // ── SKALA ── прогресивна, з kwota wolna та переходом на 32%
  const skalaBase = Math.max(0, grossYear - expensesYear - zusYear);
  const skalaZdrowotna = Math.max(skalaBase * t.zdrowotnaSkala, t.zdrowotnaMin * 12);
  // податок із урахуванням неоподатковуваної суми та порогу
  const taxable = Math.max(0, skalaBase - t.kwotaWolna);
  let skalaTax: number;
  if (skalaBase <= t.skala12Limit) {
    skalaTax = taxable * t.skalaLow;
  } else {
    const lowPart = (t.skala12Limit - t.kwotaWolna) * t.skalaLow;
    const highPart = (skalaBase - t.skala12Limit) * t.skalaHigh;
    skalaTax = lowPart + highPart;
  }
  const skalaNet = grossYear - expensesYear - zusYear - skalaZdrowotna - skalaTax;

  const round = (n: number) => Math.round(n);

  return [
    {
      form: "ryczalt",
      formLabel: `Ryczałt ${(ryczaltRate * 100).toFixed(1).replace(".0", "")}%`,
      grossYear: round(grossYear),
      zusYear: round(zusYear),
      zdrowotnaYear: round(ryczaltZdrowotna),
      taxYear: round(ryczaltTax),
      netYear: round(ryczaltNet),
      netMonth: round(ryczaltNet / 12),
    },
    {
      form: "liniowy",
      formLabel: "Liniowy 19%",
      grossYear: round(grossYear),
      zusYear: round(zusYear),
      zdrowotnaYear: round(liniowyZdrowotna),
      taxYear: round(liniowyTax),
      netYear: round(liniowyNet),
      netMonth: round(liniowyNet / 12),
    },
    {
      form: "skala",
      formLabel: "Skala podatkowa",
      grossYear: round(grossYear),
      zusYear: round(zusYear),
      zdrowotnaYear: round(skalaZdrowotna),
      taxYear: round(skalaTax),
      netYear: round(skalaNet),
      netMonth: round(skalaNet / 12),
    },
  ];
}
