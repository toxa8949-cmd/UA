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
