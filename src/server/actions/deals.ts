"use server";

import { createAdminSupabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slugify";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function str(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  return v == null || v === "" ? null : String(v);
}

export async function saveDeal(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminSupabase();
  const id = str(formData, "id");
  const title = String(formData.get("title") ?? "").trim();
  const slug = str(formData, "slug") || slugify(title);

  const payload = {
    title,
    slug,
    description: str(formData, "description"),
    service_id: str(formData, "service_id"),
    country_id: str(formData, "country_id"),
    affiliate_url: str(formData, "affiliate_url"),
    bonus_amount: str(formData, "bonus_amount"),
    terms: str(formData, "terms"),
    status: (str(formData, "status") ?? "published") as "draft" | "published" | "archived",
    updated_at: new Date().toISOString(),
  };

  if (id) {
    await supabase.from("deals").update(payload as never).eq("id", id);
  } else {
    await supabase.from("deals").insert(payload as never);
  }

  revalidatePath("/deals");
  revalidatePath("/admin/deals");
  redirect("/admin/deals");
}

export async function deleteDeal(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const supabase = createAdminSupabase();
  await supabase.from("deals").delete().eq("id", id);
  revalidatePath("/admin/deals");
  revalidatePath("/deals");
}
