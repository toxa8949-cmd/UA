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
function lines(formData: FormData, key: string): string[] {
  const v = String(formData.get(key) ?? "");
  return v.split("\n").map((s) => s.trim()).filter(Boolean);
}

export async function saveService(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminSupabase();
  const id = str(formData, "id");
  const name = String(formData.get("name") ?? "").trim();
  const slug = str(formData, "slug") || slugify(name);
  const ratingRaw = str(formData, "rating");

  const payload = {
    name,
    slug,
    description: str(formData, "description"),
    logo: str(formData, "logo"),
    website_url: str(formData, "website_url"),
    affiliate_url: str(formData, "affiliate_url"),
    category_id: str(formData, "category_id"),
    pros: lines(formData, "pros"),
    cons: lines(formData, "cons"),
    rating: ratingRaw ? Number(ratingRaw) : null,
    pricing_summary: str(formData, "pricing_summary"),
    is_featured: formData.get("is_featured") === "on",
    status: (str(formData, "status") ?? "published") as "draft" | "published" | "archived",
    updated_at: new Date().toISOString(),
  };

  let serviceId = id;
  if (id) {
    await supabase.from("services").update(payload as never).eq("id", id);
  } else {
    const { data } = await supabase.from("services").insert(payload as never).select("id").maybeSingle();
    serviceId = (data as { id: string } | null)?.id ?? null;
  }

  // Звʼязки з країнами
  if (serviceId) {
    const countryIds = formData.getAll("country_ids").map(String);
    await supabase.from("service_countries").delete().eq("service_id", serviceId);
    if (countryIds.length) {
      await supabase.from("service_countries").insert(
        countryIds.map((cid) => ({ service_id: serviceId!, country_id: cid })) as never
      );
    }
  }

  revalidatePath("/services");
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function deleteService(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const supabase = createAdminSupabase();
  await supabase.from("services").delete().eq("id", id);
  revalidatePath("/admin/services");
  revalidatePath("/services");
}
