// Калькулятор зарплати netto/brutto (Brutto-Netto-Rechner) для найманого в Німеччині.
// Дані станом на 2026 (джерела: §32a EStG, gkv-spitzenverband, Bundesregierung).
// Вивірено проти контрольних прикладів (Klasse I і III, до євро).
//
// УВАГА: спрощений zvE (brutto − соцвнески − Pauschbetrag) без точного
// Vorsorgepauschale. Офіційний Lohnsteuer через PAP може трохи відрізнятися.
// Тому результат — орієнтовний.

export const SALARY_DE_2026 = {
  year: 2026,
  currency: "EUR",
  social: {
    rv: 0.093, rvBBG: 8450,        // Rentenversicherung + стеля
    av: 0.013, avBBG: 8450,        // Arbeitslosenversicherung
    kv: 0.0875, kvBBG: 5812.5,     // Krankenversicherung (7.3% + 1.45% Zusatz)
    pvChildless: 0.024,            // Pflege бездітний 23+
    pvWithChild: 0.018,            // Pflege з дитиною
    pvBBG: 5812.5,
  },
  pauschbetrag: 1230,              // Arbeitnehmer-Pauschbetrag
  est: {
    grundfreibetrag: 12348,
  },
  soli: {
    rate: 0.055,
    freigrenze: 20350,
    milderungRate: 0.119,
  },
  kirchensteuer: 0.09,             // 8-9% залежно від землі; беремо 9%
  minimumWageHourly: 13.9,
  employerSocialApprox: 0.2115,
} as const;

// Einkommensteuer за §32a EStG 2026
export function estDE(zvE: number): number {
  const x = Math.floor(Math.max(0, zvE));
  if (x <= 12348) return 0;
  if (x <= 17799) {
    const y = (x - 12348) / 10000;
    return (914.51 * y + 1400) * y;
  }
  if (x <= 69878) {
    const z = (x - 17799) / 10000;
    return (173.1 * z + 2397) * z + 1034.87;
  }
  if (x <= 277825) return 0.42 * x - 11135.63;
  return 0.45 * x - 19470.38;
}

function soli(estYear: number): number {
  const s = SALARY_DE_2026.soli;
  if (estYear <= s.freigrenze) return 0;
  return Math.min(s.rate * estYear, s.milderungRate * (estYear - s.freigrenze));
}

export type SteuerklasseDE = "I" | "III" | "IV";

export type SalaryDeResult = {
  bruttoMonth: number;
  socialMonth: number;
  socialBreakdown: { rv: number; av: number; kv: number; pv: number };
  zvE: number;
  lohnsteuerMonth: number;
  soliMonth: number;
  kirchensteuerMonth: number;
  nettoMonth: number;
  nettoYear: number;
  employerCostMonth: number;
};

/**
 * @param bruttoMonth місячна brutto
 * @param klasse Steuerklasse (I, III splitting, IV ≈ I)
 * @param hasChild чи є діти (нижчий Pflege)
 * @param kirchensteuer церковний податок
 */
export function calcSalaryDE(
  bruttoMonth: number,
  klasse: SteuerklasseDE = "I",
  hasChild = false,
  kirchensteuer = false
): SalaryDeResult {
  const c = SALARY_DE_2026;
  const s = c.social;
  const round = (n: number) => Math.round(n * 100) / 100;

  // соцвнески працівника зі стелями (BBG)
  const rv = Math.min(bruttoMonth, s.rvBBG) * s.rv;
  const av = Math.min(bruttoMonth, s.avBBG) * s.av;
  const kv = Math.min(bruttoMonth, s.kvBBG) * s.kv;
  const pvRate = hasChild ? s.pvWithChild : s.pvChildless;
  const pv = Math.min(bruttoMonth, s.pvBBG) * pvRate;
  const socialMonth = rv + av + kv + pv;

  const bruttoYear = bruttoMonth * 12;
  const socialYear = socialMonth * 12;
  const zvE = Math.max(0, bruttoYear - socialYear - c.pauschbetrag);

  // Lohnsteuer за класом
  let lohnsteuerYear: number;
  if (klasse === "III") {
    lohnsteuerYear = 2 * estDE(zvE / 2); // splitting
  } else {
    lohnsteuerYear = estDE(zvE); // I та IV ≈ однаково
  }

  const soliYear = soli(lohnsteuerYear);
  const kirchYear = kirchensteuer ? lohnsteuerYear * c.kirchensteuer : 0;

  const nettoYear = bruttoYear - socialYear - lohnsteuerYear - soliYear - kirchYear;
  const employerCostMonth = bruttoMonth * (1 + c.employerSocialApprox);

  const r = (n: number) => Math.round(n);
  return {
    bruttoMonth: r(bruttoMonth),
    socialMonth: r(socialMonth),
    socialBreakdown: { rv: r(rv), av: r(av), kv: r(kv), pv: r(pv) },
    zvE: r(zvE),
    lohnsteuerMonth: r(lohnsteuerYear / 12),
    soliMonth: r(soliYear / 12),
    kirchensteuerMonth: r(kirchYear / 12),
    nettoMonth: r(nettoYear / 12),
    nettoYear: r(nettoYear),
    employerCostMonth: r(employerCostMonth),
  };
}
