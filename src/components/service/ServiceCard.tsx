import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Star } from "lucide-react";
import type { Service } from "@/types/db";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/services/${service.slug}`} className="font-semibold text-slate-900 hover:text-brand-600">
          {service.name}
        </Link>
        {service.rating != null && (
          <span className="flex items-center gap-1 text-sm text-slate-600">
            <Star size={14} className="fill-accent-500 text-accent-500" /> {service.rating}
          </span>
        )}
      </div>
      {service.description && (
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-600">{service.description}</p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {service.is_featured && <Badge color="accent">Рекомендовано</Badge>}
        {service.pricing_summary && (
          <span className="text-xs text-slate-500">{service.pricing_summary}</span>
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <Link
          href={`/services/${service.slug}`}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Деталі
        </Link>
        <a
          href={`/go/${service.slug}`}
          rel="nofollow sponsored"
          className="flex-1 rounded-lg bg-brand-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-brand-700"
        >
          Перейти
        </a>
      </div>
    </Card>
  );
}
