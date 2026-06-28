// Конвертація валют до EUR.
// Курси беруться з безкоштовного API ЄЦБ (Frankfurter, без ключа) і кешуються.
// Якщо API недоступний — використовуються резервні приблизні курси.

// Резервні курси до EUR (на випадок недоступності API)
export const FALLBACK_RATES_TO_EUR: Record<string, number> = {
  EUR: 1,
  PLN: 0.23,
  CZK: 0.04,
  USD: 0.92,
  UAH: 0.022,
};

export const CURRENCIES = Object.keys(FALLBACK_RATES_TO_EUR);

export type Rates = Record<string, number>;

/**
 * Повертає курси валют ДО EUR (скільки EUR за 1 одиницю валюти).
 * Кешується на добу через ISR (revalidate на сторінці) + fetch cache.
 * Викликати ТІЛЬКИ на сервері (Server Component / queries).
 */
export async function getEurRates(): Promise<Rates> {
  try {
    // Frankfurter віддає курси ВІД EUR (1 EUR = X валюти).
    const symbols = CURRENCIES.filter((c) => c !== "EUR").join(",");
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=EUR&to=${symbols}`,
      { next: { revalidate: 86400 } } // оновлювати раз на добу
    );
    if (!res.ok) throw new Error("rates fetch failed");
    const data = (await res.json()) as { rates: Record<string, number> };

    // Інвертуємо: курс ДО EUR = 1 / (курс ВІД EUR)
    const toEur: Rates = { EUR: 1 };
    for (const [cur, rate] of Object.entries(data.rates)) {
      if (rate > 0) toEur[cur] = 1 / rate;
    }
    // Доповнюємо валютами, яких немає у відповіді (напр. UAH інколи відсутня)
    for (const c of CURRENCIES) {
      if (toEur[c] == null) toEur[c] = FALLBACK_RATES_TO_EUR[c] ?? 1;
    }
    return toEur;
  } catch {
    return { ...FALLBACK_RATES_TO_EUR };
  }
}

/** Конвертує суму у валюті в EUR за переданими курсами. */
export function toEur(amount: number, currency: string, rates?: Rates): number {
  const table = rates ?? FALLBACK_RATES_TO_EUR;
  const rate = table[currency] ?? 1;
  return Math.round(amount * rate);
}
