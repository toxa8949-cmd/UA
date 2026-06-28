"use client";

import { useMemo, useState } from "react";
import { ArticleCard } from "./ArticleCard";
import { COUNTRY_CODES } from "@/lib/constants";
import { SlidersHorizontal, X } from "lucide-react";
import type { Article, Country } from "@/types/db";

type Cat = { id: string; name: string; slug: string };

export function ArticleCatalog({
  articles,
  countries,
  categories,
}: {
  articles: Article[];
  countries: Country[];
  categories: Cat[];
}) {
  const [countryId, setCountryId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      if (countryId && a.country_id !== countryId) return false;
      if (categoryId && a.category_id !== categoryId) return false;
      return true;
    });
  }, [articles, countryId, categoryId]);

  const hasFilters = countryId || categoryId;
  const reset = () => { setCountryId(""); setCategoryId(""); };

  const selectCls =
    "rounded-xl border border-sand-300 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-emerald";

  return (
    <div>
      {/* Швидкі чіпи по країнах */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCountryId("")}
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
            !countryId ? "bg-ink text-white" : "border border-sand-300 text-slate-600 hover:bg-sand-200"
          }`}
        >
          Усі країни
        </button>
        {countries.map((c) => (
          <button
            key={c.id}
            onClick={() => setCountryId(countryId === c.id ? "" : c.id)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              countryId === c.id ? "bg-ink text-white" : "border border-sand-300 text-slate-600 hover:bg-sand-200"
            }`}
          >
            {c.emoji} {c.name}
          </button>
        ))}
      </div>

      {/* Категорія + лічильник */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {categories.length > 0 && (
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-slate-400" />
            <select aria-label="Категорія" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={selectCls}>
              <option value="">Усі категорії</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}
        {hasFilters && (
          <button onClick={reset} className="inline-flex items-center gap-1 text-sm font-medium text-emerald hover:text-emerald-700">
            <X size={14} /> Скинути
          </button>
        )}
        <span className="ml-auto text-sm text-slate-500">
          Знайдено: <span className="font-medium text-ink">{filtered.length}</span>
        </span>
      </div>

      {/* Сітка */}
      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => <ArticleCard key={a.id} article={a} />)}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-sand-300 bg-white p-10 text-center">
          <p className="text-slate-500">За вибраними фільтрами статей не знайдено.</p>
          <button onClick={reset} className="mt-3 text-sm font-medium text-emerald hover:text-emerald-700">
            Скинути фільтри
          </button>
        </div>
      )}
    </div>
  );
}
