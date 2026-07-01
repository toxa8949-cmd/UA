import { createPublicSupabase } from "@/lib/supabase";
import { SITE } from "@/lib/constants";

export const revalidate = 3600;

type FeedRow = {
  title: string;
  slug: string;
  text: string | null;
  published_at: string | null;
  path: string;
};

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** RSS 2.0 фід: останні новини та статті (для агрегаторів і читалок). */
export async function GET() {
  const supabase = createPublicSupabase();

  let items: FeedRow[] = [];
  try {
    const [{ data: news }, { data: articles }] = await Promise.all([
      supabase
        .from("news")
        .select("title, slug, summary, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(20),
      supabase
        .from("articles")
        .select("title, slug, excerpt, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(20),
    ]);

    items = [
      ...((news ?? []) as { title: string; slug: string; summary: string | null; published_at: string | null }[]).map(
        (n) => ({
          title: n.title,
          slug: n.slug,
          text: n.summary,
          published_at: n.published_at,
          path: `/news/${n.slug}`,
        })
      ),
      ...((articles ?? []) as { title: string; slug: string; excerpt: string | null; published_at: string | null }[]).map(
        (a) => ({
          title: a.title,
          slug: a.slug,
          text: a.excerpt,
          published_at: a.published_at,
          path: `/articles/${a.slug}`,
        })
      ),
    ]
      .filter((i) => i.title && i.slug)
      .sort(
        (a, b) =>
          new Date(b.published_at ?? 0).getTime() -
          new Date(a.published_at ?? 0).getTime()
      )
      .slice(0, 30);
  } catch {
    items = [];
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${esc(SITE.name)}</title>
<link>${SITE.url}</link>
<description>${esc(SITE.description)}</description>
<language>uk</language>
${items
  .map(
    (i) =>
      `<item><title>${esc(i.title)}</title><link>${SITE.url}${i.path}</link><guid>${SITE.url}${i.path}</guid>${
        i.published_at
          ? `<pubDate>${new Date(i.published_at).toUTCString()}</pubDate>`
          : ""
      }${i.text ? `<description>${esc(i.text)}</description>` : ""}</item>`
  )
  .join("\n")}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
