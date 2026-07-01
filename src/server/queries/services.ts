import { createPublicSupabase } from "@/lib/supabase";
import type { Service, ServiceWithRelations, Deal, Country } from "@/types/db";

export async function getServices(opts?: {
  featured?: boolean;
  categoryId?: string;
  limit?: number;
}): Promise<Service[]> {
  const supabase = createPublicSupabase();
  let query = supabase
    .from("services")
    .select("*")
    .eq("status", "published")
    .order("rating", { ascending: false });

  if (opts?.featured) query = query.eq("is_featured", true);
  if (opts?.categoryId) query = query.eq("category_id", opts.categoryId);
  if (opts?.limit) query = query.limit(opts.limit);

  const { data } = await query;
  return (data ?? []) as Service[];
}

export async function getServiceBySlug(
  slug: string
): Promise<ServiceWithRelations | null> {
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("services")
    .select("*, category:categories(*), service_countries(country:countries(*))")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!data) return null;
  const row = data as unknown as Service & {
    category: ServiceWithRelations["category"];
    service_countries: { country: Country }[];
  };
  return {
    ...row,
    countries: (row.service_countries ?? []).map((sc) => sc.country),
  };
}

export async function getServiceSlugs(): Promise<string[]> {
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("services")
    .select("slug")
    .eq("status", "published");
  return ((data ?? []) as { slug: string }[]).map((s) => s.slug);
}

export async function getServicesForCountry(
  countryId: string,
  limit = 6
): Promise<Service[]> {
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("service_countries")
    .select("service:services(*)")
    .eq("country_id", countryId)
    .limit(limit);
  const rows = (data ?? []) as unknown as { service: Service }[];
  return rows.map((r) => r.service).filter((s) => s && s.status === "published");
}

export async function getDeals(limit?: number): Promise<Deal[]> {
  const supabase = createPublicSupabase();
  let query = supabase
    .from("deals")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data } = await query;
  return (data ?? []) as Deal[];
}

// Усі опубліковані сервіси з категорією та країнами — для клієнтського фільтра каталогу
export async function getServicesWithRelations(): Promise<ServiceWithRelations[]> {
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("services")
    .select("*, category:categories(*), service_countries(country:countries(*))")
    .eq("status", "published")
    .order("is_featured", { ascending: false })
    .order("rating", { ascending: false });

  type Row = Service & {
    category: ServiceWithRelations["category"];
    service_countries: { country: Country }[];
  };

  return ((data ?? []) as unknown as Row[]).map((row) => ({
    ...row,
    countries: (row.service_countries ?? []).map((sc) => sc.country).filter(Boolean),
  }));
}

// Категорії сервісів (для фільтра)
export async function getServiceCategories() {
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("type", "service")
    .order("name");
  return (data ?? []) as { id: string; name: string; slug: string }[];
}

/** Схожі сервіси тієї ж категорії (для перелінковки на сторінці сервісу). */
export type RelatedService = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  rating: number | null;
  is_featured: boolean;
  pricing_summary: string | null;
};

export async function getRelatedServices(
  categoryId: string | null,
  excludeSlug: string,
  limit = 3
): Promise<RelatedService[]> {
  if (!categoryId) return [];
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("services")
    .select("id, name, slug, description, rating, is_featured, pricing_summary")
    .eq("status", "published")
    .eq("category_id", categoryId)
    .neq("slug", excludeSlug)
    .order("is_featured", { ascending: false })
    .order("rating", { ascending: false, nullsFirst: false })
    .limit(limit);
  return (data ?? []) as RelatedService[];
}
