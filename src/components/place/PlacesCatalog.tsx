"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, MapPin, Phone, Instagram, Globe, Star } from "lucide-react";
import {
  PLACE_CATEGORIES,
  PLACE_GROUPS,
  placeCategoryLabel,
  getPlaceCategory,
} from "@/lib/places";
import type { PlaceWithRelations, Country } from "@/types/db";

export function PlacesCatalog({
  places,
  countries,
}: {
  places: PlaceWithRelations[];
  countries: Country[];
}) {
  const [query, setQuery] = useState("");
  const [countrySlug, setCountrySlug] = useState("");
  const [category, setCategory] = useState("");

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    return places.filter((p) => {
      if (countrySlug && p.country?.slug !== countrySlug) return false;
      if (category && p.category !== category) return false;
      if (q) {
        const hay = `${p.name} ${p.description ?? ""} ${p.city?.name ?? ""} ${
          p.country?.name ?? ""
        } ${placeCategoryLabel(p.category)}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [places, countrySlug, category, q]);

  const isFiltering = Boolean(q || countrySlug || category);
  const reset = () => {
    setQuery("");
    setCountrySlug("");
    setCategory("");
  };

  // категорії, у яких реально є місця (щоб не показувати порожні)
  const usedCategories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of places) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    return PLACE_CATEGORIES.filter((c) => counts.has(c.slug)).map((c) => ({
      ...c,
      count: counts.get(c.slug)!,
    }));
  }, [places]);

  // згруповані секції за категорією (дефолтний вигляд)
  const groups = useMemo(() => {
    if (isFiltering) return [];
    const byCat = new Map<string, PlaceWithRelations[]>();
    for (const p of filtered) {
      if (!byCat.has(p.category)) byCat.set(p.category, []);
      byCat.get(p.category)!.push(p);
    }
    return PLACE_CATEGORIES.filter((c) => byCat.has(c.slug)).map((c) => ({
      ...c,
      items: byCat.get(c.slug)!,
    }));
  }, [isFiltering, filtered]);

  const PlaceCard = ({ place }: { place: PlaceWithRelations }) => {
    const cat = getPlaceCategory(place.category);
    const Icon = cat?.icon;
    return (
      <Link
        href={`/places/${place.slug}`}
        className="group flex flex-col rounded-2xl border border-sand-300 bg-white p-5 transition-colors hover:border-emerald/40"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald">
            {Icon && <Icon size={18} />}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display font-semibold leading-snug text-ink group-hover:text-emerald">
                {place.name}
              </h3>
              {place.is_featured && (
                <Star size={14} className="mt-0.5 shrink-0 fill-gold-500 text-gold-500" />
              )}
            </div>
            <p className="mt-0.5 text-xs text-slate-400">
              {placeCategoryLabel(place.category)}
              {place.city && ` · ${place.city.name}`}
            </p>
          </div>
        </div>

        {place.description && (
          <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">
            {place.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
          {place.address && (
            <span className="inline-flex items-center gap-1">
              <MapPin size={12} /> {place.address}
            </span>
          )}
        </div>
        {place.languages?.includes("uk") && (
          <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald">
            Обслуговують українською
          </span>
        )}
      </Link>
    );
  };

  return (
    <div>
      {/* Панель керування */}
      <div className="rounded-2xl border border-sand-300 bg-white p-4 sm:p-5">
        <div className="relative">
          <Search
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Знайти: бухгалтер, стоматолог, садочок, кафе…"
            className="w-full rounded-xl border border-sand-300 bg-sand-100/60 py-2.5 pl-10 pr-10 text-sm text-ink outline-none transition-colors focus:border-emerald focus:bg-white"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Очистити пошук"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ink"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Країни */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setCountrySlug("")}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              !countrySlug
                ? "bg-ink text-white"
                : "border border-sand-300 text-slate-600 hover:bg-sand-200"
            }`}
          >
            Усі країни
          </button>
          {countries.map((c) => (
            <button
              key={c.id}
              onClick={() => setCountrySlug(countrySlug === c.slug ? "" : c.slug)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                countrySlug === c.slug
                  ? "bg-ink text-white"
                  : "border border-sand-300 text-slate-600 hover:bg-sand-200"
              }`}
            >
              {c.emoji} {c.name}
            </button>
          ))}
        </div>

        {/* Категорія + лічильник */}
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-sand-200 pt-4">
          <select
            aria-label="Категорія"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-sand-300 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-emerald"
          >
            <option value="">Усі категорії</option>
            {usedCategories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label} ({c.count})
              </option>
            ))}
          </select>

          {isFiltering && (
            <button
              onClick={reset}
              className="inline-flex items-center gap-1 text-sm font-medium text-emerald hover:text-emerald-700"
            >
              <X size={14} /> Скинути
            </button>
          )}
          <span className="ml-auto text-sm text-slate-500">
            {isFiltering ? "Знайдено: " : "Усього: "}
            <span className="font-medium text-ink">{filtered.length}</span>
          </span>
        </div>
      </div>

      {/* Результати */}
      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-sand-300 bg-white p-10 text-center">
          <p className="text-slate-500">За вашим запитом нічого не знайдено.</p>
          <button
            onClick={reset}
            className="mt-3 text-sm font-medium text-emerald hover:text-emerald-700"
          >
            Скинути фільтри
          </button>
        </div>
      ) : isFiltering ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      ) : (
        <div className="mt-8 space-y-12">
          {groups.map((g) => (
            <section key={g.slug}>
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald">
                  <g.icon size={16} />
                </span>
                <h2 className="font-display text-xl font-bold text-ink">
                  {g.label}
                  <span className="ml-2 text-sm font-normal text-slate-400">
                    {g.items.length}
                  </span>
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((p) => (
                  <PlaceCard key={p.id} place={p} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
