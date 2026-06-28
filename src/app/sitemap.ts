import type { MetadataRoute } from "next";
import { createPublicSupabase } from "@/lib/supabase";
import { SITE, CALCULATORS } from "@/lib/constants";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;

  const staticPages = [
    "",
    "/countries",
    "/articles",
    "/calculators",
    "/services",
    "/deals",
    "/compare",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/affiliate-disclosure",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const calcPages = CALCULATORS.map((c) => ({
    url: `${base}/calculators/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Якщо БД ще не готова або немає env — повертаємо лише статичні сторінки,
  // щоб білд не падав.
  try {
    const supabase = createPublicSupabase();
    const [countries, articles, services] = await Promise.all([
      supabase.from("countries").select("slug, updated_at").eq("status", "published"),
      supabase.from("articles").select("slug, updated_at").eq("status", "published"),
      supabase.from("services").select("slug, updated_at").eq("status", "published"),
    ]);

    type SlugRow = { slug: string; updated_at: string };
    const cRows = (countries.data ?? []) as SlugRow[];
    const aRows = (articles.data ?? []) as SlugRow[];
    const sRows = (services.data ?? []) as SlugRow[];

    const dynamicPages = [
      ...cRows.map((c) => ({
        url: `${base}/countries/${c.slug}`,
        lastModified: new Date(c.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...aRows.map((a) => ({
        url: `${base}/articles/${a.slug}`,
        lastModified: new Date(a.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...sRows.map((s) => ({
        url: `${base}/services/${s.slug}`,
        lastModified: new Date(s.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];

    return [...staticPages, ...calcPages, ...dynamicPages];
  } catch {
    return [...staticPages, ...calcPages];
  }
}
