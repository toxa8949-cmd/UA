"use server";

import { z } from "zod";
import { createAdminSupabase } from "@/lib/supabase";
import { slugify } from "@/lib/slugify";
import { PLACE_CATEGORIES } from "@/lib/places";

const CATEGORY_SLUGS = PLACE_CATEGORIES.map((c) => c.slug);

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Вкажіть назву закладу (мінімум 2 символи)")
    .max(120, "Назва занадто довга"),
  category: z
    .string()
    .refine((v) => CATEGORY_SLUGS.includes(v), "Оберіть категорію зі списку"),
  country_id: z.string().uuid("Оберіть країну"),
  city_id: z.string().uuid().optional().or(z.literal("")),
  description: z
    .string()
    .trim()
    .min(20, "Опишіть заклад детальніше (мінімум 20 символів)")
    .max(600, "Опис занадто довгий (максимум 600 символів)"),
  address: z.string().trim().max(200, "Адреса занадто довга").optional(),
  phone: z.string().trim().max(30, "Телефон занадто довгий").optional(),
  website: z
    .string()
    .trim()
    .url("Вкажіть повне посилання, напр. https://example.com")
    .max(200)
    .optional()
    .or(z.literal("")),
  instagram: z.string().trim().max(60).optional(),
  telegram: z.string().trim().max(60).optional(),
  email: z
    .string()
    .trim()
    .email("Невірний формат email")
    .max(120)
    .optional()
    .or(z.literal("")),
  working_hours: z.string().trim().max(120).optional(),
});

export type SubmitPlaceState = {
  ok: boolean;
  error?: string;
};

/**
 * Публічна подача бізнесу в каталог «Українцям поруч».
 * Створює запис зі status='pending' — публікація лише після модерації в адмінці.
 * Захист від спаму: honeypot-поле + серверна валідація zod.
 */
export async function submitPlace(
  _prev: SubmitPlaceState,
  formData: FormData
): Promise<SubmitPlaceState> {
  // Honeypot: приховане поле, яке заповнюють лише боти
  if ((formData.get("company") as string)?.length) {
    return { ok: true }; // тихо «приймаємо», нічого не зберігаючи
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    category: String(formData.get("category") ?? ""),
    country_id: String(formData.get("country_id") ?? ""),
    city_id: String(formData.get("city_id") ?? ""),
    description: String(formData.get("description") ?? ""),
    address: String(formData.get("address") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    website: String(formData.get("website") ?? ""),
    instagram: String(formData.get("instagram") ?? "").replace(/^@/, ""),
    telegram: String(formData.get("telegram") ?? "").replace(/^@/, ""),
    email: String(formData.get("email") ?? ""),
    working_hours: String(formData.get("working_hours") ?? ""),
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Перевірте заповнені поля",
    };
  }
  const d = parsed.data;

  const languages = formData
    .getAll("languages")
    .map(String)
    .filter((l) => /^[a-z]{2}$/.test(l));
  if (!languages.length) {
    return { ok: false, error: "Оберіть хоча б одну мову обслуговування" };
  }

  // Унікальний slug: транслітерація назви + короткий суфікс
  const slug = `${slugify(d.name) || "place"}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;

  const payload = {
    name: d.name,
    slug,
    description: d.description,
    category: d.category,
    country_id: d.country_id,
    city_id: d.city_id || null,
    address: d.address || null,
    phone: d.phone || null,
    website: d.website || null,
    instagram: d.instagram || null,
    telegram: d.telegram || null,
    email: d.email || null,
    working_hours: d.working_hours || null,
    languages,
    is_ukrainian_owned: formData.get("is_ukrainian_owned") === "on",
    is_featured: false,
    plan: "free",
    status: "pending",
    updated_at: new Date().toISOString(),
  };

  const supabase = createAdminSupabase();
  const { error } = await supabase.from("places").insert(payload as never);

  if (error) {
    return {
      ok: false,
      error: "Не вдалося надіслати заявку. Спробуйте ще раз пізніше.",
    };
  }

  return { ok: true };
}
