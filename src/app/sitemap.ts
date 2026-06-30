import type { MetadataRoute } from "next";
import { createPublicSupabase } from "@/lib/supabase";
import { getPlaceLandingCombos } from "@/server/queries/places";
import { SITE, CALCULATORS } from "@/lib/constants";

export const revalidate = 3600;

type SlugRow = { slug: string; updated_at: string | null };

/** Безпечна дата: невалідне/порожнє значення → поточний момент (валідний <lastmod>). */
function safeDate(value: string | null | undefined): Date {
  if (!value) return new Date();
  const d = new Date(value);
  return isNaN(d.getTime()) ? new Date() : d;
}

/** Окремий безпечний запит: якщо таблиця відсутня чи помилка — повертає []. */
async function fetchSlugs(
  supabase: ReturnType<typeof createPublicSupabase>,
  table: string
): Promise<SlugRow[]> {
  try {
    const { data, error } = await supabase
      .from(table)
      .select("slug, updated_at")
      .eq("status", "published");
    if (error) return [];
    return (data ?? []) as SlugRow[];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;

  const staticPaths = [
    "",
    "/countries",
    "/cities",
    "/places",
    "/articles",
    "/news",
    "/calculators",
    "/services",
    "/deals",
    "/compare",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/affiliate-disclosure",
  ];

  const staticPages: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const calcPages: MetadataRoute.Sitemap = CALCULATORS.map((c) => ({
    url: `${base}/calculators/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  let dynamicPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = createPublicSupabase();
    const [countries, articles, services, cities, news, places] = await Promise.all([
      fetchSlugs(supabase, "countries"),
      fetchSlugs(supabase, "articles"),
      fetchSlugs(supabase, "services"),
      fetchSlugs(supabase, "cities"),
      fetchSlugs(supabase, "news"),
      fetchSlugs(supabase, "places"),
    ]);

    const build = (
      rows: SlugRow[],
      prefix: string,
      changeFrequency: "weekly" | "monthly" | "daily",
      priority: number
    ): MetadataRoute.Sitemap =>
      rows
        .filter((r) => r.slug)
        .map((r) => ({
          url: `${base}${prefix}/${r.slug}`,
          lastModified: safeDate(r.updated_at),
          changeFrequency,
          priority,
        }));

    dynamicPages = [
      ...build(countries, "/countries", "weekly", 0.8),
      ...build(articles, "/articles", "monthly", 0.7),
      ...build(services, "/services", "monthly", 0.6),
      ...build(cities, "/cities", "weekly", 0.8),
      ...build(news, "/news", "daily", 0.6),
      ...build(places, "/places", "weekly", 0.7),
    ];

    // SEO landing-сторінки category × location
    try {
      const combos = await getPlaceLandingCombos();
      const landing: MetadataRoute.Sitemap = combos.map((c) => ({
        url: c.location
          ? `${base}/places/c/${c.category}/${c.location}`
          : `${base}/places/c/${c.category}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.75,
      }));
      dynamicPages = [...dynamicPages, ...landing];
    } catch {
      /* ignore landing errors */
    }
  } catch {
    dynamicPages = [];
  }

  return [...staticPages, ...calcPages, ...dynamicPages];
}
