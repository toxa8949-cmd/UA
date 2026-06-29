import Link from "next/link";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { getPlaceCategory, placeCategoryLabel } from "@/lib/places";
import type { PlaceWithRelations } from "@/types/db";

/**
 * Компактний блок «Українські послуги» для сторінок міста/країни.
 * Переюзабельний: рендериться лише якщо є місця.
 */
export function PlacesBlock({
  places,
  title,
  subtitle,
}: {
  places: PlaceWithRelations[];
  title: string;
  subtitle?: string;
}) {
  if (!places.length) return null;

  const allHref = "/places";

  return (
    <section className="py-14">
      <div className="container">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 font-mono text-xs uppercase tracking-widest text-emerald">
              Українцям поруч
            </div>
            <h2 className="font-display text-3xl font-bold text-ink">{title}</h2>
            {subtitle && <p className="mt-2 max-w-xl text-slate-600">{subtitle}</p>}
          </div>
          <Link
            href={allHref}
            className="flex shrink-0 items-center gap-1 text-sm font-medium text-emerald hover:text-emerald-700"
          >
            Усі заклади <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => {
            const cat = getPlaceCategory(place.category);
            const Icon = cat?.icon;
            return (
              <Link
                key={place.id}
                href={`/places/${place.slug}`}
                className="group flex flex-col rounded-2xl border border-sand-300 bg-white p-5 transition-colors hover:border-emerald/40"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald">
                    {Icon && <Icon size={18} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-semibold leading-snug text-ink group-hover:text-emerald">
                        {place.name}
                      </h3>
                      {place.is_featured && (
                        <Star size={14} className="mt-0.5 shrink-0 fill-gold-500 text-gold-500" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {placeCategoryLabel(place.category)}
                      {place.city && ` · ${place.city.name}`}
                    </p>
                  </div>
                </div>

                {place.description && (
                  <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {place.description}
                  </p>
                )}

                {place.address && (
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} /> {place.address}
                    </span>
                  </div>
                )}

                {place.languages?.includes("uk") && (
                  <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald">
                    Обслуговують українською
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
