"use server";

import { createAdminSupabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slugify";
import { readingTime } from "@/lib/format";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function fd(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  return v == null || v === "" ? null : String(v);
}

export async function saveArticle(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminSupabase();

  const id = fd(formData, "id");
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  const slug = fd(formData, "slug") || slugify(title);

  const payload = {
    title,
    slug,
    excerpt: fd(formData, "excerpt"),
    content,
    cover_image: fd(formData, "cover_image"),
    country_id: fd(formData, "country_id"),
    category_id: fd(formData, "category_id"),
    status: (fd(formData, "status") ?? "draft") as "draft" | "published" | "archived",
    seo_title: fd(formData, "seo_title"),
    seo_description: fd(formData, "seo_description"),
    reading_time: readingTime(content),
    published_at:
      fd(formData, "status") === "published" ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    await supabase.from("articles").update(payload as never).eq("id", id);
  } else {
    await supabase.from("articles").insert(payload as never);
  }

  revalidatePath("/articles");
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function deleteArticle(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const supabase = createAdminSupabase();
  await supabase.from("articles").delete().eq("id", id);
  revalidatePath("/admin/articles");
  revalidatePath("/articles");
}
