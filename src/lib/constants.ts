export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://localhost:3000",
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Українці за кордоном",
  description:
    "Порівнюйте країни, рахуйте витрати на життя, знаходьте банки, страхування, eSIM та сервіси для переїзду.",
  locale: "uk_UA",
  twitter: "@ukrabroad",
} as const;

export const COUNTRY_SLUGS = [
  "poland",
  "germany",
  "czech-republic",
  "spain",
  "portugal",
] as const;

export type CountrySlug = (typeof COUNTRY_SLUGS)[number];

export const SERVICE_CATEGORIES = [
  { slug: "banks", name: "Банки" },
  { slug: "money-transfer", name: "Перекази грошей" },
  { slug: "esim", name: "eSIM" },
  { slug: "insurance", name: "Страхування" },
  { slug: "accounting", name: "Бухгалтерія" },
  { slug: "crm", name: "CRM" },
  { slug: "hosting", name: "Хостинг" },
  { slug: "ai-tools", name: "AI-інструменти" },
  { slug: "housing", name: "Пошук житла" },
  { slug: "jobs", name: "Пошук роботи" },
] as const;

export const CALCULATORS = [
  {
    slug: "cost-of-living",
    country: null,
    group: "general",
    title: "Вартість життя",
    description: "Порахуйте місячні витрати на життя у вибраній країні.",
  },
  {
    slug: "relocation-budget",
    country: null,
    group: "general",
    title: "Бюджет переїзду",
    description: "Оцініть, скільки коштів потрібно для переїзду.",
  },
  {
    slug: "salary-netto-brutto",
    country: "poland",
    group: "salary",
    title: "Зарплата netto/brutto (Польща)",
    description: "Точний розрахунок netto з brutto на umowa o pracę: ZUS, zdrowotna, PIT. Актуально на 2026.",
  },
  {
    slug: "salary-netto-czech",
    country: "czech",
    group: "salary",
    title: "Зарплата netto/brutto (Чехія)",
    description: "Точний розрахунок čistá mzda з hrubá: sociální, zdravotní, daň. Актуально на 2026.",
  },
  {
    slug: "salary-netto-germany",
    country: "germany",
    group: "salary",
    title: "Зарплата netto/brutto (Німеччина)",
    description: "Розрахунок Netto з Brutto: Lohnsteuer, Soli, соцвнески, Steuerklasse. Актуально на 2026.",
  },
  {
    slug: "salary-netto-spain",
    country: "spain",
    group: "salary",
    title: "Зарплата netto/bruto (Іспанія)",
    description: "Розрахунок salario neto з bruto: Seguridad Social, IRPF, 12/14 виплат. Актуально на 2026.",
  },
  {
    slug: "salary-netto-portugal",
    country: "portugal",
    group: "salary",
    title: "Зарплата netto/bruto (Португалія)",
    description: "Розрахунок salário líquido з ilíquido: Segurança Social, IRS retenção. Актуально на 2026.",
  },
  {
    slug: "tax-jdg-poland",
    country: "poland",
    group: "tax",
    title: "Податки ФОП (JDG) у Польщі",
    description: "Скільки на руки на JDG: Ryczałt, Liniowy чи Skala. Актуально на 2026.",
  },
  {
    slug: "tax-osvc-czech",
    country: "czech",
    group: "tax",
    title: "Податки ФОП (OSVČ) у Чехії",
    description: "Скільки на руки на OSVČ: paušální daň чи витратні режими. Актуально на 2026.",
  },
  {
    slug: "tax-independent-portugal",
    country: "portugal",
    group: "tax",
    title: "Податки самозайнятого у Португалії",
    description: "Скільки на руки на recibos verdes: regime simplificado, IRS, SS. Актуально на 2026.",
  },
  {
    slug: "tax-autonomo-spain",
    country: "spain",
    group: "tax",
    title: "Податки autónomo в Іспанії",
    description: "Скільки на руки як autónomo: cuota за траншами, IRPF, tarifa plana. Актуально на 2026.",
  },
  {
    slug: "tax-freelancer-germany",
    country: "germany",
    group: "tax",
    title: "Податки самозайнятого в Німеччині",
    description: "Скільки на руки: Einkommensteuer, Soli, Gewerbesteuer. Freiberufler чи Gewerbe. Актуально на 2026.",
  },
] as const;

export const MAIN_NAV = [
  { href: "/countries", label: "Країни" },
  { href: "/cities", label: "Міста" },
  { href: "/articles", label: "Статті" },
  { href: "/news", label: "Новини" },
  { href: "/calculators", label: "Калькулятори" },
  { href: "/places", label: "Українцям поруч" },
  { href: "/services", label: "Сервіси" },
] as const;

export const FOOTER_LINKS = [
  { href: "/deals", label: "Бонуси" },
  { href: "/compare", label: "Порівняння" },
  { href: "/about", label: "Про проєкт" },
  { href: "/contact", label: "Контакти" },
  { href: "/privacy-policy", label: "Політика конфіденційності" },
  { href: "/terms", label: "Умови користування" },
  { href: "/affiliate-disclosure", label: "Партнерські посилання" },
] as const;

export const COUNTRY_CODES: Record<string, string> = {
  poland: "PL",
  germany: "DE",
  "czech-republic": "CZ",
  spain: "ES",
  portugal: "PT",
};

// Перелінковка: схожі/суміжні країни для кожної (для SEO та навігації)
export const RELATED_COUNTRIES: Record<string, string[]> = {
  poland: ["czech-republic", "germany"],
  germany: ["poland", "czech-republic"],
  "czech-republic": ["poland", "germany"],
  spain: ["portugal", "germany"],
  portugal: ["spain", "germany"],
};
