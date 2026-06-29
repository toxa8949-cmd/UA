import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ArticleCard } from "@/components/article/ArticleCard";
import { TableOfContents } from "@/components/article/TableOfContents";
import { CountryCalculators } from "@/components/countries/CountryCalculators";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getArticleBySlug,
  getArticleSlugs,
  getRelatedArticles,
} from "@/server/queries/articles";
import { buildMetadata, articleJsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { renderMarkdown } from "@/lib/markdown";
import { Clock } from "lucide-react";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return buildMetadata({
    title: article.seo_title ?? article.title,
    description: article.seo_description ?? article.excerpt ?? undefined,
    path: `/articles/${slug}`,
    ogEyebrow: "Стаття",
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(article.country_id, slug, 3);
  const { html, toc } = renderMarkdown(article.content);

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: article.title,
          description: article.excerpt,
          slug: article.slug,
          image: article.cover_image,
          publishedAt: article.published_at ? new Date(article.published_at) : null,
          updatedAt: new Date(article.updated_at),
        })}
      />
      <Breadcrumbs
        items={[
          { name: "Головна", url: "/" },
          { name: "Статті", url: "/articles" },
          { name: article.title, url: `/articles/${slug}` },
        ]}
      />

      <div className="container pb-20">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_220px]">
          {/* ─── Стаття ─── */}
          <article className="min-w-0 max-w-2xl">
            {article.country && (
              <Link
                href={`/countries/${article.country.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald hover:text-emerald-700"
              >
                {article.country.emoji} {article.country.name}
              </Link>
            )}
            <h1 className="mt-3 font-display text-3xl font-bold leading-[1.15] text-ink md:text-[2.5rem]">
              {article.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              {article.reading_time != null && (
                <span className="flex items-center gap-1.5">
                  <Clock size={14} /> {article.reading_time} хв читання
                </span>
              )}
              {article.published_at && <span>Оновлено: {formatDate(article.published_at)}</span>}
            </div>

            {article.excerpt && (
              <p className="mt-6 border-l-2 border-emerald pl-4 text-lg leading-relaxed text-slate-600">
                {article.excerpt}
              </p>
            )}

            <div
              className="prose-content mt-8 scroll-mt-24"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {article.country && (
              <CountryCalculators countrySlug={article.country.slug} />
            )}

            <div className="mt-12 rounded-2xl border border-sand-300 bg-sand-200/40 p-5 text-sm leading-relaxed text-slate-500">
              Інформація має ознайомчий характер і не є юридичною, податковою чи фінансовою
              консультацією. Матеріал може містити партнерські посилання.
            </div>
          </article>

          {/* ─── Зміст (sticky, тільки десктоп) ─── */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <TableOfContents items={toc} />
              {article.country && (
                <CountryCalculators countrySlug={article.country.slug} variant="sidebar" />
              )}
            </div>
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-sand-300 bg-sand-200/30 py-14">
          <div className="container max-w-5xl">
            <h2 className="mb-6 font-display text-2xl font-bold text-ink">Схожі статті</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
