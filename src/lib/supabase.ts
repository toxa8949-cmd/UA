import { createBrowserClient, createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/db";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Браузерний клієнт (client components) */
export function createBrowserSupabase() {
  return createBrowserClient<Database>(url, anonKey);
}

/** Серверний клієнт з cookie (читає сесію користувача) */
export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: { name: string; value: string; options?: CookieOptions }[]
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // викликано з Server Component — ігноруємо
        }
      },
    },
  });
}

/**
 * Статичний публічний клієнт (без cookies) — для читання у Server Components
 * та generateStaticParams. Дозволяє ISR-кешування, не залежить від запиту.
 */
export function createPublicSupabase() {
  return createClient<Database>(url, anonKey, {
    auth: { persistSession: false },
  });
}

/** Admin клієнт (service role, без cookies) — для адмін-операцій та seed */
export function createAdminSupabase() {
  return createClient<Database>(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
}
