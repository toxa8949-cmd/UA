import { createPublicSupabase } from "@/lib/supabase";
import type { Article, ArticleWithRelations } from "@/types/db";

const LIST_FIELDS =
  "id, title, slug, excerpt, cover_image, reading_time, published_at, country_id, category_id";

export async function getArticles(opts?: {
  countryId?: string;
  categoryId?: string;
  limit?: number;
}): Promise<Article[]> {
  const supabase = createPublicSupabase();
  let query = supabase
    .from("articles")
    .select(LIST_FIELDS)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (opts?.countryId) query = query.eq("country_id", opts.countryId);
  if (opts?.categoryId) query = query.eq("category_id", opts.categoryId);
  if (opts?.limit) query = query.limit(opts.limit);

  const { data } = await query;
  return (data ?? []) as Article[];
}

export async function getArticleBySlug(
  slug: string
): Promise<ArticleWithRelations | null> {
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("articles")
    .select("*, country:countries(*), category:categories(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return (data ?? null) as ArticleWithRelations | null;
}

export async function getArticleSlugs(): Promise<string[]> {
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("articles")
    .select("slug")
    .eq("status", "published");
  return ((data ?? []) as { slug: string }[]).map((a) => a.slug);
}

export async function getRelatedArticles(
  countryId: string | null,
  excludeSlug: string,
  limit = 3
): Promise<Article[]> {
  if (!countryId) return [];
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("articles")
    .select(LIST_FIELDS)
    .eq("status", "published")
    .eq("country_id", countryId)
    .neq("slug", excludeSlug)
    .limit(limit);
  return (data ?? []) as Article[];
}

// Категорії статей (для фільтра каталогу)
export async function getArticleCategories() {
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("type", "article")
    .order("name");
  return (data ?? []) as { id: string; name: string; slug: string }[];
}
