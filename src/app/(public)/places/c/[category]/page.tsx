import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { PlaceGrid } from "@/components/place/PlaceGrid";
import { getPlacesPageCached, getLandingIndex } from "@/server/queries/places";
import {
  getPlaceCategory,
  placeCategoryLabel,
  categoryServicePhrase,
  cityLocative,
  COUNTRY_LOCATIVE,
} from "@/lib/places";
import {
  buildMetadata,
  breadcrumbJsonLd,
  faqJsonLd,
  itemListJsonLd,
} from "@/lib/seo";
import { ArrowRight } from "lucide-react";

export const revalidate = 3600;

// ISR: сторінки генеруються на першому візиті й кешуються на 1 год
export function generateStaticParams() {
  return [];
}

type Params = Promise<{ category: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getPlaceCategory(category);
  if (!cat) return buildMetadata({ title: "Не знайдено", noIndex: true });

  const { rows } = await getLandingIndex();
  const count = rows.filter((r) => r.category === category).length;

  return buildMetadata({
    title: `${cat.label} для українців за кордоном`,
    description: `${cat.label} з обслуговуванням українською мовою у Європі: Польща, Німеччина, Чехія, Іспанія, Португалія. Перевірені контакти, адреси, графік роботи. Каталог «Українцям поруч».`,
    path: `/places/c/${category}`,
    noIndex: count === 0,
  });
}

export default async function CategoryLandingPage({
  params,
}: {
  params: Params;
}) {
  const { category } = await params;
  const cat = getPlaceCategory(category);
  if (!cat) notFound();

  const [result, index] = await Promise.all([
    getPlacesPageCached({ category, perPage: 24 }),
    getLandingIndex(),
  ]);

  const label = cat.label;
  const service = categoryServicePhrase(category);

  // Міста та країни, де є ця категорія (для перелінковки)
  const cityCounts = new Map<string, number>();
  const countryCounts = new Map<string, number>();
  for (const r of index.rows) {
    if (r.category !== category) continue;
    if (r.city_id) cityCounts.set(r.city_id, (cityCounts.get(r.city_id) ?? 0) + 1);
    if (r.country_id)
      countryCounts.set(r.country_id, (countryCounts.get(r.country_id) ?? 0) + 1);
  }
  const cityLinks = index.cities
    .filter((c) => cityCounts.has(c.id))
    .map((c) => ({ ...c, count: cityCounts.get(c.id)! }))
    .sort((a, b) => b.count - a.count);
  const countryLinks = index.countries
    .filter((c) => countryCounts.has(c.id))
    .map((c) => ({ ...c, count: countryCounts.get(c.id)! }))
    .sort((a, b) => b.count - a.count);

  const breadcrumbs = [
    { name: "Головна", url: "/" },
    { name: "Українцям поруч", url: "/places" },
    { name: label, url: `/places/c/${category}` },
  ];

  const faqs = [
    {
      question: `Як знайти ${service} українською мовою за кордоном?`,
      answer: `У цьому каталозі зібрані ${label.toLowerCase()}, які обслуговують українською. Оберіть своє місто чи країну — на сторінці кожного закладу є контакти, адреса та графік роботи.`,
    },
    {
      question: `У яких країнах є ${label.toLowerCase()} з каталогу?`,
      answer: countryLinks.length
        ? `Наразі ${label.toLowerCase()} представлені у: ${countryLinks
            .map((c) => c.name)
            .join(", ")}. Каталог постійно поповнюється.`
        : `Каталог постійно поповнюється — скористайтеся пошуком у розділі «Українцям поруч».`,
    },
    {
      question: `Як додати свій бізнес до каталогу?`,
      answer: `Заповніть коротку форму на сторінці «Додати бізнес» (zakordonom.eu/places/add) — розміщення в каталозі «Українцям поруч» безкоштовне для українських бізнесів і спеціалістів.`,
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={faqJsonLd(faqs)} />
      {result.items.length > 0 && (
        <JsonLd
          data={itemListJsonLd(
            result.items.map((p) => ({
              name: p.name,
              url: `/places/${p.slug}`,
            })),
            `${label} для українців за кордоном`
          )}
        />
      )}

      <Breadcrumbs items={breadcrumbs} />

      <div className="container pb-16">
        <h1 className="font-display text-3xl font-bold text-ink">
          {label} для українців за кордоном
        </h1>
        <div className="mt-3 max-w-2xl space-y-3 text-slate-600">
          <p>
            Шукаєте {service} з обслуговуванням українською мовою? Тут зібрані{" "}
            {label.toLowerCase()} у країнах Європи, які працюють з українською
            спільнотою — без мовного барʼєра та з розумінням ваших потреб.
          </p>
          <p>
            У каталозі {result.total}{" "}
            {result.total === 1 ? "заклад" : result.total < 5 ? "заклади" : "закладів"}.
            На сторінці кожного — контакти, адреса, графік роботи й мови
            обслуговування.
          </p>
        </div>

        {/* Міста */}
        {cityLinks.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-ink">За містами</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {cityLinks.map((c) => (
                <Link
                  key={c.slug}
                  href={`/places/c/${category}/${c.slug}`}
                  className="rounded-full border border-sand-300 bg-white px-4 py-1.5 text-sm text-slate-600 transition-colors hover:border-emerald/40 hover:text-emerald"
                >
                  {label} {cityLocative(c.name)}{" "}
                  <span className="text-slate-400">({c.count})</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Країни */}
        {countryLinks.length > 0 && (
          <div className="mt-5">
            <h2 className="text-sm font-semibold text-ink">За країнами</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {countryLinks.map((c) => (
                <Link
                  key={c.slug}
                  href={`/places/c/${category}/${c.slug}`}
                  className="rounded-full border border-sand-300 bg-white px-4 py-1.5 text-sm text-slate-600 transition-colors hover:border-emerald/40 hover:text-emerald"
                >
                  {c.emoji ? `${c.emoji} ` : ""}
                  {label} {COUNTRY_LOCATIVE[c.slug] ?? `— ${c.name}`}{" "}
                  <span className="text-slate-400">({c.count})</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Заклади */}
        <div className="mt-10">
          {result.items.length > 0 ? (
            <PlaceGrid places={result.items} />
          ) : (
            <p className="rounded-2xl border border-sand-300 bg-white p-6 text-slate-600">
              У цій категорії поки немає закладів.{" "}
              <Link href="/places" className="font-medium text-emerald">
                Переглянути весь каталог →
              </Link>
            </p>
          )}
        </div>

        {result.total > result.items.length && (
          <div className="mt-8">
            <Link
              href={`/places?category=${category}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Усі {result.total} у каталозі <ArrowRight size={15} />
            </Link>
          </div>
        )}

        {/* FAQ */}
        <div className="mt-14 max-w-2xl">
          <h2 className="mb-4 font-display text-2xl font-bold text-ink">
            Часті запитання
          </h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details
                key={i}
                className="group rounded-xl border border-sand-300 bg-white p-4 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-3 font-medium text-ink">
                  {f.question}
                  <span className="text-slate-400 transition-transform group-open:rotate-180">
                    ⌄
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-slate-600">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
