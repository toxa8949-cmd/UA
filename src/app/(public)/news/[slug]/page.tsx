import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getNewsBySlug, getNewsSlugs, getNews } from "@/server/queries/news";
import { renderMarkdown } from "@/lib/markdown";
import { buildMetadata, newsArticleJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReadingProgress } from "@/components/shared/ReadingProgress";
import { PlacesCta } from "@/components/shared/PlacesCta";
import { formatDate } from "@/lib/format";
import { ArrowUpRight, ExternalLink } from "lucide-react";

export const revalidate = 600;

export async function generateStaticParams() {
  const slugs = await getNewsSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) return {};
  return buildMetadata({
    title: item.seo_title ?? item.title,
    description: item.seo_description ?? item.summary ?? undefined,
    path: `/news/${slug}`,
    ogEyebrow: "Новина",
    ogType: "article",
    publishedTime: item.published_at,
  });
}

export default async function NewsItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) notFound();

  const { html } = renderMarkdown(item.content);
  const more = (await getNews({ limit: 4 })).filter((n) => n.slug !== slug).slice(0, 3);

  return (
    <>
      <ReadingProgress />
      <JsonLd
        data={newsArticleJsonLd({
          title: item.title,
          description: item.summary,
          slug,
          publishedAt: item.published_at,
          sourceName: item.source_name,
        })}
      />
      <Breadcrumbs
        items={[
          { name: "Головна", url: "/" },
          { name: "Новини", url: "/news" },
          { name: item.title, url: `/news/${slug}` },
        ]}
      />

      <article className="container max-w-2xl pb-12">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <time>{formatDate(item.published_at)}</time>
          {item.country && (
            <Link
              href={`/countries/${item.country.slug}`}
              className="inline-flex items-center gap-1 rounded-full bg-sand-100 px-2.5 py-0.5 font-medium text-slate-600 hover:text-ink"
            >
              {item.country.emoji} {item.country.name}
            </Link>
          )}
        </div>

        <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-ink">{item.title}</h1>

        <div className="prose-content mt-6" dangerouslySetInnerHTML={{ __html: html }} />

        <PlacesCta countryName={item.country?.name} />

        {item.source_url && (
          <a
            href={item.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-emerald hover:text-emerald-700"
          >
            <ExternalLink size={14} /> Джерело{item.source_name ? `: ${item.source_name}` : ""}
          </a>
        )}

        <div className="mt-8 rounded-2xl border border-sand-300 bg-sand-200/40 p-4 text-sm leading-relaxed text-slate-500">
          Інформація має ознайомчий характер. Правила можуть змінюватися — перевіряйте
          актуальні дані на офіційних державних ресурсах.
        </div>
      </article>

      {more.length > 0 && (
        <section className="border-t border-sand-300 bg-sand-200/30 py-12">
          <div className="container max-w-2xl">
            <h2 className="mb-4 font-display text-xl font-bold text-ink">Інші новини</h2>
            <div className="space-y-3">
              {more.map((n) => (
                <Link
                  key={n.id}
                  href={`/news/${n.slug}`}
                  className="group flex items-start justify-between gap-3 rounded-xl border border-sand-300 bg-white p-4 transition-colors hover:border-emerald/40"
                >
                  <div>
                    <p className="text-xs text-slate-500">{formatDate(n.published_at)}</p>
                    <p className="mt-1 font-display font-semibold text-ink">{n.title}</p>
                  </div>
                  <ArrowUpRight size={15} className="mt-1 shrink-0 text-emerald" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
