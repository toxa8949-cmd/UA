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
