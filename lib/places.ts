import {
  Calculator,
  Scale,
  Brain,
  Stethoscope,
  Smile,
  Building2,
  Baby,
  GraduationCap,
  BookOpen,
  ShoppingBag,
  Coffee,
  UtensilsCrossed,
  Scissors,
  Wrench,
  Languages,
  Home,
  type LucideIcon,
} from "lucide-react";

export type PlaceCategory = {
  slug: string;
  label: string;
  group: string;
  icon: LucideIcon;
};

// Групи категорій — для логічної навігації в каталозі
export const PLACE_GROUPS: { slug: string; label: string }[] = [
  { slug: "services", label: "Послуги" },
  { slug: "kids", label: "Діти й освіта" },
  { slug: "health", label: "Здоровʼя" },
  { slug: "everyday", label: "Покупки й побут" },
];

export const PLACE_CATEGORIES: PlaceCategory[] = [
  // Послуги
  { slug: "accountant", label: "Бухгалтери", group: "services", icon: Calculator },
  { slug: "lawyer", label: "Юристи", group: "services", icon: Scale },
  { slug: "psychologist", label: "Психологи", group: "services", icon: Brain },
  { slug: "translator", label: "Перекладачі", group: "services", icon: Languages },
  { slug: "realtor", label: "Ріелтори", group: "services", icon: Home },
  // Діти й освіта
  { slug: "kindergarten", label: "Садочки", group: "kids", icon: Baby },
  { slug: "school", label: "Школи", group: "kids", icon: Building2 },
  { slug: "tutor", label: "Репетитори", group: "kids", icon: GraduationCap },
  { slug: "courses", label: "Курси", group: "kids", icon: BookOpen },
  // Здоровʼя
  { slug: "doctor", label: "Лікарі", group: "health", icon: Stethoscope },
  { slug: "dentist", label: "Стоматологи", group: "health", icon: Smile },
  { slug: "clinic", label: "Клініки", group: "health", icon: Building2 },
  // Покупки й побут
  { slug: "shop", label: "Магазини", group: "everyday", icon: ShoppingBag },
  { slug: "cafe", label: "Кафе", group: "everyday", icon: Coffee },
  { slug: "restaurant", label: "Ресторани", group: "everyday", icon: UtensilsCrossed },
  { slug: "beauty", label: "Краса", group: "everyday", icon: Scissors },
  { slug: "repair", label: "Майстри", group: "everyday", icon: Wrench },
];

const BY_SLUG = new Map(PLACE_CATEGORIES.map((c) => [c.slug, c]));

export function getPlaceCategory(slug: string): PlaceCategory | undefined {
  return BY_SLUG.get(slug);
}

export function placeCategoryLabel(slug: string): string {
  return BY_SLUG.get(slug)?.label ?? slug;
}

// Мова → читабельний підпис
export const LANGUAGE_LABELS: Record<string, string> = {
  uk: "українська",
  pl: "польська",
  cs: "чеська",
  de: "німецька",
  es: "іспанська",
  pt: "португальська",
  en: "англійська",
};

// ─── Авто-генерація SEO-контенту для сторінки місця ──────────
// Якщо немає редакційного full_description, генеруємо корисний текст із даних.

type PlaceForContent = {
  name: string;
  category: string;
  description: string | null;
  city: { name: string } | null;
  country: { name: string } | null;
  languages: string[];
  address: string | null;
  phone: string | null;
  working_hours: string | null;
};

// родовий відмінок категорії для тексту ("послуги бухгалтера", "до юриста")
const CATEGORY_GENITIVE: Record<string, string> = {
  accountant: "бухгалтерські послуги",
  lawyer: "юридичні послуги",
  psychologist: "психологічну допомогу",
  translator: "послуги перекладача",
  realtor: "допомогу з житлом",
  kindergarten: "місце в дитячому садку",
  school: "навчання",
  tutor: "репетиторські послуги",
  courses: "курси",
  doctor: "медичну допомогу",
  dentist: "стоматологічні послуги",
  clinic: "медичні послуги",
  shop: "українські товари",
  cafe: "українську кухню",
  restaurant: "українську кухню",
  beauty: "послуги краси",
  repair: "послуги майстра",
};

/** Фраза «що шукають» для SEO-текстів (експорт для лендінгів). */
export function categoryServicePhrase(slug: string): string {
  return CATEGORY_GENITIVE[slug] ?? "послуги";
}

// ─── Локативи для SEO-заголовків («у Варшаві», «у Польщі») ──

export const COUNTRY_LOCATIVE: Record<string, string> = {
  poland: "у Польщі",
  germany: "у Німеччині",
  "czech-republic": "у Чехії",
  spain: "в Іспанії",
  portugal: "у Португалії",
};

const CITY_LOCATIVE: Record<string, string> = {
  Варшава: "у Варшаві",
  Краків: "у Кракові",
  Вроцлав: "у Вроцлаві",
  Гданськ: "у Гданську",
  Познань: "у Познані",
  Лодзь: "у Лодзі",
  Щецин: "у Щецині",
  Катовіце: "у Катовіце",
  Люблін: "у Любліні",
  Берлін: "у Берліні",
  Мюнхен: "у Мюнхені",
  Гамбург: "у Гамбурзі",
  Франкфурт: "у Франкфурті",
  Кельн: "у Кельні",
  Дюссельдорф: "у Дюссельдорфі",
  Штутгарт: "у Штутгарті",
  Лейпциг: "у Лейпцигу",
  Дрезден: "у Дрездені",
  Прага: "у Празі",
  Брно: "у Брно",
  Острава: "в Остраві",
  Пльзень: "у Пльзені",
  Мадрид: "у Мадриді",
  Барселона: "у Барселоні",
  Валенсія: "у Валенсії",
  Аліканте: "в Аліканте",
  Малага: "у Малазі",
  Севілья: "у Севільї",
  Лісабон: "у Лісабоні",
  Порту: "у Порту",
};

/** «у Варшаві» або безпечне «у місті X», якщо форми немає в словнику. */
export function cityLocative(name: string): string {
  return CITY_LOCATIVE[name] ?? `у місті ${name}`;
}

export function generatePlaceIntro(p: PlaceForContent): string[] {
  const cityName = p.city?.name ?? "";
  const inCity = cityName ? ` у місті ${cityName}` : "";
  const label = placeCategoryLabel(p.category).toLowerCase();
  const service = CATEGORY_GENITIVE[p.category] ?? "послуги";
  const speaksUk = p.languages?.includes("uk");

  const paras: string[] = [];

  // 1. Вступ
  paras.push(
    `${p.name} — це ${label.replace(/и$/, "")}${inCity}${
      p.country?.name ? `, ${p.country.name}` : ""
    }. ${
      speaksUk
        ? "Обслуговування доступне українською мовою, що особливо зручно для українців, які нещодавно переїхали й ще не вільно володіють місцевою."
        : "Заклад орієнтований на потреби української спільноти за кордоном."
    }`
  );

  // 2. Чим корисно
  if (p.description) {
    paras.push(p.description);
  }
  paras.push(
    `Якщо ви шукаєте ${service}${inCity} з обслуговуванням українською — це один із варіантів, які варто розглянути. ${
      p.address
        ? `Заклад розташований за адресою ${p.address}.`
        : ""
    } ${
      p.working_hours ? `Графік роботи: ${p.working_hours}.` : ""
    }`.trim()
  );

  return paras;
}

export function generatePlaceFaqs(p: PlaceForContent): { question: string; answer: string }[] {
  const cityName = p.city?.name ?? "";
  const inCity = cityName ? ` у ${cityName}` : "";
  const speaksUk = p.languages?.includes("uk");
  const faqs: { question: string; answer: string }[] = [];

  faqs.push({
    question: `Чи обслуговують в «${p.name}» українською мовою?`,
    answer: speaksUk
      ? `Так, ${p.name} обслуговує клієнтів українською мовою. Ви можете спілкуватися рідною мовою без мовного барʼєра.`
      : `Уточніть це питання безпосередньо при зверненні. Мови обслуговування вказані на цій сторінці.`,
  });

  if (p.address) {
    faqs.push({
      question: `Де розташований «${p.name}»?`,
      answer: `Адреса: ${p.address}${
        p.country?.name ? `, ${p.country.name}` : ""
      }. Точне розташування дивіться у блоці контактів.`,
    });
  }

  if (p.phone) {
    faqs.push({
      question: `Як звʼязатися з «${p.name}»?`,
      answer: `Телефон: ${p.phone}. Інші способи звʼязку (сайт, інстаграм, телеграм) вказані у блоці контактів, якщо доступні.`,
    });
  }

  faqs.push({
    question: `Як знайти інших українських спеціалістів${inCity}?`,
    answer: `У розділі «Українцям поруч» зібрані українські бізнеси та спеціалісти за кордоном — бухгалтери, юристи, лікарі, садочки, магазини та інші. Скористайтеся пошуком і фільтрами за містом і категорією.`,
  });

  return faqs;
}
