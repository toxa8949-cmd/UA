import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { CountryCard } from "@/components/country/CountryCard";
import { ArticleCard } from "@/components/article/ArticleCard";
import { ServiceCard } from "@/components/service/ServiceCard";
import { Newsletter } from "@/components/home/Newsletter";
import { Card } from "@/components/ui/Card";
import { getCountries } from "@/server/queries/countries";
import { getArticles } from "@/server/queries/articles";
import { getServices } from "@/server/queries/services";
import { CALCULATORS } from "@/lib/constants";
import { Calculator, ArrowRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 3600;

export default async function HomePage() {
  const [countries, articles, services] = await Promise.all([
    getCountries(),
    getArticles({ limit: 6 }),
    getServices({ featured: true, limit: 4 }),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
              Українці за кордоном: країни, документи, податки, житло та корисні сервіси
            </h1>
            <p className="mt-5 text-lg text-slate-600">
              Порівнюйте країни, рахуйте витрати на життя, знаходьте банки, страхування,
              eSIM та сервіси для переїзду.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/countries" size="lg">Обрати країну</ButtonLink>
              <ButtonLink href="/calculators" size="lg" variant="outline">Порахувати витрати</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Countries */}
      <Section
        title="Країни"
        subtitle="Оберіть напрямок для переїзду чи життя"
        action={<Link href="/countries" className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">Усі країни <ArrowRight size={15} /></Link>}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((c) => <CountryCard key={c.id} country={c} />)}
        </div>
      </Section>

      {/* Calculators */}
      <Section title="Калькулятори" subtitle="Порахуйте витрати та бюджет переїзду" className="bg-slate-50">
        <div className="grid gap-4 md:grid-cols-3">
          {CALCULATORS.map((calc) => (
            <Link key={calc.slug} href={`/calculators/${calc.slug}`}>
              <Card className="h-full">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Calculator size={20} />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{calc.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{calc.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* Articles */}
      {articles.length > 0 && (
        <Section
          title="Популярні статті"
          action={<Link href="/articles" className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">Усі статті <ArrowRight size={15} /></Link>}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
          </div>
        </Section>
      )}

      {/* Services */}
      {services.length > 0 && (
        <Section
          title="Корисні сервіси"
          subtitle="Банки, eSIM, перекази, страхування"
          className="bg-slate-50"
          action={<Link href="/services" className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">Каталог <ArrowRight size={15} /></Link>}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        </Section>
      )}

      {/* Newsletter */}
      <Section>
        <Newsletter />
      </Section>
    </>
  );
}
