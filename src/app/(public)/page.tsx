import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { CountryCard } from "@/components/country/CountryCard";
import { ArticleCard } from "@/components/article/ArticleCard";
import { ServiceCard } from "@/components/service/ServiceCard";
import { Newsletter } from "@/components/home/Newsletter";
import { getCountries } from "@/server/queries/countries";
import { getArticles } from "@/server/queries/articles";
import { getServices } from "@/server/queries/services";
import { CALCULATORS, COUNTRY_CODES } from "@/lib/constants";
import { Calculator, ArrowRight, ArrowUpRight } from "lucide-react";
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
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden border-b border-sand-300 bg-ink">
        <div className="container relative py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 font-mono text-xs uppercase tracking-widest text-emerald-50/90">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              Гайд для українців у Європі
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white md:text-6xl">
              Переїзд за кордон<br />без зайвого хаосу
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-sand-100/80">
              Документи, податки, житло й банки — зрозуміло і по ділу. Порівнюйте країни,
              рахуйте витрати, обирайте перевірені сервіси.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/countries" size="lg">Обрати країну</ButtonLink>
              <ButtonLink href="/calculators" size="lg" variant="outline" className="border-white/25 text-white hover:bg-white/10">
                Порахувати витрати
              </ButtonLink>
            </div>
          </div>

          {/* Підпис: смуга кодів країн */}
          <div className="mt-16 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-8">
            {countries.map((c) => (
              <Link key={c.id} href={`/countries/${c.slug}`} className="group flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold text-white transition-colors group-hover:text-gold-400">
                  {COUNTRY_CODES[c.slug] ?? c.slug.slice(0, 2).toUpperCase()}
                </span>
                <span className="text-sm text-sand-100/60 group-hover:text-sand-100">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Країни ─── */}
      <Section eyebrow="Напрямки" title="Куди переїхати"
        action={<Link href="/countries" className="flex items-center gap-1 text-sm font-medium text-emerald hover:text-emerald-700">Усі країни <ArrowRight size={15} /></Link>}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((c) => <CountryCard key={c.id} country={c} />)}
        </div>
      </Section>

      {/* ─── Калькулятори ─── */}
      <Section eyebrow="Інструменти" title="Порахуйте наперед"
        subtitle="Скільки коштує життя, переїзд і яка буде зарплата на руки." className="bg-sand-200/50">
        <div className="grid gap-4 md:grid-cols-3">
          {CALCULATORS.map((calc) => (
            <Link key={calc.slug} href={`/calculators/${calc.slug}`}
              className="group rounded-2xl border border-sand-300 bg-white p-6 transition-colors hover:border-emerald/40">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald">
                <Calculator size={20} />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-ink">{calc.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{calc.description}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald">
                Відкрити <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ─── Статті ─── */}
      {articles.length > 0 && (
        <Section eyebrow="Гайди" title="Що варто прочитати"
          action={<Link href="/articles" className="flex items-center gap-1 text-sm font-medium text-emerald hover:text-emerald-700">Усі статті <ArrowRight size={15} /></Link>}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
          </div>
        </Section>
      )}

      {/* ─── Сервіси ─── */}
      {services.length > 0 && (
        <Section eyebrow="Сервіси" title="Перевірені інструменти"
          subtitle="Банки, eSIM, перекази та страхування для життя за кордоном." className="bg-sand-200/50"
          action={<Link href="/services" className="flex items-center gap-1 text-sm font-medium text-emerald hover:text-emerald-700">Каталог <ArrowRight size={15} /></Link>}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        </Section>
      )}

      {/* ─── Newsletter ─── */}
      <Section><Newsletter /></Section>
    </>
  );
}
