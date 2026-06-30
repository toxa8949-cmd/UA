"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, ArrowUpRight, ArrowRight } from "lucide-react";
import { formatMoney } from "@/lib/format";
import type { CityWithCountry, Country } from "@/types/db";

export function CityCatalog({
  cities,
  countries,
}: {
  cities: CityWithCountry[];
  countries: Country[];
}) {
  const [query, setQuery] = useState("");
  const [countrySlug, setCountrySlug] = useState<string>("");

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    return cities.filter((c) => {
      if (countrySlug && c.country?.slug !== countrySlug) return false;
      if (q) {
        const hay = `${c.name} ${c.short_description ?? ""} ${c.country?.name ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [cities, countrySlug, q]);

  const isFiltering = Boolean(q || countrySlug);
  const reset = () => {
    setQuery("");
    setCountrySlug("");
  };

  // згруповані секції за країною (дефолтний структурований вигляд)
  const groups = useMemo(() => {
    if (isFiltering) return [];
    const map = new Map<string, CityWithCountry[]>();
    for (const c of filtered) {
      const key = c.country?.slug ?? "_";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    }
    // порядок за countries
    const out: {
      slug: string;
      name: string;
      emoji: string;
      items: CityWithCountry[];
    }[] = [];
    for (const country of countries) {
      const items = map.get(country.slug);
      if (items && items.length) {
        out.push({
          slug: country.slug,
          name: country.name,
          emoji: country.emoji ?? "",
          items,
        });
      }
    }
    const rest = map.get("_");
    if (rest && rest.length) {
      out.push({ slug: "_", name: "Інші", emoji: "", items: rest });
    }
    return out;
  }, [isFiltering, filtered, countries]);

  const CityCard = ({ city }: { city: CityWithCountry }) => (
    <Link
      href={`/cities/${city.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-sand-300 bg-white transition-colors hover:border-emerald/40"
    >
      {city.cover_image && (
        <div className="relative aspect-[3/2] overflow-hidden bg-sand-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={city.cover_image}
            alt={city.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
      <div className="flex items-start justify-between">
        <div>
          {!city.cover_image && (
            <span className="font-display font-semibold text-ink">{city.name}</span>
          )}
          {city.country && (
            <span className={city.cover_image ? "text-xs text-slate-400" : "ml-2 text-xs text-slate-400"}>
              {city.country.emoji} {city.country.name}
            </span>
          )}
        </div>
        <ArrowUpRight
          size={16}
          className="text-emerald transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
      {city.short_description && (
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600">
          {city.short_description}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        {city.average_rent != null && city.country?.currency && (
          <span>
            Оренда від{" "}
            <span className="font-mono font-medium text-ink">
              {formatMoney(city.average_rent, city.country.currency)}
            </span>
          </span>
        )}
        {city.population && <span>{city.population}</span>}
      </div>
      </div>
    </Link>
  );

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
            placeholder="Знайти місто: Варшава, Прага, Берлін…"
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

        <div className="mt-4 flex flex-wrap items-center gap-2">
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
          <p className="text-slate-500">Міст за вашим запитом не знайдено.</p>
          <button
            onClick={reset}
            className="mt-3 text-sm font-medium text-emerald hover:text-emerald-700"
          >
            Скинути фільтри
          </button>
        </div>
      ) : isFiltering ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CityCard key={c.id} city={c} />
          ))}
        </div>
      ) : (
        <div className="mt-8 space-y-12">
          {groups.map((g) => (
            <section key={g.slug}>
              <div className="mb-4 flex items-end justify-between">
                <h2 className="font-display text-xl font-bold text-ink">
                  {g.emoji && <span className="mr-1.5">{g.emoji}</span>}
                  {g.name}
                  <span className="ml-2 text-sm font-normal text-slate-400">
                    {g.items.length}
                  </span>
                </h2>
                {g.slug !== "_" && (
                  <Link
                    href={`/countries/${g.slug}`}
                    className="group inline-flex items-center gap-1 text-sm font-medium text-emerald hover:text-emerald-700"
                  >
                    Про країну
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((c) => (
                  <CityCard key={c.id} city={c} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
