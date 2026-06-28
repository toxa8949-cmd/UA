import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ArticleCard } from "@/components/article/ArticleCard";
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
  const html = renderMarkdown(article.content);

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

      <article className="container max-w-3xl pb-16">
        {article.country && (
          <Link href={`/countries/${article.country.slug}`} className="text-sm font-medium text-brand-600 hover:text-brand-700">
            {article.country.emoji} {article.country.name}
          </Link>
        )}
        <h1 className="mt-2 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
          {article.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-400">
          {article.reading_time != null && (
            <span className="flex items-center gap-1"><Clock size={14} /> {article.reading_time} хв</span>
          )}
          {article.published_at && <span>Оновлено: {formatDate(article.published_at)}</span>}
        </div>

        <div className="prose-content mt-8" dangerouslySetInnerHTML={{ __html: html }} />

        <div className="mt-10 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          Інформація має ознайомчий характер і не є юридичною, податковою чи фінансовою консультацією.
          Матеріал може містити партнерські посилання.
        </div>
      </article>

      {related.length > 0 && (
        <div className="container max-w-5xl pb-16">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Схожі статті</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((a) => <ArticleCard key={a.id} article={a} />)}
          </div>
        </div>
      )}
    </>
  );
}
