import { NextResponse } from "next/server";
import { createPublicSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (q.length < 2) {
    return NextResponse.json({ articles: [], countries: [], services: [] });
  }

  const supabase = createPublicSupabase();
  const like = `%${q}%`;

  const [articles, countries, services] = await Promise.all([
    supabase
      .from("articles")
      .select("title, slug, excerpt")
      .eq("status", "published")
      .ilike("title", like)
      .limit(6),
    supabase
      .from("countries")
      .select("name, slug, emoji")
      .eq("status", "published")
      .ilike("name", like)
      .limit(5),
    supabase
      .from("services")
      .select("name, slug, description")
      .eq("status", "published")
      .ilike("name", like)
      .limit(6),
  ]);

  return NextResponse.json({
    articles: articles.data ?? [],
    countries: countries.data ?? [],
    services: services.data ?? [],
  });
}
