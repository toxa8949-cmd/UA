import "server-only";
import { createPublicSupabase } from "@/lib/supabase";
import type { City, CityWithCountry, Country } from "@/types/db";

const LIST_FIELDS =
  "id, country_id, name, slug, emoji, short_description, population, average_rent, average_salary, cost_of_living_index, cover_image, status";

export async function getCities(opts?: { countryId?: string; limit?: number }): Promise<City[]> {
  const supabase = createPublicSupabase();
  let query = supabase
    .from("cities")
    .select(LIST_FIELDS)
    .eq("status", "published")
    .order("name");
  if (opts?.countryId) query = query.eq("country_id", opts.countryId);
  if (opts?.limit) query = query.limit(opts.limit);
  const { data } = await query;
  return (data ?? []) as City[];
}

export async function getCitiesWithCountry(): Promise<CityWithCountry[]> {
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("cities")
    .select(`${LIST_FIELDS}, country:countries(id, name, slug, emoji)`)
    .eq("status", "published")
    .order("name");
  return ((data ?? []) as unknown as CityWithCountry[]);
}

export async function getCityBySlug(slug: string): Promise<CityWithCountry | null> {
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("cities")
    .select("*, country:countries(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return (data ?? null) as CityWithCountry | null;
}

export async function getCitySlugs(): Promise<string[]> {
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("cities")
    .select("slug")
    .eq("status", "published");
  return ((data ?? []) as { slug: string }[]).map((r) => r.slug);
}

export async function getCitiesForCountry(countryId: string, limit = 6): Promise<City[]> {
  return getCities({ countryId, limit });
}
