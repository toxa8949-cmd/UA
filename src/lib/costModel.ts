// Орієнтовна модель витрат на життя.
// Базується на реальній середній оренді країни (average_rent) + типові пропорції
// інших категорій відносно оренди. Дає приблизну, але реалістичну картину
// без потреби в окремих даних по кожній категорії.

import type { Country } from "@/types/db";

export type Lifestyle = "economy" | "standard" | "comfort";
export type CityTier = "capital" | "regional";

// Пропорції категорій ВІДНОСНО оренди однієї людини (емпіричні орієнтири).
// food=0.45 означає: їжа ≈ 45% від вартості оренди.
const RATIO = {
  food: 0.5,
  transport: 0.12,
  utilities: 0.18,
  comms: 0.06,
  health: 0.1,
  other: 0.3,
} as const;

// Множники рівня життя
const LIFESTYLE_MULT: Record<Lifestyle, number> = {
  economy: 0.75,
  standard: 1,
  comfort: 1.45,
};

// Множник міста (столиця дорожча за регіон)
const CITY_MULT: Record<CityTier, number> = {
  capital: 1,
  regional: 0.78,
};

export type CostBreakdown = {
  rent: number;
  food: number;
  transport: number;
  utilities: number;
  comms: number;
  health: number;
  other: number;
  total: number;
};

export function estimateCost(
  country: Country,
  opts: { adults: number; children: number; lifestyle: Lifestyle; city: CityTier }
): CostBreakdown {
  const baseRent = country.average_rent ?? 800;
  const { adults, children, lifestyle, city } = opts;
  const people = adults + children;

  const lm = LIFESTYLE_MULT[lifestyle];
  const cm = CITY_MULT[city];

  // Оренда: більша сім'я → більша квартира, але не лінійно (економія на масштабі)
  const rent = Math.round(baseRent * cm * lm * (1 + (people - 1) * 0.25));

  // Інші категорії: масштабуються від оренди однієї людини, з урахуванням людей.
  // Діти рахуються як 0.6 дорослого для споживчих витрат.
  const consumers = adults + children * 0.6;
  const perPersonRent = baseRent * cm;

  const scale = (ratio: number) =>
    Math.round(perPersonRent * ratio * lm * consumers);

  const food = scale(RATIO.food);
  const transport = scale(RATIO.transport);
  const utilities = Math.round(baseRent * cm * RATIO.utilities * lm * (1 + (people - 1) * 0.15));
  const comms = Math.round(perPersonRent * RATIO.comms * lm); // на домогосподарство
  const health = scale(RATIO.health);
  const other = scale(RATIO.other);

  const total = rent + food + transport + utilities + comms + health + other;

  return { rent, food, transport, utilities, comms, health, other, total };
}

export const CATEGORY_LABELS: { key: keyof Omit<CostBreakdown, "total">; label: string }[] = [
  { key: "rent", label: "Оренда житла" },
  { key: "food", label: "Їжа та продукти" },
  { key: "utilities", label: "Комуналка" },
  { key: "transport", label: "Транспорт" },
  { key: "health", label: "Медицина" },
  { key: "comms", label: "Звʼязок та інтернет" },
  { key: "other", label: "Інші витрати" },
];

export const LIFESTYLE_LABELS: { value: Lifestyle; label: string; hint: string }[] = [
  { value: "economy", label: "Економний", hint: "Мінімум, ощадливо" },
  { value: "standard", label: "Середній", hint: "Звичайне життя" },
  { value: "comfort", label: "Комфортний", hint: "Без особливих обмежень" },
];
