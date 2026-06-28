// Приблизні курси до EUR (станом на 2026). Для точних розрахунків
// варто підключити API курсів. Використовується лише для орієнтовної конвертації.
export const RATES_TO_EUR: Record<string, number> = {
  EUR: 1,
  PLN: 0.23,
  CZK: 0.040,
  USD: 0.92,
  UAH: 0.022,
};

export function toEur(amount: number, currency: string): number {
  const rate = RATES_TO_EUR[currency] ?? 1;
  return Math.round(amount * rate);
}

export const CURRENCIES = Object.keys(RATES_TO_EUR);
