// Калькулятор зарплати netto/brutto (nómina) для найманого працівника в Іспанії.
// Дані станом на 2026 (джерела: seg-social.es, agenciatributaria.es).
// Вивірено проти контрольних прикладів (до євро).
//
// Особливості: соцвнески працівника малі (~6.5%, решту платить роботодавець);
// IRPF як retención з mínimo personal; reducción por rendimientos del trabajo
// для низьких доходів; 12 або 14 виплат.

export const SALARY_ES_2026 = {
  year: 2026,
  currency: "EUR",
  social: {
    indefinido: 0.065,        // contingencias 4.7 + desempleo 1.55 + FP 0.1 + MEI 0.15
    temporal: 0.0655,
    maxAnnual: 61214.40,      // base máxima
  },
  irpfBrackets: [
    { upTo: 12450, rate: 0.19 },
    { upTo: 20200, rate: 0.24 },
    { upTo: 35200, rate: 0.30 },
    { upTo: 60000, rate: 0.37 },
    { upTo: 300000, rate: 0.45 },
    { upTo: null as number | null, rate: 0.47 },
  ],
  minimoPersonal: 5550,
  workDeductible: 2000,       // gastos deducibles trabajo
  workReduction: {
    max: 7302,
    fullBelow: 14852,         // повна редукція нижче цього
    threshold: 19747.5,       // згасає до 0 тут
    fadeRate: 1.75,           // коефіцієнт згасання
  },
  childrenMinimo: {
    first: 2400,
    second: 2700,
    third: 4000,
    fourthPlus: 4500,
  },
  defaultPayments: 14,
  smiMonthly: 1221,
} as const;

export type EsSalaryResult = {
  brutoAnnual: number;
  socialAnnual: number;
  irpfBase: number;
  irpfAnnual: number;
  netoAnnual: number;
  netoPerPayment: number;     // на одну виплату (÷12 або ÷14)
  payments: number;
  effectiveRate: number;
};

function irpfRaw(base: number): number {
  let tax = 0;
  let prev = 0;
  for (const b of SALARY_ES_2026.irpfBrackets) {
    const cap = b.upTo === null ? Infinity : b.upTo;
    if (base > prev) {
      tax += (Math.min(base, cap) - prev) * b.rate;
      prev = cap;
    } else break;
  }
  return tax;
}

function workReductionAmount(netWorkIncome: number): number {
  const w = SALARY_ES_2026.workReduction;
  if (netWorkIncome <= w.fullBelow) return w.max;
  if (netWorkIncome < w.threshold) {
    return Math.max(0, w.max - w.fadeRate * (netWorkIncome - w.fullBelow));
  }
  return 0;
}

function childrenMinimoTotal(children: number): number {
  const c = SALARY_ES_2026.childrenMinimo;
  if (children <= 0) return 0;
  let total = c.first;
  if (children >= 2) total += c.second;
  if (children >= 3) total += c.third;
  if (children >= 4) total += c.fourthPlus * (children - 3);
  return total;
}

/**
 * @param brutoAnnual річна bruto
 * @param payments кількість виплат (12 або 14)
 * @param indefinido безстроковий договір (інакше temporal)
 * @param children кількість дітей (mínimo familiar)
 */
export function calcSalaryES(
  brutoAnnual: number,
  payments = 14,
  indefinido = true,
  children = 0
): EsSalaryResult {
  const c = SALARY_ES_2026;
  const ssRate = indefinido ? c.social.indefinido : c.social.temporal;
  const socialAnnual = Math.min(brutoAnnual, c.social.maxAnnual) * ssRate;

  const netWork = brutoAnnual - socialAnnual - c.workDeductible;
  const reduction = workReductionAmount(netWork);
  const irpfBase = Math.max(0, netWork - reduction);

  // mínimo personal + familiar (кредит за першою ставкою)
  const minimoTotal = c.minimoPersonal + childrenMinimoTotal(children);
  const irpfAnnual = Math.max(0, irpfRaw(irpfBase) - irpfRaw(minimoTotal));

  const netoAnnual = brutoAnnual - socialAnnual - irpfAnnual;
  const effectiveRate = brutoAnnual > 0
    ? Math.round((1 - netoAnnual / brutoAnnual) * 100)
    : 0;

  const round = (n: number) => Math.round(n);
  return {
    brutoAnnual: round(brutoAnnual),
    socialAnnual: round(socialAnnual),
    irpfBase: round(irpfBase),
    irpfAnnual: round(irpfAnnual),
    netoAnnual: round(netoAnnual),
    netoPerPayment: round(netoAnnual / payments),
    payments,
    effectiveRate,
  };
}
