"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArticleCard } from "./ArticleCard";
import { Search, X, LayoutGrid, Globe, ArrowRight } from "lucide-react";
import type { Article, Country } from "@/types/db";

type Cat = { id: string; name: string; slug: string };
type GroupBy = "country" | "category";

export function ArticleCatalog({
  articles,
  countries,
  categories,
}: {
  articles: Article[];
  countries: Country[];
  categories: Cat[];
}) {
  const [query, setQuery] = useState("");
  const [countryId, setCountryId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [groupBy, setGroupBy] = useState<GroupBy>("country");

  // нормалізований пошук
  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      if (countryId && a.country_id !== countryId) return false;
      if (categoryId && a.category_id !== categoryId) return false;
      if (q) {
        const hay = `${a.title} ${a.excerpt ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [articles, countryId, categoryId, q]);

  const isFiltering = Boolean(q || countryId || categoryId);
  const reset = () => {
    setQuery("");
    setCountryId("");
    setCategoryId("");
  };

  // мапи для швидкого доступу
  const countryById = useMemo(
    () => new Map(countries.map((c) => [c.id, c])),
    [countries]
  );
  const catById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  // згруповані секції (тільки коли НЕ фільтруємо — дефолтний структурований вигляд)
  const groups = useMemo(() => {
    if (isFiltering) return [];
    const map = new Map<string, Article[]>();
    for (const a of filtered) {
      const key =
        groupBy === "country" ? a.country_id ?? "_" : a.category_id ?? "_";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    }
    // порядок секцій: за порядком countries/categories у даних
    const order =
      groupBy === "country"
        ? countries.map((c) => c.id)
        : categories.map((c) => c.id);
    const sorted: { key: string; label: string; emoji: string; items: Article[] }[] = [];
    for (const id of order) {
      const items = map.get(id);
      if (items && items.length) {
        if (groupBy === "country") {
          const c = countryById.get(id);
          sorted.push({
            key: id,
            label: c?.name ?? "Інше",
            emoji: c?.emoji ?? "",
            items,
          });
        } else {
          const c = catById.get(id);
          sorted.push({ key: id, label: c?.name ?? "Інше", emoji: "", items });
        }
      }
    }
    // решта без країни/категорії
    const rest = map.get("_");
    if (rest && rest.length) {
      sorted.push({ key: "_", label: "Інше", emoji: "", items: rest });
    }
    return sorted;
  }, [isFiltering, filtered, groupBy, countries, categories, countryById, catById]);

  return (
    <div>
      {/* ── Панель керування ── */}
      <div className="rounded-2xl border border-sand-300 bg-white p-4 sm:p-5">
        {/* Пошук */}
        <div className="relative">
          <Search
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Пошук статей: податки, банк, оренда, JDG…"
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

        {/* Чіпи країн */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setCountryId("")}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              !countryId
                ? "bg-ink text-white"
                : "border border-sand-300 text-slate-600 hover:bg-sand-200"
            }`}
          >
            Усі країни
          </button>
          {countries.map((c) => (
            <button
              key={c.id}
              onClick={() => setCountryId(countryId === c.id ? "" : c.id)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                countryId === c.id
                  ? "bg-ink text-white"
                  : "border border-sand-300 text-slate-600 hover:bg-sand-200"
              }`}
            >
              {c.emoji} {c.name}
            </button>
          ))}
        </div>

        {/* Категорія + групування + лічильник */}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-sand-200 pt-4">
          {categories.length > 0 && (
            <select
              aria-label="Тема"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="rounded-xl border border-sand-300 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-emerald"
            >
              <option value="">Усі теми</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          {/* Перемикач групування (активний лише без фільтрів) */}
          {!isFiltering && (
            <div className="inline-flex rounded-xl border border-sand-300 bg-sand-100/60 p-0.5">
              <button
                onClick={() => setGroupBy("country")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  groupBy === "country" ? "bg-white text-ink shadow-sm" : "text-slate-500"
                }`}
              >
                <Globe size={13} /> За країнами
              </button>
              <button
                onClick={() => setGroupBy("category")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  groupBy === "category" ? "bg-white text-ink shadow-sm" : "text-slate-500"
                }`}
              >
                <LayoutGrid size={13} /> За темами
              </button>
            </div>
          )}

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

      {/* ── Результати ── */}
      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-sand-300 bg-white p-10 text-center">
          <p className="text-slate-500">За вашим запитом статей не знайдено.</p>
          <button
            onClick={reset}
            className="mt-3 text-sm font-medium text-emerald hover:text-emerald-700"
          >
            Скинути фільтри
          </button>
        </div>
      ) : isFiltering ? (
        // Плоска сітка — коли фільтр/пошук активні
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      ) : (
        // Згруповані блоки — дефолтний структурований вигляд
        <div className="mt-8 space-y-12">
          {groups.map((g) => (
            <section key={g.key}>
              <div className="mb-4 flex items-end justify-between">
                <h2 className="font-display text-xl font-bold text-ink">
                  {g.emoji && <span className="mr-1.5">{g.emoji}</span>}
                  {g.label}
                  <span className="ml-2 text-sm font-normal text-slate-400">
                    {g.items.length}
                  </span>
                </h2>
                {groupBy === "country" && g.key !== "_" && (
                  <Link
                    href={`/countries/${countryById.get(g.key)?.slug ?? ""}`}
                    className="group inline-flex items-center gap-1 text-sm font-medium text-emerald hover:text-emerald-700"
                  >
                    Про країну
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
