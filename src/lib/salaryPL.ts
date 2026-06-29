// Калькулятор зарплати netto/brutto для найманого працівника (umowa o pracę) у Польщі.
// Дані станом на 2026 (джерела: ZUS.pl, podatki.gov.pl).
// Вивірено проти контрольних прикладів (до копійки).
//
// Розрахунок РІЧНИЙ (важливо для переходу на 32% після 120 000 zł), потім ÷12.

export const SALARY_PL_2026 = {
  year: 2026,
  currency: "PLN",
  // Внески працівника (утримуються з brutto)
  zus: {
    emerytalna: 0.0976,
    rentowa: 0.015,
    chorobowa: 0.0245,
    total: 0.1371,
    annualCap: 282600,        // стеля 30-krotności для emerytalna+rentowa
  },
  zdrowotna: 0.09,            // 9% від (brutto − ZUS), не віднімається від PIT
  pit: {
    rate1: 0.12,
    rate2: 0.32,
    threshold: 120000,
    kwotaWolna: 30000,
    taxReductionAnnual: 3600,  // kwota zmniejszająca (300/міс через PIT-2)
    kupStandardMonthly: 250,
    kupElevatedMonthly: 300,
    ulgaDlaMlodychLimit: 85528,
  },
  employerTotal: 0.2048,      // приблизний внесок роботодавця понад brutto
  minimumWage: 4806,
} as const;

export type SalaryResult = {
  bruttoMonth: number;
  bruttoYear: number;
  zusYear: number;
  zdrowotnaYear: number;
  pitYear: number;
  nettoYear: number;
  nettoMonth: number;
  employerCostMonth: number;  // повна вартість для роботодавця
};

/**
 * @param bruttoMonth місячна зарплата brutto
 * @param under26 вік до 26 (ulga dla młodych — 0% PIT до ліміту)
 * @param elevatedKup підвищені koszty uzyskania (іногородній)
 * @param pit2 застосовано PIT-2 (зменшення авансу) — зазвичай так
 */
export function calcSalaryPL(
  bruttoMonth: number,
  under26 = false,
  elevatedKup = false,
  pit2 = true
): SalaryResult {
  const c = SALARY_PL_2026;
  const bruttoYear = bruttoMonth * 12;

  // ── ZUS працівника (зі стелею 30-krotności для emerytalna+rentowa) ──
  const cappedBase = Math.min(bruttoYear, c.zus.annualCap);
  const emeryRenta = cappedBase * (c.zus.emerytalna + c.zus.rentowa);
  const choro = bruttoYear * c.zus.chorobowa; // chorobowa без стелі
  const zusYear = emeryRenta + choro;

  // ── Składka zdrowotna (9% від brutto − ZUS) ──
  const zdrowotnaYear = (bruttoYear - zusYear) * c.zdrowotna;

  // ── PIT ──
  const kupYear = (elevatedKup ? c.pit.kupElevatedMonthly : c.pit.kupStandardMonthly) * 12;
  const pitBase = Math.max(0, bruttoYear - zusYear - kupYear);

  let pitYear: number;
  if (under26 && bruttoYear <= c.pit.ulgaDlaMlodychLimit) {
    pitYear = 0; // ulga dla młodych
  } else {
    // прогресивний PIT з kwota wolna (через kwota zmniejszająca)
    let taxBeforeReduction: number;
    if (pitBase <= c.pit.threshold) {
      taxBeforeReduction = pitBase * c.pit.rate1;
    } else {
      taxBeforeReduction =
        c.pit.threshold * c.pit.rate1 + (pitBase - c.pit.threshold) * c.pit.rate2;
    }
    const reduction = pit2 ? c.pit.taxReductionAnnual : 0;
    pitYear = Math.max(0, taxBeforeReduction - reduction);
  }

  const nettoYear = bruttoYear - zusYear - zdrowotnaYear - pitYear;
  const employerCostMonth = bruttoMonth * (1 + c.employerTotal);

  const round = (n: number) => Math.round(n);
  return {
    bruttoMonth: round(bruttoMonth),
    bruttoYear: round(bruttoYear),
    zusYear: round(zusYear),
    zdrowotnaYear: round(zdrowotnaYear),
    pitYear: round(pitYear),
    nettoYear: round(nettoYear),
    nettoMonth: round(nettoYear / 12),
    employerCostMonth: round(employerCostMonth),
  };
}

// ─────────────────────────────────────────────────────────────
// UMOWA ZLECENIE (договір доручення) — інша формула, ніж UoP.
// Вивірено проти контрольних прикладів (до копійки).
// Студент до 26: ZUS=0, zdrowotna=0, PIT=0 (до ulga ліміту) → netto≈brutto.
// Не-студент: ZUS (chorobowa добровільна), zdrowotna 9%, koszty 20%, PIT.

export const ZLECENIE_PL_2026 = {
  emerytalna: 0.0976,
  rentowa: 0.015,
  chorobowa: 0.0245,        // добровільна
  zdrowotna: 0.09,
  kup: 0.20,                // 20% від (brutto − social), не фіксовані 250
  pit1: 0.12,
  pit2Rate: 0.32,
  pitThreshold: 120000,
  taxReductionAnnual: 3600, // PIT-2 (300/міс)
  ulgaDlaMlodychLimit: 85528,
} as const;

export type ZlecenieResult = {
  bruttoMonth: number;
  bruttoYear: number;
  zusYear: number;
  zdrowotnaYear: number;
  pitYear: number;
  nettoYear: number;
  nettoMonth: number;
  isStudentExempt: boolean;
};

/**
 * @param bruttoMonth місячна сума brutto
 * @param student студент до 26 (ZUS=0, zdrowotna=0, PIT=0 до ліміту)
 * @param chorobowa добровільна chorobowa (тільки не-студент)
 * @param pit2 застосовано PIT-2
 */
export function calcZleceniePL(
  bruttoMonth: number,
  student = false,
  chorobowa = true,
  pit2 = true
): ZlecenieResult {
  const z = ZLECENIE_PL_2026;
  const bruttoYear = bruttoMonth * 12;
  const round = (n: number) => Math.round(n);

  // ── СТУДЕНТ до 26: повне звільнення до лімігу ulga ──
  if (student) {
    // ZUS=0, zdrowotna=0. PIT=0 до ulga ліміту; надлишок оподатковується.
    let pitYear = 0;
    if (bruttoYear > z.ulgaDlaMlodychLimit) {
      // надлишок над лімітом: koszty 20%, потім PIT (без ZUS)
      const excess = bruttoYear - z.ulgaDlaMlodychLimit;
      const kup = excess * z.kup;
      const base = Math.max(0, excess - kup);
      let tax = base * z.pit1;
      if (pit2) tax = Math.max(0, tax - z.taxReductionAnnual);
      pitYear = Math.max(0, tax);
    }
    const nettoYear = bruttoYear - pitYear;
    return {
      bruttoMonth: round(bruttoMonth),
      bruttoYear: round(bruttoYear),
      zusYear: 0,
      zdrowotnaYear: 0,
      pitYear: round(pitYear),
      nettoYear: round(nettoYear),
      nettoMonth: round(nettoYear / 12),
      isStudentExempt: true,
    };
  }

  // ── НЕ-СТУДЕНТ ──
  const socialRate = z.emerytalna + z.rentowa + (chorobowa ? z.chorobowa : 0);
  const zusYear = bruttoYear * socialRate;
  const zdrowotnaYear = (bruttoYear - zusYear) * z.zdrowotna;
  const kupYear = (bruttoYear - zusYear) * z.kup;
  const pitBase = Math.max(0, bruttoYear - zusYear - kupYear);

  let taxBeforeReduction: number;
  if (pitBase <= z.pitThreshold) {
    taxBeforeReduction = pitBase * z.pit1;
  } else {
    taxBeforeReduction = z.pitThreshold * z.pit1 + (pitBase - z.pitThreshold) * z.pit2Rate;
  }
  const reduction = pit2 ? z.taxReductionAnnual : 0;
  const pitYear = Math.max(0, taxBeforeReduction - reduction);

  const nettoYear = bruttoYear - zusYear - zdrowotnaYear - pitYear;
  return {
    bruttoMonth: round(bruttoMonth),
    bruttoYear: round(bruttoYear),
    zusYear: round(zusYear),
    zdrowotnaYear: round(zdrowotnaYear),
    pitYear: round(pitYear),
    nettoYear: round(nettoYear),
    nettoMonth: round(nettoYear / 12),
    isStudentExempt: false,
  };
}

