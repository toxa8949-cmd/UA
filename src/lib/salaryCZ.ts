// Калькулятор зарплати netto/brutto (čistá mzda) для найманого працівника (HPP) у Чехії.
// Дані станом на 2026 (джерела: financnisprava.cz, cssz.cz, mpsv.cz).
// Вивірено проти контрольних прикладів (до кронy).
//
// Чеська логіка простіша за польську: податок прямо від hrubá mzda (superhrubá
// скасована з 2021), без koszty uzyskania. Sleva na poplatníka зменшує податок.
// Немає аналога польської "ulga dla młodych" (студентського звільнення).

export const SALARY_CZ_2026 = {
  year: 2026,
  currency: "CZK",
  social: 0.071,             // працівник: 6.5% důchodové + 0.6% nemocenské
  health: 0.045,             // працівник: 1/3 від 13.5%
  socialMaxAnnual: 2350416,  // стеля sociálního (48× середня); zdravotní без стелі
  tax1: 0.15,
  tax2: 0.23,
  thresholdMonthly: 146901,  // місячний поріг 23% (36× середня /12)
  thresholdAnnual: 1762812,
  slevaMonthly: 2570,        // sleva na poplatníka (зменшує податок)
  // ditячі пільги (sleva na dítě) — місячні
  childCredit: {
    first: 1267,
    second: 1860,
    thirdPlus: 2320,
  },
  employerTotal: 0.338,      // sociální 24.8% + zdravotní 9%
  minimumWage: 22400,
} as const;

export type SalaryCzResult = {
  bruttoMonth: number;
  socialMonth: number;
  healthMonth: number;
  taxMonth: number;
  childCreditMonth: number;
  nettoMonth: number;
  nettoYear: number;
  employerCostMonth: number;
};

// сумарна дитяча пільга за кількістю дітей
function childCreditTotal(children: number): number {
  const c = SALARY_CZ_2026.childCredit;
  if (children <= 0) return 0;
  let total = c.first;
  if (children >= 2) total += c.second;
  if (children >= 3) total += c.thirdPlus * (children - 2);
  return total;
}

/**
 * @param bruttoMonth місячна hrubá mzda
 * @param children кількість дітей (для sleva na dítě)
 */
export function calcSalaryCZ(bruttoMonth: number, children = 0): SalaryCzResult {
  const c = SALARY_CZ_2026;
  const round = (n: number) => Math.round(n);

  // соціальне зі стелею (місячна стеля = річна / 12)
  const socialMonthlyCap = c.socialMaxAnnual / 12;
  const socialBase = Math.min(bruttoMonth, socialMonthlyCap);
  const social = socialBase * c.social;
  const health = bruttoMonth * c.health; // zdravotní без стелі

  // daň: 15% до порогу, 23% вище
  let tax: number;
  if (bruttoMonth <= c.thresholdMonthly) {
    tax = bruttoMonth * c.tax1;
  } else {
    tax = c.thresholdMonthly * c.tax1 + (bruttoMonth - c.thresholdMonthly) * c.tax2;
  }

  // slevy: na poplatníka + na dítě (зменшують податок; на дітей може робити податок від'ємним = бонус)
  const childCredit = childCreditTotal(children);
  const taxAfterPoplatnik = Math.max(0, tax - c.slevaMonthly);
  // дитяча пільга може давати daňový bonus (від'ємний податок повертається)
  const taxAfterChildren = taxAfterPoplatnik - childCredit;

  const netto = bruttoMonth - social - health - taxAfterChildren;
  const employerCost = bruttoMonth * (1 + c.employerTotal);

  return {
    bruttoMonth: round(bruttoMonth),
    socialMonth: round(social),
    healthMonth: round(health),
    taxMonth: round(taxAfterChildren),
    childCreditMonth: round(childCredit),
    nettoMonth: round(netto),
    nettoYear: round(netto * 12),
    employerCostMonth: round(employerCost),
  };
}
