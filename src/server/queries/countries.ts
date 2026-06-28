import { createPublicSupabase } from "@/lib/supabase";
import type { Country } from "@/types/db";

export async function getCountries(): Promise<Country[]> {
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("countries")
    .select("*")
    .eq("status", "published")
    .order("name");
  return (data ?? []) as Country[];
}

export async function getCountryBySlug(slug: string): Promise<Country | null> {
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("countries")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return (data ?? null) as Country | null;
}

export async function getCountrySlugs(): Promise<string[]> {
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("countries")
    .select("slug")
    .eq("status", "published");
  return ((data ?? []) as { slug: string }[]).map((c) => c.slug);
}
