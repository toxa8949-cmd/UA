import Link from "next/link";
import Image from "next/image";
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
                className="group flex flex-col overflow-hidden rounded-2xl border border-sand-300 bg-white transition-colors hover:border-emerald/40"
              >
                {/* Обкладинка */}
                <div className="relative aspect-[16/9] overflow-hidden bg-sand-200">
                  {place.cover_image ? (
                    <Image
                      src={place.cover_image}
                      alt={place.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-sand-200">
                      {Icon && <Icon size={36} className="text-emerald/30" strokeWidth={1.5} />}
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald">
                      {Icon && <Icon size={16} />}
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

                  <div className="mt-3 flex flex-wrap gap-2">
                    {place.languages?.includes("uk") && (
                      <span className="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald">
                        Українською
                      </span>
                    )}
                    {place.address && (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={11} /> {place.address}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
