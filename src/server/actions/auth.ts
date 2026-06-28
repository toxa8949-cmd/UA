"use server";

import { createServerSupabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { SITE } from "@/lib/constants";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export async function signInWithEmail(
  _prev: { error?: string; ok?: boolean },
  formData: FormData
): Promise<{ error?: string; ok?: boolean }> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return { error: "Введіть email" };

  // Дозволяємо вхід лише адмінам
  if (!ADMIN_EMAILS.includes(email)) {
    return { error: "Цей email не має доступу до адмінки" };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${SITE.url}/admin`,
    },
  });

  if (error) return { error: "Не вдалося надіслати лист. Спробуйте ще раз." };
  return { ok: true };
}

export async function signOut() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
