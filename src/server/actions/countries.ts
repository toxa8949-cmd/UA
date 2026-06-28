"use server";

import { createAdminSupabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function num(formData: FormData, key: string): number | null {
  const v = formData.get(key);
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function str(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  return v == null || v === "" ? null : String(v);
}

function parseGuides(raw: string | null): Record<string, { title: string; body: string }[]> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const out: Record<string, { title: string; body: string }[]> = {};
      for (const [k, v] of Object.entries(parsed)) {
        if (Array.isArray(v)) {
          out[k] = v
            .filter((x: unknown) => x && typeof (x as { title?: unknown }).title === "string" && typeof (x as { body?: unknown }).body === "string")
            .map((x) => ({ title: (x as { title: string }).title, body: (x as { body: string }).body }));
        }
      }
      return out;
    }
  } catch {
    // некоректний JSON — повертаємо порожнє
  }
  return {};
}

function parseFaq(raw: string | null): { q: string; a: string }[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((x) => x && typeof x.q === "string" && typeof x.a === "string")
        .map((x) => ({ q: x.q, a: x.a }));
    }
  } catch {
    // ігноруємо некоректний JSON — лишаємо без змін краще не перетирати
  }
  return [];
}

export async function saveCountry(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminSupabase();
  const id = str(formData, "id");

  const payload = {
    short_description: str(formData, "short_description"),
    capital: str(formData, "capital"),
    currency: str(formData, "currency"),
    language: str(formData, "language"),
    average_salary: num(formData, "average_salary"),
    minimum_salary: num(formData, "minimum_salary"),
    average_rent: num(formData, "average_rent"),
    cost_of_living_index: num(formData, "cost_of_living_index"),
    tax_summary: str(formData, "tax_summary"),
    business_summary: str(formData, "business_summary"),
    healthcare_summary: str(formData, "healthcare_summary"),
    education_summary: str(formData, "education_summary"),
    transport_summary: str(formData, "transport_summary"),
    seo_title: str(formData, "seo_title"),
    seo_description: str(formData, "seo_description"),
    faq: parseFaq(str(formData, "faq")),
    guides: parseGuides(str(formData, "guides")),
    updated_at: new Date().toISOString(),
  };

  if (id) {
    await supabase.from("countries").update(payload as never).eq("id", id);
    revalidatePath(`/countries`);
  }
  revalidatePath("/admin/countries");
  redirect("/admin/countries");
}
