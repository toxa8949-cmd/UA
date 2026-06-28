import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getNews } from "@/server/queries/news";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { ArrowUpRight } from "lucide-react";

export const revalidate = 600; // новини оновлюються частіше

export const metadata: Metadata = buildMetadata({
  title: "Новини для українців за кордоном",
  description: "Свіжі новини про легалізацію, виплати, документи та зміни правил для українців у Польщі, Німеччині, Чехії, Іспанії та Португалії.",
  path: "/news",
});

export default async function NewsPage() {
  const news = await getNews({ limit: 50 });

  return (
    <>
      <Breadcrumbs items={[{ name: "Головна", url: "/" }, { name: "Новини", url: "/news" }]} />
      <div className="container pb-16">
        <h1 className="font-display text-3xl font-bold text-ink">Новини</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Свіжі зміни правил, виплат і документів для українців за кордоном.
        </p>

        {news.length === 0 ? (
          <p className="mt-8 text-slate-500">Новини зʼявляться найближчим часом.</p>
        ) : (
          <div className="mt-8 space-y-4">
            {news.map((n) => (
              <Link
                key={n.id}
                href={`/news/${n.slug}`}
                className="group block rounded-2xl border border-sand-300 bg-white p-5 transition-colors hover:border-emerald/40"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <time>{formatDate(n.published_at)}</time>
                  {n.country && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sand-100 px-2 py-0.5 font-medium text-slate-600">
                      {n.country.emoji} {n.country.name}
                    </span>
                  )}
                </div>
                <h2 className="mt-2 flex items-start justify-between gap-3 font-display text-lg font-semibold text-ink">
                  {n.title}
                  <ArrowUpRight size={16} className="mt-1 shrink-0 text-emerald transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </h2>
                {n.summary && <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{n.summary}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
