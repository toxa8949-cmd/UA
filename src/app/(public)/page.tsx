import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { CountryCard } from "@/components/country/CountryCard";
import { ArticleCard } from "@/components/article/ArticleCard";
import { ServiceCard } from "@/components/service/ServiceCard";
import { Newsletter } from "@/components/home/Newsletter";
import { getCountries } from "@/server/queries/countries";
import { getArticles } from "@/server/queries/articles";
import { getServices } from "@/server/queries/services";
import { getNews } from "@/server/queries/news";
import { formatDate } from "@/lib/format";
import { CALCULATORS, COUNTRY_CODES } from "@/lib/constants";
import { Calculator, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 3600;

export default async function HomePage() {
  const [countries, articles, services, news] = await Promise.all([
    getCountries(),
    getArticles({ limit: 6 }),
    getServices({ featured: true, limit: 4 }),
    getNews({ limit: 4 }),
  ]);

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden border-b border-sand-300 bg-sand-100">
        <div className="container relative py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-1 font-mono text-xs uppercase tracking-widest text-emerald">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              Гайд для українців у Європі
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink md:text-6xl">
              Переїзд за кордон<br />без зайвого хаосу
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Документи, податки, житло й банки — зрозуміло і по ділу. Порівнюйте країни,
              рахуйте витрати, обирайте перевірені сервіси.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/countries" size="lg">Обрати країну</ButtonLink>
              <ButtonLink href="/calculators" size="lg" variant="outline">
                Порахувати витрати
              </ButtonLink>
            </div>
          </div>

          {/* Підпис: смуга кодів країн */}
          <div className="mx-auto mt-14 flex max-w-3xl flex-wrap justify-center gap-x-8 gap-y-4 border-t border-sand-300 pt-8">
            {countries.map((c) => (
              <Link key={c.id} href={`/countries/${c.slug}`} className="group flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold text-ink transition-colors group-hover:text-emerald">
                  {COUNTRY_CODES[c.slug] ?? c.slug.slice(0, 2).toUpperCase()}
                </span>
                <span className="text-sm text-slate-500 group-hover:text-slate-700">{c.name}</span>
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

      {/* ─── Новини ─── */}
      {news.length > 0 && (
        <Section eyebrow="Свіже" title="Останні новини"
          subtitle="Зміни правил, виплат і документів для українців за кордоном."
          action={<Link href="/news" className="flex items-center gap-1 text-sm font-medium text-emerald hover:text-emerald-700">Усі новини <ArrowRight size={15} /></Link>}>
          <div className="grid gap-4 sm:grid-cols-2">
            {news.map((n) => (
              <Link key={n.id} href={`/news/${n.slug}`}
                className="group rounded-2xl border border-sand-300 bg-white p-5 transition-colors hover:border-emerald/40">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <time>{formatDate(n.published_at)}</time>
                  {n.country && <span className="text-slate-600">· {n.country.emoji} {n.country.name}</span>}
                </div>
                <p className="mt-2 font-display font-semibold leading-snug text-ink">{n.title}</p>
                {n.summary && <p className="mt-1 line-clamp-2 text-sm text-slate-600">{n.summary}</p>}
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* ─── Newsletter ─── */}
      <Section><Newsletter /></Section>
    </>
  );
}
