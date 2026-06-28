import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { ArticleCard } from "@/components/article/ArticleCard";
import { ServiceCard } from "@/components/service/ServiceCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/Card";
import {
  getCountryBySlug,
  getCountrySlugs,
} from "@/server/queries/countries";
import { getArticles } from "@/server/queries/articles";
import { getServicesForCountry } from "@/server/queries/services";
import { buildMetadata, faqJsonLd } from "@/lib/seo";
import { formatMoney } from "@/lib/format";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getCountrySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);
  if (!country) return {};
  return buildMetadata({
    title: country.seo_title ?? `Життя в країні ${country.name}`,
    description: country.seo_description ?? country.short_description ?? undefined,
    path: `/countries/${slug}`,
  });
}

const SECTIONS = [
  { key: "business_summary", label: "Документи та бізнес" },
  { key: "tax_summary", label: "Податки" },
  { key: "healthcare_summary", label: "Медицина" },
  { key: "education_summary", label: "Освіта" },
  { key: "transport_summary", label: "Транспорт" },
] as const;

export default async function CountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);
  if (!country) notFound();

  const [articles, services] = await Promise.all([
    getArticles({ countryId: country.id, limit: 6 }),
    getServicesForCountry(country.id, 6),
  ]);

  const stats = [
    country.average_salary != null && country.currency
      ? { label: "Середня зарплата", value: formatMoney(country.average_salary, country.currency) }
      : null,
    country.minimum_salary != null && country.currency
      ? { label: "Мінімальна зарплата", value: formatMoney(country.minimum_salary, country.currency) }
      : null,
    country.average_rent != null && country.currency
      ? { label: "Середня оренда", value: formatMoney(country.average_rent, country.currency) }
      : null,
    country.cost_of_living_index != null
      ? { label: "Індекс вартості життя", value: String(country.cost_of_living_index) }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const faqs = [
    {
      question: `Яка валюта в країні ${country.name}?`,
      answer: country.currency ?? "—",
    },
    {
      question: `Яка мова в країні ${country.name}?`,
      answer: country.language ?? "—",
    },
  ];

  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <Breadcrumbs
        items={[
          { name: "Головна", url: "/" },
          { name: "Країни", url: "/countries" },
          { name: country.name, url: `/countries/${slug}` },
        ]}
      />

      {/* Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
        <div className="container py-12">
          <div className="flex items-center gap-3">
            <span className="text-5xl">{country.emoji}</span>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{country.name}</h1>
              <p className="text-slate-500">Столиця: {country.capital} · {country.currency} · {country.language}</p>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">{country.short_description}</p>
        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <div className="container py-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <Card key={s.label}>
                <p className="text-sm text-slate-500">{s.label}</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{s.value}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Guide sections */}
      <div className="container grid gap-6 py-8 md:grid-cols-2">
        {SECTIONS.map((s) => {
          const text = country[s.key];
          if (!text) return null;
          return (
            <Card key={s.key}>
              <h2 className="font-semibold text-slate-900">{s.label}</h2>
              <p className="mt-2 text-sm text-slate-600">{text}</p>
            </Card>
          );
        })}
      </div>

      {/* Services for country */}
      {services.length > 0 && (
        <Section title="Рекомендовані сервіси" className="bg-slate-50">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        </Section>
      )}

      {/* Articles for country */}
      {articles.length > 0 && (
        <Section title={`Статті про країну ${country.name}`}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
          </div>
        </Section>
      )}
    </>
  );
}
