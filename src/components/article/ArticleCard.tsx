import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";
import type { Article } from "@/types/db";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group flex h-full flex-col rounded-2xl border border-sand-300 bg-white p-5 transition-colors hover:border-emerald/40">
      <h3 className="font-display text-lg font-semibold leading-snug text-ink">{article.title}</h3>
      {article.excerpt && <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{article.excerpt}</p>}
      <div className="mt-4 flex items-center justify-between">
        {article.reading_time != null && (
          <span className="flex items-center gap-1.5 text-xs text-slate-500"><Clock size={13} /> {article.reading_time} хв</span>
        )}
        <ArrowUpRight size={16} className="text-emerald transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}
