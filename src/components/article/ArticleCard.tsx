import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Clock } from "lucide-react";
import type { Article } from "@/types/db";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.slug}`}>
      <Card className="flex h-full flex-col">
        <h3 className="font-semibold text-slate-900">{article.title}</h3>
        {article.excerpt && (
          <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-600">{article.excerpt}</p>
        )}
        {article.reading_time != null && (
          <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
            <Clock size={13} /> {article.reading_time} хв читання
          </div>
        )}
      </Card>
    </Link>
  );
}
