"use server";

import { createAdminSupabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slugify";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

const BUCKET = "places";

function str(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  return v == null || v === "" ? null : String(v);
}

function langs(formData: FormData): string[] {
  // languages приходять як кілька чекбоксів name="languages"
  const all = formData.getAll("languages").map(String).filter(Boolean);
  return Array.from(new Set(all));
}

/**
 * Завантажує фото у Supabase Storage (bucket `places`) і повертає public URL.
 * Викликається з форми через окремий хелпер нижче; тут — серверна логіка.
 */
async function uploadImage(
  file: File | null,
  prefix: string
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  try {
    const supabase = createAdminSupabase();
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: file.type || "image/jpeg", upsert: false });
    if (error) {
      console.error("Storage upload error:", error.message);
      return null;
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl ?? null;
  } catch (e) {
    console.error("Storage upload exception:", e);
    return null;
  }
}

export async function savePlace(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminSupabase();

  const id = str(formData, "id");
  const name = String(formData.get("name") ?? "").trim();
  const slug = str(formData, "slug") || slugify(name);

  // Фото: якщо завантажено новий файл — кладемо в Storage, інакше лишаємо старий URL
  const coverFile = formData.get("cover_file") as File | null;
  const logoFile = formData.get("logo_file") as File | null;
  const uploadedCover = await uploadImage(coverFile, "covers");
  const uploadedLogo = await uploadImage(logoFile, "logos");

  const payload: Record<string, unknown> = {
    name,
    slug,
    description: str(formData, "description"),
    full_description: str(formData, "full_description"),
    category: str(formData, "category"),
    country_id: str(formData, "country_id"),
    city_id: str(formData, "city_id"),
    address: str(formData, "address"),
    phone: str(formData, "phone"),
    website: str(formData, "website"),
    instagram: str(formData, "instagram"),
    telegram: str(formData, "telegram"),
    email: str(formData, "email"),
    working_hours: str(formData, "working_hours"),
    languages: langs(formData),
    is_ukrainian_owned: formData.get("is_ukrainian_owned") === "on",
    is_featured: formData.get("is_featured") === "on",
    plan: (str(formData, "plan") ?? "free") as "free" | "featured" | "premium",
    status: (str(formData, "status") ?? "published") as
      | "pending"
      | "published"
      | "rejected"
      | "archived",
    seo_title: str(formData, "seo_title"),
    seo_description: str(formData, "seo_description"),
    updated_at: new Date().toISOString(),
  };

  // Зображення оновлюємо лише якщо завантажили нове, або є явний URL у полі
  const coverUrl = uploadedCover ?? str(formData, "cover_image");
  const logoUrl = uploadedLogo ?? str(formData, "logo");
  if (coverUrl !== null) payload.cover_image = coverUrl;
  if (logoUrl !== null) payload.logo = logoUrl;

  let dbError: { message: string; details?: string; hint?: string; code?: string } | null = null;
  if (id) {
    const { error } = await supabase.from("places").update(payload as never).eq("id", id);
    dbError = error;
  } else {
    const { error } = await supabase.from("places").insert(payload as never);
    dbError = error;
  }

  if (dbError) {
    // Показуємо справжню причину (колонка/тип/enum) замість голого 500
    throw new Error(
      `Помилка збереження: ${dbError.message}` +
        (dbError.details ? ` | ${dbError.details}` : "") +
        (dbError.hint ? ` | підказка: ${dbError.hint}` : "") +
        (dbError.code ? ` | код: ${dbError.code}` : "")
    );
  }

  revalidatePath("/places");
  revalidatePath("/admin/places");
  revalidateTag("places");
  redirect("/admin/places");
}

export async function setPlaceStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as
    | "pending"
    | "published"
    | "rejected"
    | "archived";
  const supabase = createAdminSupabase();
  await supabase
    .from("places")
    .update({ status, updated_at: new Date().toISOString() } as never)
    .eq("id", id);
  revalidatePath("/admin/places");
  revalidatePath("/places");
  revalidateTag("places");
}

export async function deletePlace(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const supabase = createAdminSupabase();
  await supabase.from("places").delete().eq("id", id);
  revalidatePath("/admin/places");
  revalidatePath("/places");
  revalidateTag("places");
}
