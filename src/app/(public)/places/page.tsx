import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PlacesExplorer } from "@/components/place/PlacesExplorer";
import { Suspense } from "react";
import {
  getPlacesPageCached,
  getPlacesFacets,
  getLandingIndex,
  type PlacesSort,
  type PlacesFilter,
} from "@/server/queries/places";
import { PlacesSkeleton } from "@/components/place/PlacesSkeleton";
import { placeCategoryLabel, cityLocative } from "@/lib/places";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

type SP = Promise<Record<string, string | string[] | undefined>>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function parseSort(v: string | undefined): PlacesSort {
  return v === "newest" || v === "name" ? v : "featured";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SP;
}): Promise<Metadata> {
  const sp = await searchParams;
  const country = first(sp.country);
  const category = first(sp.category);
  const city = first(sp.city);

  // Базовий заголовок
  let title = "Українські послуги та бізнеси за кордоном";
  const parts: string[] = [];
  if (category) parts.push(placeCategoryLabel(category));
  if (city) parts.push(`у місті ${city}`);
  else if (country) parts.push(`у країні ${country}`);
  if (parts.length) {
    title = `${placeCategoryLabel(category ?? "")} для українців ${parts.slice(1).join(" ")}`.trim();
    if (!category) title = `Українські послуги ${parts.join(" ")}`;
  }

  return buildMetadata({
    title,
    description:
      "Каталог українських спеціалістів і закладів у Європі: бухгалтери, юристи, психологи, лікарі, садочки, магазини, кафе. Пошук за країною, містом і категорією.",
    path: "/places",
  });
}

/** Асинхронна частина: дані каталогу (стрімиться через Suspense) */
async function PlacesResults({
  filter,
  active,
}: {
  filter: PlacesFilter;
  active: { country?: string; category?: string; city?: string; uk: boolean; owned: boolean; q?: string; sort: PlacesSort };
}) {
  const [result, facets, index] = await Promise.all([
    getPlacesPageCached(filter),
    getPlacesFacets(filter.countrySlug),
    getLandingIndex(),
  ]);

  // Популярні запити: топ комбінацій категорія × місто для внутрішньої перелінковки
  const comboCounts = new Map<string, number>();
  for (const r of index.rows) {
    if (!r.city_id) continue;
    const key = `${r.category}|${r.city_id}`;
    comboCounts.set(key, (comboCounts.get(key) ?? 0) + 1);
  }
  const cityById = new Map(index.cities.map((c) => [c.id, c]));
  const popularLinks = [...comboCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([key, count]) => {
      const [cat, cityId] = key.split("|");
      const c = cityById.get(cityId);
      return c
        ? {
            href: `/places/c/${cat}/${c.slug}`,
            label: `${placeCategoryLabel(cat)} ${cityLocative(c.name)}`,
            count,
          }
        : null;
    })
    .filter(Boolean) as { href: string; label: string; count: number }[];

  return (
    <>
      <PlacesExplorer
        items={result.items}
        total={result.total}
        page={result.page}
        totalPages={result.totalPages}
        facets={facets}
        active={active}
      />

      {/* Популярні запити — внутрішня перелінковка на SEO-лендінги */}
      {popularLinks.length > 0 && (
        <div className="mt-14 border-t border-sand-300 pt-10">
          <h2 className="text-sm font-semibold text-ink">Популярні запити</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {popularLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full border border-sand-300 bg-white px-4 py-1.5 text-sm text-slate-600 transition-colors hover:border-emerald/40 hover:text-emerald"
              >
                {l.label} <span className="text-slate-400">({l.count})</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default async function PlacesPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const country = first(sp.country);
  const category = first(sp.category);
  const city = first(sp.city);
  const uk = first(sp.uk) === "1";
  const owned = first(sp.owned) === "1";
  const q = first(sp.q);
  const sort = parseSort(first(sp.sort));
  const page = Math.max(1, Number(first(sp.page)) || 1);

  const filter: PlacesFilter = {
    countrySlug: country,
    category,
    citySlug: city,
    ukrainianSpeaking: uk,
    ukrainianOwned: owned,
    query: q,
    sort,
    page,
    perPage: 24,
  };

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Головна", url: "/" },
          { name: "Українцям поруч", url: "/places" },
        ]}
      />
      <div className="container pb-16">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="font-display text-3xl font-bold text-ink">Українцям поруч</h1>
          <Link
            href="/places/add"
            className="rounded-xl bg-emerald px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            + Додати бізнес
          </Link>
        </div>
        <p className="mt-2 max-w-2xl text-slate-600">
          Українські спеціалісти та заклади за кордоном — ті, що обслуговують рідною мовою.
          Бухгалтери, юристи, психологи, лікарі, садочки, магазини й кафе у вашому місті.
        </p>

        <div className="mt-8">
          {/* Шапка рендериться миттєво, дані стрімляться сюди */}
          <Suspense key={JSON.stringify(filter)} fallback={<PlacesSkeleton />}>
            <PlacesResults
              filter={filter}
              active={{ country, category, city, uk, owned, q, sort }}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}
