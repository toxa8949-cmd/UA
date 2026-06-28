import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Star } from "lucide-react";
import type { Service } from "@/types/db";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-sand-300 bg-white p-5">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/services/${service.slug}`} className="font-display font-semibold text-ink hover:text-emerald">{service.name}</Link>
        {service.rating != null && (
          <span className="flex items-center gap-1 text-sm text-slate-600">
            <Star size={14} className="fill-gold-400 text-gold-400" /> {service.rating}
          </span>
        )}
      </div>
      {service.description && <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{service.description}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {service.is_featured && <Badge color="gold">Рекомендовано</Badge>}
        {service.pricing_summary && <span className="text-xs text-slate-500">{service.pricing_summary}</span>}
      </div>
      <div className="mt-4 flex gap-2">
        <Link href={`/services/${service.slug}`} className="flex-1 rounded-xl border border-ink/15 px-3 py-2 text-center text-sm font-medium text-ink hover:bg-sand-200">Деталі</Link>
        <a href={`/go/${service.slug}`} rel="nofollow sponsored" className="flex-1 rounded-xl bg-emerald px-3 py-2 text-center text-sm font-medium text-white hover:bg-emerald-700">Перейти</a>
      </div>
    </div>
  );
}
