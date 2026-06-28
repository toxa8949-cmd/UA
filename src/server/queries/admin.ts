import "server-only";
import { createAdminSupabase } from "@/lib/supabase";
import type { Article, Country, Service, Deal, Category } from "@/types/db";

// Адмін-запити: бачать ВЕСЬ контент (включно з draft/archived).

export async function adminListArticles(): Promise<
  (Article & { country_name: string | null })[]
> {
  const supabase = createAdminSupabase();
  const { data } = await supabase
    .from("articles")
    .select("*, country:countries(name)")
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as unknown as (Article & {
    country: { name: string } | null;
  })[];
  return rows.map((r) => ({ ...r, country_name: r.country?.name ?? null }));
}

export async function adminGetArticle(id: string): Promise<Article | null> {
  const supabase = createAdminSupabase();
  const { data } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
  return (data ?? null) as Article | null;
}

export async function adminListCountries(): Promise<Country[]> {
  const supabase = createAdminSupabase();
  const { data } = await supabase.from("countries").select("*").order("name");
  return (data ?? []) as Country[];
}

export async function adminGetCountry(id: string): Promise<Country | null> {
  const supabase = createAdminSupabase();
  const { data } = await supabase.from("countries").select("*").eq("id", id).maybeSingle();
  return (data ?? null) as Country | null;
}

export async function adminListServices(): Promise<Service[]> {
  const supabase = createAdminSupabase();
  const { data } = await supabase.from("services").select("*").order("name");
  return (data ?? []) as Service[];
}

export async function adminGetService(id: string): Promise<Service | null> {
  const supabase = createAdminSupabase();
  const { data } = await supabase.from("services").select("*").eq("id", id).maybeSingle();
  return (data ?? null) as Service | null;
}

export async function adminListDeals(): Promise<Deal[]> {
  const supabase = createAdminSupabase();
  const { data } = await supabase.from("deals").select("*").order("created_at", { ascending: false });
  return (data ?? []) as Deal[];
}

export async function adminListCategories(type?: Category["type"]): Promise<Category[]> {
  const supabase = createAdminSupabase();
  let q = supabase.from("categories").select("*").order("name");
  if (type) q = q.eq("type", type);
  const { data } = await q;
  return (data ?? []) as Category[];
}

// ─── Аналітика ───
export async function adminStats() {
  const supabase = createAdminSupabase();
  const since7 = new Date(Date.now() - 7 * 86400_000).toISOString();

  const [articles, countries, services, deals, clicksTotal, clicks7] = await Promise.all([
    supabase.from("articles").select("id", { count: "exact", head: true }),
    supabase.from("countries").select("id", { count: "exact", head: true }),
    supabase.from("services").select("id", { count: "exact", head: true }),
    supabase.from("deals").select("id", { count: "exact", head: true }),
    supabase.from("affiliate_clicks").select("id", { count: "exact", head: true }),
    supabase.from("affiliate_clicks").select("id", { count: "exact", head: true }).gte("created_at", since7),
  ]);

  return {
    articles: articles.count ?? 0,
    countries: countries.count ?? 0,
    services: services.count ?? 0,
    deals: deals.count ?? 0,
    clicksTotal: clicksTotal.count ?? 0,
    clicks7: clicks7.count ?? 0,
  };
}

export async function adminTopServices(limit = 10) {
  const supabase = createAdminSupabase();
  // Беремо всі кліки з service_id та групуємо в памʼяті (для MVP-обсягів достатньо)
  const { data: clicks } = await supabase
    .from("affiliate_clicks")
    .select("service_id")
    .not("service_id", "is", null)
    .limit(5000);

  const counts = new Map<string, number>();
  for (const row of (clicks ?? []) as { service_id: string }[]) {
    counts.set(row.service_id, (counts.get(row.service_id) ?? 0) + 1);
  }

  const ids = [...counts.keys()];
  if (ids.length === 0) return [];

  const { data: services } = await supabase
    .from("services")
    .select("id, name, slug")
    .in("id", ids);

  return ((services ?? []) as { id: string; name: string; slug: string }[])
    .map((s) => ({ ...s, clicks: counts.get(s.id) ?? 0 }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, limit);
}
