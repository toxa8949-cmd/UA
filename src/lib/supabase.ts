import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Браузерний клієнт (client components) */
export function createBrowserSupabase() {
  return createBrowserClient(url, anonKey);
}

/** Серверний клієнт з cookie (читає сесію користувача) */
export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
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

/** Admin клієнт (service role, без cookies) — для seed/адмін операцій */
export function createAdminSupabase() {
  return createServerClient(
    url,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: { getAll: () => [], setAll: () => {} },
    }
  );
}
