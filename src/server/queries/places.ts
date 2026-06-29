import "server-only";
import { unstable_cache } from "next/cache";
import { createPublicSupabase } from "@/lib/supabase";
import type { Place, PlaceWithRelations } from "@/types/db";

const LIST_FIELDS =
  "id, name, slug, description, category, country_id, city_id, address, phone, website, instagram, telegram, languages, is_ukrainian_owned, working_hours, is_featured, status";

const RELATIONS =
  "country:countries(id, name, slug, emoji), city:cities(id, name, slug)";

/** Усі опубліковані місця з країною й містом (для каталогу). */
export async function getPlacesWithRelations(): Promise<PlaceWithRelations[]> {
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("places")
    .select(`${LIST_FIELDS}, ${RELATIONS}`)
    .eq("status", "published")
    .order("is_featured", { ascending: false })
    .order("name");
  return (data ?? []) as unknown as PlaceWithRelations[];
}

/** Місця для конкретного міста (для блоку на сторінці міста). */
export async function getPlacesForCity(
  cityId: string,
  limit = 8
): Promise<PlaceWithRelations[]> {
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("places")
    .select(`${LIST_FIELDS}, ${RELATIONS}`)
    .eq("status", "published")
    .eq("city_id", cityId)
    .order("is_featured", { ascending: false })
    .order("name")
    .limit(limit);
  return (data ?? []) as unknown as PlaceWithRelations[];
}

/** Місця для країни (для сторінки країни). */
export async function getPlacesForCountry(
  countryId: string,
  limit = 8
): Promise<PlaceWithRelations[]> {
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("places")
    .select(`${LIST_FIELDS}, ${RELATIONS}`)
    .eq("status", "published")
    .eq("country_id", countryId)
    .order("is_featured", { ascending: false })
    .order("name")
    .limit(limit);
  return (data ?? []) as unknown as PlaceWithRelations[];
}

/** Одне місце за slug (для сторінки місця). */
export async function getPlaceBySlug(
  slug: string
): Promise<PlaceWithRelations | null> {
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("places")
    .select(`*, ${RELATIONS}`)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return (data as unknown as PlaceWithRelations) ?? null;
}

/** Кількість опублікованих місць (для метрик). */
export async function getPlacesCount(): Promise<number> {
  const supabase = createPublicSupabase();
  const { count } = await supabase
    .from("places")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");
  return count ?? 0;
}

// ─── Каталог: фільтри + пагінація + фасети ───────────────────

export type PlacesSort = "featured" | "newest" | "name";

export type PlacesFilter = {
  countrySlug?: string;
  category?: string;
  citySlug?: string;
  ukrainianSpeaking?: boolean;
  ukrainianOwned?: boolean;
  query?: string;
  sort?: PlacesSort;
  page?: number;
  perPage?: number;
};

export type PlacesPage = {
  items: PlaceWithRelations[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

/** Серверна вибірка каталогу з фільтрами + пагінацією. */
export async function getPlacesPage(filter: PlacesFilter): Promise<PlacesPage> {
  const supabase = createPublicSupabase();
  const perPage = filter.perPage ?? 24;
  const page = Math.max(1, filter.page ?? 1);
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  // resolve country/city slug → id
  const [countryId, cityId] = await Promise.all([
    filter.countrySlug ? resolveCountryId(filter.countrySlug) : Promise.resolve(null),
    filter.citySlug ? resolveCityId(filter.citySlug) : Promise.resolve(null),
  ]);

  let q = supabase
    .from("places")
    .select(`${LIST_FIELDS}, ${RELATIONS}`, { count: "exact" })
    .eq("status", "published");

  if (countryId) q = q.eq("country_id", countryId);
  if (cityId) q = q.eq("city_id", cityId);
  if (filter.category) q = q.eq("category", filter.category);
  if (filter.ukrainianSpeaking) q = q.contains("languages", ["uk"]);
  if (filter.ukrainianOwned) q = q.eq("is_ukrainian_owned", true);
  if (filter.query) {
    const term = `%${filter.query.replace(/[%_]/g, "")}%`;
    q = q.or(`name.ilike.${term},description.ilike.${term},address.ilike.${term}`);
  }

  switch (filter.sort) {
    case "newest":
      q = q.order("is_featured", { ascending: false }).order("created_at", { ascending: false });
      break;
    case "name":
      q = q.order("name", { ascending: true });
      break;
    default: // featured
      q = q
        .order("is_featured", { ascending: false })
        .order("plan", { ascending: false })
        .order("name", { ascending: true });
  }

  q = q.range(from, to);

  const { data, count } = await q;
  const total = count ?? 0;
  return {
    items: (data ?? []) as unknown as PlaceWithRelations[],
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
}

async function resolveCountryId(slug: string): Promise<string | null> {
  const supabase = createPublicSupabase();
  const { data } = await supabase.from("countries").select("id").eq("slug", slug).maybeSingle();
  return ((data as { id: string } | null)?.id) ?? null;
}

async function resolveCityId(slug: string): Promise<string | null> {
  const supabase = createPublicSupabase();
  const { data } = await supabase.from("cities").select("id").eq("slug", slug).maybeSingle();
  return ((data as { id: string } | null)?.id) ?? null;
}

export type CountryFacet = { slug: string; name: string; emoji: string | null; count: number };
export type CategoryFacet = { category: string; count: number };
export type CityFacet = { slug: string; name: string; count: number };

export type PlacesFacets = {
  countries: CountryFacet[];
  categories: CategoryFacet[];
  cities: CityFacet[];
  total: number;
};

/**
 * Фасети (лічильники) для опублікованих місць.
 * Кешуються на 1 год — між кліками по сортуванню/пагінації вони ідентичні,
 * тож не б'ємо в БД на кожен фільтр. Ключ кешу залежить від обраної країни.
 */
export const getPlacesFacets = unstable_cache(
  _getPlacesFacets,
  ["places-facets"],
  { revalidate: 3600, tags: ["places"] }
);

async function _getPlacesFacets(countrySlug?: string): Promise<PlacesFacets> {
  const supabase = createPublicSupabase();

  // 1) легкий зріз для лічильників країн і категорій
  const { data: rows } = await supabase
    .from("places")
    .select("country_id, city_id, category")
    .eq("status", "published");

  const list = (rows ?? []) as { country_id: string | null; city_id: string | null; category: string }[];

  // 2) довідники країн/міст
  const [{ data: countriesData }, { data: citiesData }] = await Promise.all([
    supabase.from("countries").select("id, slug, name, emoji"),
    supabase.from("cities").select("id, slug, name, country_id"),
  ]);
  const countries = (countriesData ?? []) as { id: string; slug: string; name: string; emoji: string | null }[];
  const cities = (citiesData ?? []) as { id: string; slug: string; name: string; country_id: string | null }[];
  const countryById = new Map(countries.map((c) => [c.id, c]));
  const cityById = new Map(cities.map((c) => [c.id, c]));
  const selectedCountry = countrySlug ? countries.find((c) => c.slug === countrySlug) ?? null : null;

  // лічильники країн
  const countryCounts = new Map<string, number>();
  // категорії — у межах обраної країни (або всіх)
  const categoryCounts = new Map<string, number>();
  // міста — лише коли обрано країну
  const cityCounts = new Map<string, number>();

  for (const r of list) {
    if (r.country_id) countryCounts.set(r.country_id, (countryCounts.get(r.country_id) ?? 0) + 1);

    const inScope = !selectedCountry || r.country_id === selectedCountry.id;
    if (inScope) {
      categoryCounts.set(r.category, (categoryCounts.get(r.category) ?? 0) + 1);
      if (selectedCountry && r.city_id) {
        cityCounts.set(r.city_id, (cityCounts.get(r.city_id) ?? 0) + 1);
      }
    }
  }

  const countryFacets: CountryFacet[] = [...countryCounts.entries()]
    .map(([id, count]) => {
      const c = countryById.get(id);
      return c ? { slug: c.slug, name: c.name, emoji: c.emoji, count } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b!.count - a!.count) as CountryFacet[];

  const categoryFacets: CategoryFacet[] = [...categoryCounts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  const cityFacets: CityFacet[] = [...cityCounts.entries()]
    .map(([id, count]) => {
      const c = cityById.get(id);
      return c ? { slug: c.slug, name: c.name, count } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b!.count - a!.count) as CityFacet[];

  return {
    countries: countryFacets,
    categories: categoryFacets,
    cities: cityFacets,
    total: list.length,
  };
}

/** Схожі місця: та сама категорія в тому самому місті/країні (для перелінковки). */
export async function getRelatedPlaces(
  place: { id: string; category: string; city_id: string | null; country_id: string | null },
  limit = 3
): Promise<PlaceWithRelations[]> {
  const supabase = createPublicSupabase();
  // спершу та сама категорія + місто
  let query = supabase
    .from("places")
    .select(`${LIST_FIELDS}, ${RELATIONS}`)
    .eq("status", "published")
    .eq("category", place.category)
    .neq("id", place.id)
    .limit(limit);
  if (place.city_id) query = query.eq("city_id", place.city_id);
  else if (place.country_id) query = query.eq("country_id", place.country_id);

  const { data } = await query;
  let results = (data ?? []) as unknown as PlaceWithRelations[];

  // якщо мало — доповнюємо тією ж категорією в країні
  if (results.length < limit && place.country_id) {
    const { data: more } = await supabase
      .from("places")
      .select(`${LIST_FIELDS}, ${RELATIONS}`)
      .eq("status", "published")
      .eq("category", place.category)
      .eq("country_id", place.country_id)
      .neq("id", place.id)
      .limit(limit);
    const extra = (more ?? []) as unknown as PlaceWithRelations[];
    const seen = new Set(results.map((r) => r.id));
    for (const e of extra) {
      if (!seen.has(e.id) && results.length < limit) {
        results.push(e);
        seen.add(e.id);
      }
    }
  }
  return results;
}
