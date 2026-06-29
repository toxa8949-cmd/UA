// Калькулятор податків OSVČ (ФОП) у Чехії.
// Дані станом на 2026 (джерела: financnisprava.cz, cssz.cz, vzp.cz).
// Математика вивірена проти офіційних прикладів.
//
// ВАЖЛИВО про "на руки" при паушальних витратах:
// paušální výdaje (40/60/80%) — це фіктивне списання для зменшення ПОДАТКУ
// без чеків. Воно НЕ є реальною витратою. Тому "на руки" = дохід − social −
// health − податок (паушальні витрати не віднімаються з кишені).

export const CZ_TAX_2026 = {
  year: 2026,
  currency: "CZK",
  taxRate1: 0.15,
  taxRate2: 0.23,
  threshold23: 1762812,        // поріг переходу 15% → 23% (річний прибуток)
  sleva: 30840,                // sleva na poplatníka (річна), зменшує податок
  social: {
    rate: 0.292,
    baseShare: 0.55,           // база соц. = 55% прибутку
    minAnnual: 60060,          // мін. річний внесок (5005×12, після зниження з липня)
  },
  health: {
    rate: 0.135,
    baseShare: 0.50,           // база мед. = 50% прибутку
    minAnnual: 39672,          // мін. річний внесок (3306×12)
  },
  // Paušální daň — фіксований режим, 3 пасма (річні суми 2026)
  pausalDan: {
    band1: 114876,             // I пасмо, ефективна річна 2026 (з урах. зниження з липня)
    band1Limit: 1500000,       // приблизний ліміт для 60%/80% діяльності
    band2: 200940,             // II пасмо
    band2Limit: 2000000,
    band3: 325668,             // III пасмо
  },
  // Paušální výdaje — відсоток списання витрат за діяльністю
  incomeLimit: 2000000,
  vatThreshold: 2000000,       // поріг реєстрації DPH (оборот/рік)
  vatRate: 0.21,
} as const;

// Відсотки паушальних витрат
export const CZ_EXPENSE_RATES: { value: number; label: string; hint: string }[] = [
  { value: 0.60, label: "60% — IT, послуги, живність", hint: "програмування, більшість послуг (volná živnost)" },
  { value: 0.80, label: "80% — ремесло, сільське госп.", hint: "ремісничі та с/г роботи" },
  { value: 0.40, label: "40% — вільні професії", hint: "інші доходи із самостійної діяльності" },
  { value: 0.30, label: "30% — оренда бізнес-майна", hint: "оренда майна в бізнесі" },
];

export type CzResult = {
  form: "pausal_dan" | "pausal_vydaje" | "real_vydaje";
  formLabel: string;
  grossYear: number;
  socialYear: number;
  healthYear: number;
  taxYear: number;
  netYear: number;
  netMonth: number;
};

function incomeTax(profit: number): number {
  const t = CZ_TAX_2026;
  let tax: number;
  if (profit <= t.threshold23) tax = profit * t.taxRate1;
  else tax = t.threshold23 * t.taxRate1 + (profit - t.threshold23) * t.taxRate2;
  return Math.max(0, tax - t.sleva);
}

function pausalDanYear(annualIncome: number): number {
  const t = CZ_TAX_2026;
  if (annualIncome <= t.pausalDan.band1Limit) return t.pausalDan.band1;
  if (annualIncome <= t.pausalDan.band2Limit) return t.pausalDan.band2;
  return t.pausalDan.band3;
}

/**
 * @param monthlyIncome місячний дохід
 * @param expenseRate відсоток паушальних витрат (для pausal_vydaje)
 * @param realMonthlyExpenses реальні витрати/міс (для real_vydaje)
 */
export function calcCZ(
  monthlyIncome: number,
  expenseRate: number,
  realMonthlyExpenses = 0
): CzResult[] {
  const t = CZ_TAX_2026;
  const grossYear = monthlyIncome * 12;
  const round = (n: number) => Math.round(n);

  // ── PAUŠÁLNÍ DAŇ ── фіксований платіж, усе включено
  const pdPayment = pausalDanYear(grossYear);
  const pdNet = grossYear - pdPayment;

  // ── PAUŠÁLNÍ VÝDAJE ── відсоткове списання (фіктивне)
  // прибуток для податку/внесків = дохід − паушальний відсоток
  const pvProfit = grossYear * (1 - expenseRate);
  const pvSocial = Math.max(pvProfit * t.social.baseShare * t.social.rate, t.social.minAnnual);
  const pvHealth = Math.max(pvProfit * t.health.baseShare * t.health.rate, t.health.minAnnual);
  const pvTax = incomeTax(pvProfit);
  // "на руки" — БЕЗ віднімання паушальних витрат (вони фіктивні)
  const pvNet = grossYear - pvSocial - pvHealth - pvTax;

  // ── REÁLNÉ VÝDAJE ── реальні витрати (віднімаються і з податку, і з кишені)
  const realExpYear = realMonthlyExpenses * 12;
  const rvProfit = Math.max(0, grossYear - realExpYear);
  const rvSocial = Math.max(rvProfit * t.social.baseShare * t.social.rate, t.social.minAnnual);
  const rvHealth = Math.max(rvProfit * t.health.baseShare * t.health.rate, t.health.minAnnual);
  const rvTax = incomeTax(rvProfit);
  const rvNet = grossYear - realExpYear - rvSocial - rvHealth - rvTax;

  return [
    {
      form: "pausal_dan",
      formLabel: "Paušální daň",
      grossYear: round(grossYear),
      socialYear: 0,
      healthYear: 0,
      taxYear: round(pdPayment),
      netYear: round(pdNet),
      netMonth: round(pdNet / 12),
    },
    {
      form: "pausal_vydaje",
      formLabel: `Паушальні витрати ${expenseRate * 100}%`,
      grossYear: round(grossYear),
      socialYear: round(pvSocial),
      healthYear: round(pvHealth),
      taxYear: round(pvTax),
      netYear: round(pvNet),
      netMonth: round(pvNet / 12),
    },
    {
      form: "real_vydaje",
      formLabel: "Реальні витрати",
      grossYear: round(grossYear),
      socialYear: round(rvSocial),
      healthYear: round(rvHealth),
      taxYear: round(rvTax),
      netYear: round(rvNet),
      netMonth: round(rvNet / 12),
    },
  ];
}
