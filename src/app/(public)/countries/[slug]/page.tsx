import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { ArticleCard } from "@/components/article/ArticleCard";
import { ServiceCard } from "@/components/service/ServiceCard";
import { FaqAccordion } from "@/components/country/FaqAccordion";
import { CountryGuideTabs, type GuideSection } from "@/components/country/CountryGuideTabs";
import { CountryNav } from "@/components/country/CountryNav";
import { RelatedCountries } from "@/components/country/RelatedCountries";
import { CostOfLivingBlock } from "@/components/country/CostOfLivingBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/Card";
import {
  getCountryBySlug,
  getCountrySlugs,
  getCountries,
} from "@/server/queries/countries";
import { getArticles } from "@/server/queries/articles";
import { getServicesForCountry } from "@/server/queries/services";
import { buildMetadata, faqJsonLd } from "@/lib/seo";
import { RELATED_COUNTRIES } from "@/lib/constants";
import { estimateCost } from "@/lib/costModel";
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
  const code = slug === "czech-republic" ? "CZ" : slug.slice(0, 2).toUpperCase();
  return buildMetadata({
    title: country.seo_title ?? `Життя в країні ${country.name}`,
    description: country.seo_description ?? country.short_description ?? undefined,
    path: `/countries/${slug}`,
    ogEyebrow: "Країна",
    ogCode: code,
  });
}

const SECTIONS = [
  { key: "business_summary", guideKey: "business", label: "Документи та бізнес" },
  { key: "tax_summary", guideKey: "tax", label: "Податки" },
  { key: "healthcare_summary", guideKey: "healthcare", label: "Медицина" },
  { key: "education_summary", guideKey: "education", label: "Освіта" },
  { key: "transport_summary", guideKey: "transport", label: "Транспорт" },
] as const;

export default async function CountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);
  if (!country) notFound();

  const [articles, services, allCountries] = await Promise.all([
    getArticles({ countryId: country.id, limit: 6 }),
    getServicesForCountry(country.id, 6),
    getCountries(),
  ]);

  // Схожі країни (перелінковка)
  const relatedSlugs = RELATED_COUNTRIES[country.slug] ?? [];
  const relatedCountries = relatedSlugs
    .map((sl) => allCountries.find((c) => c.slug === sl))
    .filter(Boolean) as typeof allCountries;

  // Орієнтовна вартість життя (одинак / сім'я) для блоку-карток
  const single = estimateCost(country, { adults: 1, children: 0, lifestyle: "standard", city: "capital" });
  const family = estimateCost(country, { adults: 2, children: 2, lifestyle: "standard", city: "capital" });

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

  // FAQ з бази (масив {q,a}); якщо порожній — мінімальний фолбек
  const guides = country.guides ?? {};
  const guideSections: GuideSection[] = SECTIONS
    .map((sec) => {
      const items = Array.isArray(guides[sec.guideKey]) ? guides[sec.guideKey] : [];
      const summary = (country[sec.key] ?? "").trim();
      return { key: sec.key, label: sec.label, summary, items };
    })
    .filter((sec) => sec.items.length > 0 || sec.summary.length > 0);

  const available = [
    "overview",
    guideSections.length > 0 ? "guide" : null,
    services.length > 0 ? "services" : null,
    articles.length > 0 ? "articles" : null,
    country.faq && country.faq.length > 0 ? "faq" : null,
  ].filter(Boolean) as string[];

  const faqs =
    country.faq && country.faq.length > 0
      ? country.faq
      : [
          { q: `Яка валюта в країні ${country.name}?`, a: country.currency ?? "—" },
          { q: `Яка мова в країні ${country.name}?`, a: country.language ?? "—" },
        ];

  return (
    <>
      <JsonLd data={faqJsonLd(faqs.map((f) => ({ question: f.q, answer: f.a })))} />
      <Breadcrumbs
        items={[
          { name: "Головна", url: "/" },
          { name: "Країни", url: "/countries" },
          { name: country.name, url: `/countries/${slug}` },
        ]}
      />

      <CountryNav available={available} />

      {/* Hero */}
      <section className="border-b border-sand-300 bg-sand-200/40">
        <div className="container py-12">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink font-mono text-2xl font-bold text-white">
              {(country.slug === "czech-republic" ? "CZ" : country.slug.slice(0,2).toUpperCase())}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">{country.name}</h1>
                <span className="text-3xl">{country.emoji}</span>
              </div>
              <p className="mt-1 text-slate-500">Столиця: {country.capital} · {country.currency} · {country.language}</p>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">{country.short_description}</p>
        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <div id="overview" className="container scroll-mt-32 py-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <Card key={s.label}>
                <p className="text-sm text-slate-500">{s.label}</p>
                <p className="mt-1 text-xl font-bold text-ink">{s.value}</p>
              </Card>
            ))}
          </div>

          {/* Орієнтовна вартість життя */}
          {country.currency && (
            <div className="mt-8">
              <h2 className="mb-4 font-display text-xl font-bold text-ink">Скільки коштує життя</h2>
              <CostOfLivingBlock
                single={single}
                family={family}
                currency={country.currency}
                averageSalary={country.average_salary}
              />
            </div>
          )}
        </div>
      )}

      {/* Guide sections — таби */}
      {guideSections.length > 0 && (
        <div id="guide" className="container scroll-mt-32 py-10">
          <div className="mb-6">
            <div className="mb-2 font-mono text-xs uppercase tracking-widest text-emerald">Гайди</div>
            <h2 className="font-display text-2xl font-bold text-ink">Все, що треба знати</h2>
          </div>
          <CountryGuideTabs sections={guideSections} />
        </div>
      )}

      {/* Services for country */}
      {services.length > 0 && (
        <div id="services" className="scroll-mt-32">
        <Section title="Рекомендовані сервіси" className="bg-sand-200/50">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        </Section>
        </div>
      )}

      {/* Articles for country */}
      {articles.length > 0 && (
        <div id="articles" className="scroll-mt-32">
        <Section title={`Статті про країну ${country.name}`}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
          </div>
        </Section>
        </div>
      )}

      {/* FAQ */}
      {country.faq && country.faq.length > 0 && (
        <div id="faq" className="scroll-mt-32">
        <Section eyebrow="Питання" title="Часті запитання" className="bg-sand-200/50">
          <div className="max-w-3xl">
            <FaqAccordion faqs={country.faq} />
          </div>
        </Section>
        </div>
      )}

      {/* Схожі країни */}
      {relatedCountries.length > 0 && (
        <Section eyebrow="Куди ще" title="Схожі країни">
          <RelatedCountries countries={relatedCountries} />
        </Section>
      )}
    </>
  );
}
