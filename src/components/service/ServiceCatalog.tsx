"use client";

import { useMemo, useState } from "react";
import { ServiceCard } from "./ServiceCard";
import { COUNTRY_CODES } from "@/lib/constants";
import { SlidersHorizontal, X } from "lucide-react";
import type { ServiceWithRelations, Country } from "@/types/db";

type Cat = { id: string; name: string; slug: string };
type Sort = "featured" | "rating" | "name";

export function ServiceCatalog({
  services,
  countries,
  categories,
}: {
  services: ServiceWithRelations[];
  countries: Country[];
  categories: Cat[];
}) {
  const [countryId, setCountryId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [minRating, setMinRating] = useState<number>(0);
  const [sort, setSort] = useState<Sort>("featured");

  const filtered = useMemo(() => {
    let list = services.filter((s) => {
      if (categoryId && s.category_id !== categoryId) return false;
      if (minRating && (s.rating ?? 0) < minRating) return false;
      if (countryId && !s.countries.some((c) => c.id === countryId)) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      if (sort === "name") return a.name.localeCompare(b.name, "uk");
      // featured: спочатку рекомендовані, потім за рейтингом
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
      return (b.rating ?? 0) - (a.rating ?? 0);
    });
    return list;
  }, [services, countryId, categoryId, minRating, sort]);

  const hasFilters = countryId || categoryId || minRating > 0;

  function reset() {
    setCountryId(""); setCategoryId(""); setMinRating(0); setSort("featured");
  }

  const selectCls =
    "rounded-xl border border-sand-300 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-emerald";

  return (
    <div>
      {/* Панель фільтрів */}
      <div className="rounded-2xl border border-sand-300 bg-white p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <SlidersHorizontal size={16} /> Фільтри
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <select aria-label="Країна" value={countryId} onChange={(e) => setCountryId(e.target.value)} className={selectCls}>
            <option value="">Усі країни</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {COUNTRY_CODES[c.slug] ?? ""} {c.name}
              </option>
            ))}
          </select>

          <select aria-label="Категорія" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={selectCls}>
            <option value="">Усі категорії</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select aria-label="Рейтинг" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} className={selectCls}>
            <option value={0}>Будь-який рейтинг</option>
            <option value={3}>Від 3★</option>
            <option value={4}>Від 4★</option>
            <option value={4.5}>Від 4.5★</option>
          </select>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-slate-400">Сортувати:</span>
            <select aria-label="Сортування" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={selectCls}>
              <option value="featured">Рекомендовані</option>
              <option value="rating">За рейтингом</option>
              <option value="name">За назвою</option>
            </select>
          </div>
        </div>

        {hasFilters && (
          <button onClick={reset} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-emerald hover:text-emerald-700">
            <X size={14} /> Скинути фільтри
          </button>
        )}
      </div>

      {/* Лічильник */}
      <p className="mt-5 text-sm text-slate-500">
        Знайдено: <span className="font-medium text-ink">{filtered.length}</span>
      </p>

      {/* Сітка */}
      {filtered.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => <ServiceCard key={s.id} service={s} />)}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-sand-300 bg-white p-10 text-center">
          <p className="text-slate-500">За вибраними фільтрами сервісів не знайдено.</p>
          <button onClick={reset} className="mt-3 text-sm font-medium text-emerald hover:text-emerald-700">
            Скинути фільтри
          </button>
        </div>
      )}
    </div>
  );
}
