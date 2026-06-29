// Калькулятор податків для самозайнятого в Німеччині (Freiberufler / Gewerbe).
// Дані станом на 2026 (джерела: §32a EStG, §19 GewStG, BMF).
// Формула Einkommensteuer вивірена на контрольних точках (до євро).
//
// Особливості Німеччини:
// - Einkommensteuer = поліном §32a за зонами (не транші!)
// - Solidaritätszuschlag з Freigrenze (більшість не платять)
// - Freiberufler не платить Gewerbesteuer; Gewerbe платить (з частковим
//   зарахуванням у ESt за §35 EStG)
// - соцстрахування індивідуальне → поле введення користувача

export const DE_TAX_2026 = {
  year: 2026,
  currency: "EUR",
  grundfreibetrag: 12348,
  soli: {
    rate: 0.055,
    freigrenze: 20350,        // ESt, нижче якого Soli = 0
    milderungRate: 0.119,
  },
  gewerbe: {
    freibetrag: 24500,
    messzahl: 0.035,
    typicalHebesatz: 4.0,     // 400%
    estCreditMultiplier: 4.0, // §35 EStG: зарахування до 4× Messbetrag
  },
  socialHint: {
    low: 280,                 // орієнтовний GKV+Pflege для низького доходу
    high: 1230,               // для високого
  },
  ustRate: 0.19,
  kleinunternehmerPrevYear: 25000,
  kleinunternehmerCurrentYear: 100000,
} as const;

// Einkommensteuer за §32a EStG 2026
export function einkommensteuer(zvE: number): number {
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
  if (x <= 277825) {
    return 0.42 * x - 11135.63;
  }
  return 0.45 * x - 19470.38;
}

function soli(est: number): number {
  const s = DE_TAX_2026.soli;
  if (est <= s.freigrenze) return 0;
  return Math.min(s.rate * est, s.milderungRate * (est - s.freigrenze));
}

// Gewerbesteuer (для Gewerbe) + зарахування в ESt (§35)
function gewerbesteuer(gewerbeertrag: number): { gewSt: number; credit: number } {
  const g = DE_TAX_2026.gewerbe;
  const base = Math.max(0, gewerbeertrag - g.freibetrag);
  const messbetrag = base * g.messzahl;
  const gewSt = messbetrag * g.typicalHebesatz;
  // §35: зарахування до 4× Messbetrag, але не більше самої Gewerbesteuer
  const credit = Math.min(messbetrag * g.estCreditMultiplier, gewSt);
  return { gewSt: Math.round(gewSt), credit };
}

export type DeResult = {
  grossYear: number;
  zvE: number;
  estYear: number;
  soliYear: number;
  gewStYear: number;
  socialYear: number;
  netYear: number;
  netMonth: number;
};

/**
 * @param monthlyIncome місячний дохід
 * @param monthlyExpenses витрати/міс (Betriebsausgaben)
 * @param monthlySocial соц. страхування/міс (медичне/пенсійне) — індивідуальне
 * @param isGewerbe true = Gewerbe (з Gewerbesteuer), false = Freiberufler
 */
export function calcDE(
  monthlyIncome: number,
  monthlyExpenses = 0,
  monthlySocial = 0,
  isGewerbe = false
): DeResult {
  const grossYear = monthlyIncome * 12;
  const expensesYear = monthlyExpenses * 12;
  const socialYear = monthlySocial * 12;

  // прибуток від діяльності
  const profit = Math.max(0, grossYear - expensesYear);

  // zvE = прибуток − соц. страхування (Sonderausgaben)
  const zvE = Math.max(0, profit - socialYear);

  const estRaw = einkommensteuer(zvE);

  // Gewerbesteuer + зарахування §35 (тільки для Gewerbe)
  let gewSt = 0;
  let estCredit = 0;
  if (isGewerbe) {
    const g = gewerbesteuer(profit);
    gewSt = g.gewSt;
    estCredit = g.credit;
  }

  const est = Math.max(0, estRaw - estCredit);
  const soliYear = soli(est);

  const totalTax = est + soliYear + gewSt;
  const netYear = grossYear - expensesYear - socialYear - totalTax;

  const round = (n: number) => Math.round(n);
  return {
    grossYear: round(grossYear),
    zvE: round(zvE),
    estYear: round(est),
    soliYear: round(soliYear),
    gewStYear: round(gewSt),
    socialYear: round(socialYear),
    netYear: round(netYear),
    netMonth: round(netYear / 12),
  };
}
