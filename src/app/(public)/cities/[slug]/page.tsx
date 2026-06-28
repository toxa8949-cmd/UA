import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { FaqAccordion } from "@/components/country/FaqAccordion";
import { CountryGuideTabs, type GuideSection } from "@/components/country/CountryGuideTabs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCityBySlug, getCitySlugs, getCitiesForCountry } from "@/server/queries/cities";
import { renderMarkdown } from "@/lib/markdown";
import { buildMetadata, faqJsonLd } from "@/lib/seo";
import { formatMoney } from "@/lib/format";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getCitySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = await getCityBySlug(slug);
  if (!city) return {};
  return buildMetadata({
    title: city.seo_title ?? `Життя у місті ${city.name}`,
    description: city.seo_description ?? city.short_description ?? undefined,
    path: `/cities/${slug}`,
    ogEyebrow: "Місто",
  });
}

const SECTIONS = [
  { key: "business", label: "Документи та бізнес" },
  { key: "tax", label: "Податки" },
  { key: "healthcare", label: "Медицина" },
  { key: "housing", label: "Житло" },
  { key: "transport", label: "Транспорт" },
] as const;

export default async function CityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = await getCityBySlug(slug);
  if (!city) notFound();

  const currency = city.country?.currency ?? "EUR";

  // Інші міста тієї ж країни (для перелінковки)
  const otherCities = city.country
    ? (await getCitiesForCountry(city.country_id, 12)).filter((c) => c.slug !== city.slug)
    : [];

  const stats = [
    city.average_salary != null ? { label: "Середня зарплата", value: formatMoney(city.average_salary, currency) } : null,
    city.average_rent != null ? { label: "Середня оренда", value: formatMoney(city.average_rent, currency) } : null,
    city.population ? { label: "Населення", value: city.population } : null,
    city.cost_of_living_index != null ? { label: "Індекс вартості життя", value: String(city.cost_of_living_index) } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const guides = city.guides ?? {};
  const guideSections: GuideSection[] = SECTIONS
    .map((sec) => ({
      key: sec.key,
      label: sec.label,
      summary: "",
      items: Array.isArray(guides[sec.key]) ? guides[sec.key] : [],
    }))
    .filter((sec) => sec.items.length > 0);

  const { html } = city.full_description
    ? renderMarkdown(city.full_description)
    : { html: "" };

  return (
    <>
      {city.faq.length > 0 && (
        <JsonLd data={faqJsonLd(city.faq.map((f) => ({ question: f.q, answer: f.a })))} />
      )}
      <Breadcrumbs
        items={[
          { name: "Головна", url: "/" },
          { name: "Країни", url: "/countries" },
          ...(city.country ? [{ name: city.country.name, url: `/countries/${city.country.slug}` }] : []),
          { name: city.name, url: `/cities/${slug}` },
        ]}
      />

      {/* Hero */}
      <section className="border-b border-sand-300 bg-sand-200/40">
        <div className="container py-12">
          {city.country && (
            <Link
              href={`/countries/${city.country.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald hover:text-emerald-700"
            >
              <ArrowLeft size={14} /> {city.country.emoji} {city.country.name}
            </Link>
          )}
          <div className="mt-3 flex items-center gap-2">
            <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">{city.name}</h1>
            {city.emoji && <span className="text-3xl">{city.emoji}</span>}
          </div>
          {city.short_description && (
            <p className="mt-3 max-w-2xl text-lg text-slate-600">{city.short_description}</p>
          )}
        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <div className="container py-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <Card key={s.label}>
                <p className="text-sm text-slate-500">{s.label}</p>
                <p className="mt-1 font-display text-xl font-bold text-ink">{s.value}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Розгорнутий опис */}
      {html && (
        <div className="container py-6">
          <div className="prose-content max-w-3xl" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      )}

      {/* Гайди */}
      {guideSections.length > 0 && (
        <div className="container py-8">
          <div className="mb-6">
            <div className="mb-2 font-mono text-xs uppercase tracking-widest text-emerald">Гайди</div>
            <h2 className="font-display text-2xl font-bold text-ink">Життя у місті {city.name}</h2>
          </div>
          <CountryGuideTabs sections={guideSections} />
        </div>
      )}

      {/* FAQ */}
      {city.faq.length > 0 && (
        <Section eyebrow="Питання" title="Часті запитання" className="bg-sand-200/50">
          <div className="max-w-3xl">
            <FaqAccordion faqs={city.faq} />
          </div>
        </Section>
      )}

      {/* Інші міста країни */}
      {otherCities.length > 0 && city.country && (
        <Section eyebrow="Поряд" title={`Інші міста країни ${city.country.name}`}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {otherCities.map((c) => (
              <Link
                key={c.id}
                href={`/cities/${c.slug}`}
                className="group rounded-2xl border border-sand-300 bg-white p-4 transition-colors hover:border-emerald/40"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-semibold text-ink">{c.name}</span>
                  <ArrowUpRight size={15} className="text-emerald transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                {c.average_rent != null && (
                  <p className="mt-1 text-xs text-slate-500">
                    Оренда від {formatMoney(c.average_rent, currency)}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
