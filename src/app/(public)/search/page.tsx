"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { placeCategoryLabel } from "@/lib/places";

type Results = {
  articles: { title: string; slug: string; excerpt: string | null }[];
  countries: { name: string; slug: string; emoji: string | null }[];
  services: { name: string; slug: string; description: string | null }[];
  places: { name: string; slug: string; category: string; city: { name: string } | null }[];
};

const EMPTY: Results = { articles: [], countries: [], services: [], places: [] };

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Results>(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q.trim().length < 2) {
      setResults(EMPTY);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults({ ...EMPTY, ...data });
      } catch {
        setResults(EMPTY);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  const total = results.articles.length + results.countries.length + results.services.length + results.places.length;

  return (
    <div className="container max-w-2xl pb-16 pt-8">
      <h1 className="text-3xl font-bold text-ink">Пошук</h1>
      <div className="relative mt-6">
        <SearchIcon size={18} className="absolute left-3 top-3.5 text-slate-400" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Введіть запит: країна, стаття, сервіс..."
          className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-emerald"
        />
      </div>

      {loading && <p className="mt-6 text-sm text-slate-400">Пошук...</p>}

      {/* Порожній стан: підказки замість білого екрана */}
      {q.trim().length < 2 && (
        <div className="mt-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Популярне в каталозі
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              { href: "/places/c/lawyer", label: "Юристи" },
              { href: "/places/c/accountant", label: "Бухгалтери" },
              { href: "/places/c/dentist", label: "Стоматологи" },
              { href: "/places/c/kindergarten", label: "Садочки" },
              { href: "/places/c/shop", label: "Українські магазини" },
              { href: "/places/c/psychologist", label: "Психологи" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full border border-sand-300 bg-white px-4 py-1.5 text-sm text-slate-600 transition-colors hover:border-emerald/40 hover:text-emerald"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Популярні калькулятори
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              { href: "/calculators/salary-netto-brutto", label: "Зарплата netto/brutto (Польща)" },
              { href: "/calculators/tax-jdg-poland", label: "Податки JDG" },
              { href: "/calculators/salary-netto-germany", label: "Зарплата в Німеччині" },
              { href: "/calculators/cost-of-living", label: "Вартість життя" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full border border-sand-300 bg-white px-4 py-1.5 text-sm text-slate-600 transition-colors hover:border-emerald/40 hover:text-emerald"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {!loading && q.trim().length >= 2 && total === 0 && (
        <p className="mt-6 text-slate-500">Нічого не знайдено за запитом «{q}».</p>
      )}

      {results.countries.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Країни</h2>
          <div className="space-y-1">
            {results.countries.map((c) => (
              <Link key={c.slug} href={`/countries/${c.slug}`} className="block rounded-lg px-3 py-2 hover:bg-sand-200/50">
                {c.emoji} {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {results.places.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Українцям поруч</h2>
          <div className="space-y-1">
            {results.places.map((p) => (
              <Link key={p.slug} href={`/places/${p.slug}`} className="block rounded-lg px-3 py-2 hover:bg-sand-200/50">
                <span className="font-medium text-slate-800">{p.name}</span>
                <span className="block text-sm text-slate-500">
                  {placeCategoryLabel(p.category)}
                  {p.city?.name ? ` · ${p.city.name}` : ""}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {results.articles.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Статті</h2>
          <div className="space-y-1">
            {results.articles.map((a) => (
              <Link key={a.slug} href={`/articles/${a.slug}`} className="block rounded-lg px-3 py-2 hover:bg-sand-200/50">
                <span className="font-medium text-slate-800">{a.title}</span>
                {a.excerpt && <span className="block text-sm text-slate-500 line-clamp-1">{a.excerpt}</span>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {results.services.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Сервіси</h2>
          <div className="space-y-1">
            {results.services.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="block rounded-lg px-3 py-2 hover:bg-sand-200/50">
                <span className="font-medium text-slate-800">{s.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
