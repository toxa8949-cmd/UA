import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Newsletter } from "@/components/home/Newsletter";
import { HeroDestinations } from "@/components/home/HeroDestinations";
import { PlaceGrid } from "@/components/place/PlaceGrid";
import { getCountries } from "@/server/queries/countries";
import { getArticles } from "@/server/queries/articles";
import { getServices } from "@/server/queries/services";
import { getNews } from "@/server/queries/news";
import { getPlacesPage } from "@/server/queries/places";
import { formatDate } from "@/lib/format";
import { CALCULATORS } from "@/lib/constants";
import { Calculator, ArrowRight, ArrowUpRight, Star } from "lucide-react";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Життя за кордоном для українців: гайди, податки, калькулятори",
  description:
    "Довідник для українців у Європі 2026: переїзд, документи, податки, житло й робота в Польщі, Німеччині, Чехії, Іспанії та Португалії. Калькулятори зарплати netto/brutto і каталог українських послуг поруч.",
  path: "/",
});

export const revalidate = 3600;

// 6 ключових калькуляторів для головної (решта — на /calculators)
const FEATURED_CALC_SLUGS = [
  "cost-of-living",
  "salary-netto-brutto",
  "tax-jdg-poland",
  "salary-netto-germany",
  "relocation-budget",
  "tax-autonomo-spain",
];

export default async function HomePage() {
  const [countries, articles, services, news, placesResult] = await Promise.all([
    getCountries(),
    getArticles({ limit: 3 }),
    getServices({ featured: true, limit: 4 }),
    getNews({ limit: 4 }),
    getPlacesPage({ perPage: 3 }),
  ]);
  const featuredPlaces = placesResult.items;

  const featuredCalcs = FEATURED_CALC_SLUGS
    .map((slug) => CALCULATORS.find((c) => c.slug === slug))
    .filter((c): c is (typeof CALCULATORS)[number] => Boolean(c));

  return (
    <>
      {/* ─── Hero: заголовок + панель напрямків (вона ж — навігація по країнах) ─── */}
      <section className="relative overflow-hidden border-b border-sand-300 bg-sand-100">
        <div aria-hidden className="hero-glow pointer-events-none absolute inset-0" />
        <div className="container relative py-10 md:py-12">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-1 font-mono text-xs uppercase tracking-widest text-emerald">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              Гайд для українців у Європі
            </div>
            <h1 className="font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-ink md:text-5xl">
              Усе про життя за кордоном — в одному місці
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
              Безкоштовний довідник для українців у Європі: документи, податки, житло, банки,
              робота й калькулятори витрат. Зрозуміло, актуально, без води.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/countries" size="lg">Обрати країну</ButtonLink>
              <ButtonLink href="/calculators" size="lg" variant="outline">
                Порахувати витрати
              </ButtonLink>
            </div>
          </div>

          {/* Сигнатура: панель напрямків = компактна секція країн */}
          <HeroDestinations countries={countries} />
        </div>
      </section>

      {/* ─── Калькулятори: компактні рядки-картки ─── */}
      <Section eyebrow="Інструменти" title="Порахуйте наперед"
        subtitle="Вартість життя, податки й зарплата на руки — за актуальними ставками 2026."
        action={<Link href="/calculators" className="flex items-center gap-1 text-sm font-medium text-emerald hover:text-emerald-700">Усі калькулятори <ArrowRight size={15} /></Link>}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCalcs.map((calc) => (
            <Link key={calc.slug} href={`/calculators/${calc.slug}`}
              className="card-lift group flex items-center gap-3.5 rounded-xl border border-sand-300 bg-white p-4 hover:border-emerald/40">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald">
                <Calculator size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[15px] font-semibold text-ink group-hover:text-emerald">
                  {calc.title}
                </span>
                <span className="block truncate text-xs text-slate-500">{calc.description}</span>
              </span>
              <ArrowUpRight size={15} className="shrink-0 text-slate-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald" />
            </Link>
          ))}
        </div>
      </Section>

      {/* ─── Українцям поруч: 1 ряд + CTA ─── */}
      {featuredPlaces.length >= 3 && (
        <Section eyebrow="Українцям поруч" title="Свої люди у вашому місті"
          subtitle="Лікарі, юристи, садочки, магазини й кафе, що обслуговують українською."
          className="bg-sand-200/50"
          action={<Link href="/places" className="flex items-center gap-1 text-sm font-medium text-emerald hover:text-emerald-700">Увесь каталог <ArrowRight size={15} /></Link>}>
          <PlaceGrid places={featuredPlaces} />
          <p className="mt-6 text-center text-sm text-slate-500">
            Маєте бізнес за кордоном?{" "}
            <Link href="/places/add" className="font-medium text-emerald hover:underline">
              Додайте його безкоштовно →
            </Link>
          </p>
        </Section>
      )}

      {/* ─── Статті: 1 ряд ─── */}
      {articles.length > 0 && (
        <Section eyebrow="Гайди" title="Що варто прочитати"
          action={<Link href="/articles" className="flex items-center gap-1 text-sm font-medium text-emerald hover:text-emerald-700">Усі статті <ArrowRight size={15} /></Link>}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
          </div>
        </Section>
      )}

      {/* ─── Новини + Сервіси: одна смуга, дві колонки ─── */}
      {(news.length > 0 || services.length > 0) && (
        <Section className="bg-sand-200/50">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Новини — компактний список */}
            {news.length > 0 && (
              <div>
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <div className="mb-2 font-mono text-xs uppercase tracking-widest text-emerald">Свіже</div>
                    <h2 className="font-display text-2xl font-bold text-ink">Останні новини</h2>
                  </div>
                  <Link href="/news" className="flex shrink-0 items-center gap-1 text-sm font-medium text-emerald hover:text-emerald-700">
                    Усі <ArrowRight size={15} />
                  </Link>
                </div>
                <div className="divide-y divide-sand-300 rounded-2xl border border-sand-300 bg-white">
                  {news.map((n) => (
                    <Link key={n.id} href={`/news/${n.slug}`} className="group block px-5 py-4 transition-colors hover:bg-sand-100/60">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <time>{formatDate(n.published_at)}</time>
                        {n.country && <span>· {n.country.emoji} {n.country.name}</span>}
                      </div>
                      <p className="mt-1 font-display font-semibold leading-snug text-ink group-hover:text-emerald">
                        {n.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Сервіси — компактний список */}
            {services.length > 0 && (
              <div>
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <div className="mb-2 font-mono text-xs uppercase tracking-widest text-emerald">Сервіси</div>
                    <h2 className="font-display text-2xl font-bold text-ink">Перевірені інструменти</h2>
                  </div>
                  <Link href="/services" className="flex shrink-0 items-center gap-1 text-sm font-medium text-emerald hover:text-emerald-700">
                    Каталог <ArrowRight size={15} />
                  </Link>
                </div>
                <div className="divide-y divide-sand-300 rounded-2xl border border-sand-300 bg-white">
                  {services.map((s) => (
                    <div key={s.id} className="flex items-center gap-4 px-5 py-4">
                      <div className="min-w-0 flex-1">
                        <Link href={`/services/${s.slug}`} className="font-display font-semibold text-ink hover:text-emerald">
                          {s.name}
                        </Link>
                        {s.description && (
                          <p className="mt-0.5 truncate text-sm text-slate-500">{s.description}</p>
                        )}
                      </div>
                      {s.rating != null && (
                        <span className="flex shrink-0 items-center gap-1 text-sm text-slate-600">
                          <Star size={13} className="fill-gold-400 text-gold-400" /> {s.rating}
                        </span>
                      )}
                      <a href={`/go/${s.slug}`} rel="nofollow sponsored"
                        className="shrink-0 rounded-lg bg-emerald px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700">
                        Перейти
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* ─── Newsletter ─── */}
      <Section><Newsletter /></Section>
    </>
  );
}
