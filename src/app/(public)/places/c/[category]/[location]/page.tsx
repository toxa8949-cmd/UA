import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { PlaceGrid } from "@/components/place/PlaceGrid";
import {
  getPlacesPage,
  getLandingIndex,
  resolveLandingLocation,
} from "@/server/queries/places";
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

type Params = Promise<{ category: string; location: string }>;

/** «у Варшаві» / «у Польщі» / безпечний fallback */
function locativePhrase(loc: {
  type: "city" | "country";
  name: string;
  slug: string;
}): string {
  if (loc.type === "city") return cityLocative(loc.name);
  return COUNTRY_LOCATIVE[loc.slug] ?? `у країні ${loc.name}`;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { category, location } = await params;
  const cat = getPlaceCategory(category);
  const loc = cat ? await resolveLandingLocation(location) : null;
  if (!cat || !loc) return buildMetadata({ title: "Не знайдено", noIndex: true });

  const where = locativePhrase(loc);
  const result = await getPlacesPage({
    category,
    ...(loc.type === "city" ? { citySlug: loc.slug } : { countrySlug: loc.slug }),
    perPage: 1,
  });

  return buildMetadata({
    title: `${cat.label} для українців ${where}`,
    description: `${cat.label} ${where} з обслуговуванням українською мовою: контакти, адреси, графік роботи. Перевірений каталог «Українцям поруч» для українців за кордоном.`,
    path: `/places/c/${category}/${location}`,
    noIndex: result.total === 0,
  });
}

export default async function CategoryLocationLandingPage({
  params,
}: {
  params: Params;
}) {
  const { category, location } = await params;
  const cat = getPlaceCategory(category);
  if (!cat) notFound();
  const loc = await resolveLandingLocation(location);
  if (!loc) notFound();

  const [result, index] = await Promise.all([
    getPlacesPage({
      category,
      ...(loc.type === "city" ? { citySlug: loc.slug } : { countrySlug: loc.slug }),
      perPage: 24,
    }),
    getLandingIndex(),
  ]);

  const label = cat.label;
  const service = categoryServicePhrase(category);
  const where = locativePhrase(loc);

  // Перелінковка: інші категорії в цій локації + інші локації цієї категорії
  const locMatches = (r: { city_id: string | null; country_id: string | null }) =>
    loc.type === "city" ? r.city_id === loc.id : r.country_id === loc.id;

  const otherCategoryCounts = new Map<string, number>();
  const otherCityCounts = new Map<string, number>();
  for (const r of index.rows) {
    if (locMatches(r) && r.category !== category) {
      otherCategoryCounts.set(
        r.category,
        (otherCategoryCounts.get(r.category) ?? 0) + 1
      );
    }
    if (r.category === category && r.city_id && !(loc.type === "city" && r.city_id === loc.id)) {
      otherCityCounts.set(r.city_id, (otherCityCounts.get(r.city_id) ?? 0) + 1);
    }
  }
  const otherCategories = [...otherCategoryCounts.entries()]
    .map(([slug, count]) => ({ slug, count, label: placeCategoryLabel(slug) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  const otherCities = index.cities
    .filter((c) => otherCityCounts.has(c.id))
    .map((c) => ({ ...c, count: otherCityCounts.get(c.id)! }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const breadcrumbs = [
    { name: "Головна", url: "/" },
    { name: "Українцям поруч", url: "/places" },
    { name: label, url: `/places/c/${category}` },
    { name: loc.name, url: `/places/c/${category}/${location}` },
  ];

  const faqs = [
    {
      question: `Де знайти ${service} українською мовою ${where}?`,
      answer:
        result.total > 0
          ? `У каталозі «Українцям поруч» ${where} зібрано ${result.total} ${
              result.total === 1 ? "заклад" : result.total < 5 ? "заклади" : "закладів"
            } категорії «${label}». На сторінці кожного є контакти, адреса та графік роботи.`
          : `Каталог постійно поповнюється. Скористайтеся пошуком у розділі «Українцям поруч» або перегляньте сусідні міста.`,
    },
    {
      question: `Чи обслуговують ${label.toLowerCase()} ${where} українською?`,
      answer: `На картці кожного закладу вказані мови обслуговування. Заклади з позначкою «Українською» приймають клієнтів рідною мовою — без мовного барʼєра.`,
    },
    {
      question: `Які ще українські послуги є ${where}?`,
      answer: otherCategories.length
        ? `${loc.type === "city" ? `У ${loc.name}` : loc.name} також доступні: ${otherCategories
            .map((c) => c.label.toLowerCase())
            .join(", ")}. Перейдіть у розділ «Українцям поруч» і оберіть категорію.`
        : `Перегляньте повний каталог «Українцям поруч» — там зібрані всі українські бізнеси та спеціалісти за кордоном.`,
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
            `${label} для українців ${where}`
          )}
        />
      )}

      <Breadcrumbs items={breadcrumbs} />

      <div className="container pb-16">
        <h1 className="font-display text-3xl font-bold text-ink">
          {label} для українців {where}
        </h1>
        <div className="mt-3 max-w-2xl space-y-3 text-slate-600">
          <p>
            Шукаєте {service} {where} з обслуговуванням українською мовою?
            {loc.type === "city" && loc.countryName ? ` ${loc.name} (${loc.countryName})` : ""}{" "}
            Нижче — перевірені {label.toLowerCase()}, які працюють з українською
            спільнотою: контакти, адреси та графік роботи на сторінці кожного
            закладу.
          </p>
        </div>

        {/* Заклади */}
        <div className="mt-8">
          {result.items.length > 0 ? (
            <PlaceGrid places={result.items} />
          ) : (
            <p className="rounded-2xl border border-sand-300 bg-white p-6 text-slate-600">
              Тут поки немає закладів цієї категорії.{" "}
              <Link href={`/places/c/${category}`} className="font-medium text-emerald">
                Усі {label.toLowerCase()} за кордоном →
              </Link>
            </p>
          )}
        </div>

        {result.total > result.items.length && (
          <div className="mt-8">
            <Link
              href={`/places?category=${category}&${loc.type === "city" ? "city" : "country"}=${loc.slug}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Усі {result.total} у каталозі <ArrowRight size={15} />
            </Link>
          </div>
        )}

        {/* Перелінковка: інші категорії тут */}
        {otherCategories.length > 0 && (
          <div className="mt-12">
            <h2 className="text-sm font-semibold text-ink">
              Інші українські послуги {where}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {otherCategories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/places/c/${c.slug}/${location}`}
                  className="rounded-full border border-sand-300 bg-white px-4 py-1.5 text-sm text-slate-600 transition-colors hover:border-emerald/40 hover:text-emerald"
                >
                  {c.label} <span className="text-slate-400">({c.count})</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Перелінковка: ця категорія в інших містах */}
        {otherCities.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-ink">
              {label} в інших містах
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {otherCities.map((c) => (
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
