// Калькулятор податків autónomo (самозайнятий) в Іспанії.
// Дані станом на 2026 (джерела: seg-social.es, agenciatributaria.es).
// Математика вивірена проти офіційних прикладів (до цента).
//
// Особливості Іспанії:
// - cuota autónomos за ТРАНШАМИ rendimiento neto (не від обороту!)
// - rendimiento для траншу = дохід − витрати − 7% (gastos genéricos)
// - IRPF прогресивний + mínimo personal (кредит за першою ставкою)
// - gastos difícil justificación: 5%, max 2000 €/рік
// - tarifa plana (новачки): 80 €/міс — confirmed_2026: false (орієнтовно)

export const ES_TAX_2026 = {
  year: 2026,
  currency: "EUR",
  cuotaGenericDeduction: 0.07,   // 7% для визначення rendimiento (траншу)
  // Транші cuota: rendimiento neto/міс → мінімальна cuota/міс
  cuotaTramos: [
    { max: 670, cuota: 205.88 },
    { max: 900, cuota: 226.47 },
    { max: 1166.70, cuota: 267.65 },
    { max: 1300, cuota: 299.56 },
    { max: 1500, cuota: 302.65 },
    { max: 1700, cuota: 302.65 },
    { max: 1850, cuota: 360.29 },
    { max: 2030, cuota: 380.88 },
    { max: 2330, cuota: 401.47 },
    { max: 2760, cuota: 427.21 },
    { max: 3190, cuota: 452.94 },
    { max: 3620, cuota: 478.68 },
    { max: 4050, cuota: 504.41 },
    { max: 6000, cuota: 545.59 },
    { max: null as number | null, cuota: 607.35 },
  ],
  irpfBrackets: [
    { upTo: 12450, rate: 0.19 },
    { upTo: 20200, rate: 0.24 },
    { upTo: 35200, rate: 0.30 },
    { upTo: 60000, rate: 0.37 },
    { upTo: 300000, rate: 0.45 },
    { upTo: null as number | null, rate: 0.47 },
  ],
  minimoPersonal: 5550,
  gdjRate: 0.05,            // gastos difícil justificación
  gdjCap: 2000,
  tarifaPlana: 80,         // €/міс для новачків
  tarifaPlanaConfirmed2026: false,  // не підтверджено для 2026 — орієнтовно
  ivaRate: 0.21,
} as const;

export type EsResult = {
  grossYear: number;
  cuotaMonth: number;
  cuotaYear: number;
  gdjYear: number;
  irpfBase: number;
  irpfYear: number;
  netYear: number;
  netMonth: number;
};

function cuotaMonthly(rendimientoMonthly: number, tarifaPlana: boolean): number {
  if (tarifaPlana) return ES_TAX_2026.tarifaPlana;
  for (const t of ES_TAX_2026.cuotaTramos) {
    const hi = t.max === null ? Infinity : t.max;
    if (rendimientoMonthly <= hi) return t.cuota;
  }
  return ES_TAX_2026.cuotaTramos[ES_TAX_2026.cuotaTramos.length - 1].cuota;
}

function irpfRaw(base: number): number {
  let tax = 0;
  let prev = 0;
  for (const b of ES_TAX_2026.irpfBrackets) {
    const cap = b.upTo === null ? Infinity : b.upTo;
    if (base > prev) {
      tax += (Math.min(base, cap) - prev) * b.rate;
      prev = cap;
    } else break;
  }
  return tax;
}

/**
 * @param monthlyIncome місячний дохід
 * @param monthlyExpenses реальні витрати/міс (зменшують rendimiento й базу)
 * @param firstYear перший рік (tarifa plana)
 */
export function calcES(
  monthlyIncome: number,
  monthlyExpenses = 0,
  firstYear = false
): EsResult {
  const t = ES_TAX_2026;
  const grossYear = monthlyIncome * 12;
  const round = (n: number) => Math.round(n * 100) / 100;

  // rendimiento для траншу cuota = (дохід − витрати) − 7%
  const netMonthlyForTramo = (monthlyIncome - monthlyExpenses) * (1 - t.cuotaGenericDeduction);
  const cuotaMonth = cuotaMonthly(netMonthlyForTramo, firstYear);
  const cuotaYear = cuotaMonth * 12;

  const expensesYear = monthlyExpenses * 12;

  // gastos difícil justificación: 5% від (дохід − витрати − cuota), max 2000
  const gdjBase = Math.max(0, grossYear - expensesYear - cuotaYear);
  const gdjYear = Math.min(gdjBase * t.gdjRate, t.gdjCap);

  // база IRPF = дохід − витрати − cuota − gdj
  const irpfBase = Math.max(0, grossYear - expensesYear - cuotaYear - gdjYear);

  // IRPF з урахуванням mínimo personal (кредит за першою ставкою)
  const irpfYear = Math.max(0, irpfRaw(irpfBase) - irpfRaw(t.minimoPersonal));

  const netYear = grossYear - expensesYear - cuotaYear - irpfYear;

  return {
    grossYear: Math.round(grossYear),
    cuotaMonth: round(cuotaMonth),
    cuotaYear: Math.round(cuotaYear),
    gdjYear: Math.round(gdjYear),
    irpfBase: Math.round(irpfBase),
    irpfYear: Math.round(irpfYear),
    netYear: Math.round(netYear),
    netMonth: Math.round(netYear / 12),
  };
}
