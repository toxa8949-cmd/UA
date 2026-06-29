// Калькулятор зарплати netto/bruto (salário líquido) для найманого в Португалії.
// Дані станом на 2026 (джерела: seg-social.pt, Despacho 233-A/2026, Continente).
// Вивірено проти контрольних прикладів (до цента).
//
// Особливості: Segurança Social фіксована 11%; IRS утримується за офіційними
// таблицями retenção na fonte (Tabela I — não casado sem dependentes); 14 виплат.

export const SALARY_PT_2026 = {
  year: 2026,
  currency: "EUR",
  socialEmployee: 0.11,
  region: "Continente",
  // Tabela I retenção 2026 (não casado sem dependentes / casado dois titulares)
  // дві перші ставки мають формулу parcela; решта — фіксована
  defaultPayments: 14,
  minimumWage: 920,
} as const;

// IRS retenção na fonte — Tabela I 2026
function retencaoTabelaI(R: number): number {
  if (R <= 920) return 0;
  if (R <= 1042) return Math.max(0, R * 0.125 - 0.125 * 2.6 * (1273.85 - R));
  if (R <= 1108) return Math.max(0, R * 0.157 - 0.157 * 1.35 * (1554.83 - R));
  if (R <= 1154) return Math.max(0, R * 0.157 - 94.71);
  if (R <= 1212) return Math.max(0, R * 0.212 - 158.18);
  if (R <= 1819) return Math.max(0, R * 0.241 - 193.33);
  if (R <= 2119) return Math.max(0, R * 0.311 - 320.66);
  if (R <= 2499) return Math.max(0, R * 0.349 - 401.19);
  if (R <= 3305) return Math.max(0, R * 0.3836 - 487.66);
  if (R <= 5547) return Math.max(0, R * 0.3969 - 531.62);
  if (R <= 20221) return Math.max(0, R * 0.4495 - 823.4);
  return Math.max(0, R * 0.4717 - 1272.31);
}

export type PtSalaryResult = {
  brutoMonth: number;
  socialMonth: number;
  irsMonth: number;
  liquidoMonth: number;
  liquidoAnnual: number;
  liquidoPerPayment: number;
  payments: number;
  effectiveRate: number;
};

/**
 * @param brutoMonth місячна ilíquido
 * @param payments кількість виплат (12 або 14)
 */
export function calcSalaryPT(
  brutoMonth: number,
  payments = 14
): PtSalaryResult {
  const c = SALARY_PT_2026;
  const social = brutoMonth * c.socialEmployee;
  const irs = retencaoTabelaI(brutoMonth);
  const liquidoMonth = brutoMonth - social - irs;
  // фактичний річний дохід — 14 виплат; на виплату ділимо за обраною схемою
  const liquidoAnnual = liquidoMonth * 14;
  const liquidoPerPayment = payments === 14 ? liquidoMonth : liquidoAnnual / 12;

  const effectiveRate = brutoMonth > 0
    ? Math.round((1 - liquidoMonth / brutoMonth) * 100)
    : 0;

  const round = (n: number) => Math.round(n * 100) / 100;
  const r = (n: number) => Math.round(n);
  return {
    brutoMonth: r(brutoMonth),
    socialMonth: round(social),
    irsMonth: round(irs),
    liquidoMonth: round(liquidoMonth),
    liquidoAnnual: r(liquidoAnnual),
    liquidoPerPayment: round(liquidoPerPayment),
    payments,
    effectiveRate,
  };
}
