import "server-only";
import { createPublicSupabase } from "@/lib/supabase";
import type { News, NewsWithCountry } from "@/types/db";

const LIST_FIELDS =
  "id, title, slug, summary, country_id, source_name, source_url, published_at";

export async function getNews(opts?: { countryId?: string; limit?: number }): Promise<NewsWithCountry[]> {
  const supabase = createPublicSupabase();
  let query = supabase
    .from("news")
    .select(`${LIST_FIELDS}, country:countries(id, name, slug, emoji)`)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (opts?.countryId) query = query.eq("country_id", opts.countryId);
  if (opts?.limit) query = query.limit(opts.limit);
  const { data } = await query;
  return ((data ?? []) as unknown as NewsWithCountry[]);
}

export async function getNewsBySlug(slug: string): Promise<NewsWithCountry | null> {
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("news")
    .select("*, country:countries(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return (data ?? null) as NewsWithCountry | null;
}

export async function getNewsSlugs(): Promise<string[]> {
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("news")
    .select("slug")
    .eq("status", "published");
  return ((data ?? []) as { slug: string }[]).map((r) => r.slug);
}
