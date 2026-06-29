import "server-only";
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
