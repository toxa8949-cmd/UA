import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getCitiesWithCountry } from "@/server/queries/cities";
import { buildMetadata } from "@/lib/seo";
import { formatMoney } from "@/lib/format";
import { ArrowUpRight } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Міста Європи для українців",
  description: "Життя, робота, оренда та зарплати у популярних містах Польщі, Німеччини, Чехії, Іспанії та Португалії.",
  path: "/cities",
});

export default async function CitiesPage() {
  const cities = await getCitiesWithCountry();

  // групуємо за країною
  const byCountry = new Map<string, { name: string; emoji: string | null; cities: typeof cities }>();
  for (const c of cities) {
    const key = c.country?.slug ?? "other";
    if (!byCountry.has(key)) {
      byCountry.set(key, { name: c.country?.name ?? "Інші", emoji: c.country?.emoji ?? null, cities: [] });
    }
    byCountry.get(key)!.cities.push(c);
  }

  return (
    <>
      <Breadcrumbs items={[{ name: "Головна", url: "/" }, { name: "Міста", url: "/cities" }]} />
      <div className="container pb-16">
        <h1 className="font-display text-3xl font-bold text-ink">Міста Європи</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Детально про життя, роботу, оренду та зарплати в популярних містах.
        </p>

        {cities.length === 0 ? (
          <p className="mt-8 text-slate-500">Міста зʼявляться найближчим часом.</p>
        ) : (
          <div className="mt-10 space-y-10">
            {[...byCountry.entries()].map(([slug, group]) => (
              <div key={slug}>
                <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-ink">
                  <span>{group.emoji}</span> {group.name}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.cities.map((city) => (
                    <Link
                      key={city.id}
                      href={`/cities/${city.slug}`}
                      className="group flex flex-col rounded-2xl border border-sand-300 bg-white p-5 transition-colors hover:border-emerald/40"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display font-semibold text-ink">{city.name}</span>
                        <ArrowUpRight size={16} className="text-emerald transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                      {city.short_description && (
                        <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600">{city.short_description}</p>
                      )}
                      {city.average_rent != null && city.country?.currency && (
                        <p className="mt-3 text-xs text-slate-500">
                          Оренда від <span className="font-mono font-medium text-ink">{formatMoney(city.average_rent, city.country.currency)}</span>
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
