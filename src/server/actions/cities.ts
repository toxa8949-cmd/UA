"use server";

import { createAdminSupabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const BUCKET = "places";

function str(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  return v == null || v === "" ? null : String(v);
}

async function uploadImage(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  try {
    const supabase = createAdminSupabase();
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `cities/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: file.type || "image/jpeg", upsert: false });
    if (error) {
      console.error("City banner upload error:", error.message);
      return null;
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl ?? null;
  } catch (e) {
    console.error("City banner upload exception:", e);
    return null;
  }
}

export async function saveCity(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminSupabase();
  const id = String(formData.get("id"));

  const bannerFile = formData.get("cover_file") as File | null;
  const uploadedBanner = await uploadImage(bannerFile);

  const payload: Record<string, unknown> = {
    short_description: str(formData, "short_description"),
    population: str(formData, "population"),
    seo_title: str(formData, "seo_title"),
    seo_description: str(formData, "seo_description"),
    updated_at: new Date().toISOString(),
  };
  const banner = uploadedBanner ?? str(formData, "cover_image");
  if (banner !== null) payload.cover_image = banner;

  const { error } = await supabase.from("cities").update(payload as never).eq("id", id);
  if (error) {
    throw new Error(`Помилка збереження міста: ${error.message}${error.code ? ` | код: ${error.code}` : ""}`);
  }

  revalidatePath("/cities");
  revalidatePath("/admin/cities");
  redirect("/admin/cities");
}
