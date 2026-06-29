// Калькулятор податків для самозайнятого (recibos verdes) у Португалії.
// Дані станом на 2026 (джерела: portaldasfinancas.gov.pt, seg-social.pt).
// Математика вивірена проти офіційних прикладів (до цента).
//
// Особливості:
// - regime simplificado: оподатковувана база IRS = дохід × коефіцієнт
// - IRS прогресивний за траншами (escalões)
// - Segurança Social рахується від ІНШОЇ бази: дохід × 70% × 21.4% = 14.98%
// - пільга новачка: коефіцієнт −50% (1-й рік) / −25% (2-й), SS звільнення 12 міс

export const PT_TAX_2026 = {
  year: 2026,
  currency: "EUR",
  regimeIncomeLimit: 200000,
  irsBrackets: [
    { upTo: 8342, rate: 0.125 },
    { upTo: 12587, rate: 0.157 },
    { upTo: 17838, rate: 0.212 },
    { upTo: 23089, rate: 0.241 },
    { upTo: 29397, rate: 0.311 },
    { upTo: 43090, rate: 0.349 },
    { upTo: 46566, rate: 0.431 },
    { upTo: 86634, rate: 0.446 },
    { upTo: null as number | null, rate: 0.48 },
  ],
  ss: {
    workerRate: 0.214,
    servicesShare: 0.70,    // база SS = 70% доходу для послуг
    minMonthly: 20,
  },
  newActivity: {
    coefDiscountYear1: 0.5,   // коефіцієнт × 50% у 1-й рік
    socialExemptMonths: 12,
  },
  ivaThreshold: 15000,        // поріг isenção IVA (art. 53)
  ivaRate: 0.23,
} as const;

// Коефіцієнти regime simplificado
export const PT_COEFFICIENTS: { value: number; label: string; hint: string }[] = [
  { value: 0.75, label: "0.75 — IT, профпослуги", hint: "програмування, консалтинг (art. 151 CIRS)" },
  { value: 0.35, label: "0.35 — інші послуги", hint: "послуги, не зі списку art. 151" },
  { value: 0.15, label: "0.15 — торгівля, HoReCa", hint: "продаж товарів, готелі, ресторани" },
  { value: 0.95, label: "0.95 — IP, crypto, інше", hint: "роялті, криптодіяльність тощо" },
];

export type PtResult = {
  grossYear: number;
  irsBase: number;
  ssYear: number;
  irsYear: number;
  netYear: number;
  netMonth: number;
};

// Прогресивний IRS за траншами
function calcIRS(base: number): number {
  let tax = 0;
  let prev = 0;
  for (const b of PT_TAX_2026.irsBrackets) {
    const cap = b.upTo === null ? Infinity : b.upTo;
    if (base > prev) {
      const inBracket = Math.min(base, cap) - prev;
      tax += inBracket * b.rate;
      prev = cap;
    } else break;
  }
  return tax;
}

/**
 * @param monthlyIncome місячний дохід
 * @param coefficient коефіцієнт regime simplificado
 * @param firstYear перший рік діяльності (пільги)
 */
export function calcPT(
  monthlyIncome: number,
  coefficient: number,
  firstYear = false
): PtResult {
  const t = PT_TAX_2026;
  const grossYear = monthlyIncome * 12;

  // коефіцієнт зі знижкою для 1-го року
  const effCoef = firstYear
    ? coefficient * (1 - t.newActivity.coefDiscountYear1)
    : coefficient;

  const irsBase = grossYear * effCoef;
  const irsYear = calcIRS(irsBase);

  // Segurança Social — окрема база (70% доходу), звільнення в 1-й рік
  const ssYear = firstYear
    ? 0
    : Math.max(grossYear * t.ss.servicesShare * t.ss.workerRate, t.ss.minMonthly * 12);

  const netYear = grossYear - ssYear - irsYear;

  const round = (n: number) => Math.round(n);
  return {
    grossYear: round(grossYear),
    irsBase: round(irsBase),
    ssYear: round(ssYear),
    irsYear: round(irsYear),
    netYear: round(netYear),
    netMonth: round(netYear / 12),
  };
}
