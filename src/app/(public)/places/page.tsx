import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PlacesExplorer } from "@/components/place/PlacesExplorer";
import {
  getPlacesPage,
  getPlacesFacets,
  type PlacesSort,
} from "@/server/queries/places";
import { placeCategoryLabel } from "@/lib/places";
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

  const [result, facets] = await Promise.all([
    getPlacesPage({
      countrySlug: country,
      category,
      citySlug: city,
      ukrainianSpeaking: uk,
      ukrainianOwned: owned,
      query: q,
      sort,
      page,
      perPage: 24,
    }),
    getPlacesFacets(country),
  ]);

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Головна", url: "/" },
          { name: "Українцям поруч", url: "/places" },
        ]}
      />
      <div className="container pb-16">
        <h1 className="font-display text-3xl font-bold text-ink">Українцям поруч</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Українські спеціалісти та заклади за кордоном — ті, що обслуговують рідною мовою.
          Бухгалтери, юристи, психологи, лікарі, садочки, магазини й кафе у вашому місті.
        </p>

        <div className="mt-8">
          <PlacesExplorer
            items={result.items}
            total={result.total}
            page={result.page}
            totalPages={result.totalPages}
            facets={facets}
            active={{ country, category, city, uk, owned, q, sort }}
          />
        </div>
      </div>
    </>
  );
}
