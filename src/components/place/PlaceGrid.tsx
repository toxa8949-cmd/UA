import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Check } from "lucide-react";
import { getPlaceCategory, placeCategoryLabel } from "@/lib/places";
import type { PlaceWithRelations } from "@/types/db";

/**
 * Статична сітка карток місць (server component) —
 * для SEO-лендінгів /places/c/[category]/[location].
 */
export function PlaceGrid({ places }: { places: PlaceWithRelations[] }) {
  if (!places.length) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {places.map((place) => {
        const cat = getPlaceCategory(place.category);
        const Icon = cat?.icon;
        return (
          <Link
            key={place.id}
            href={`/places/${place.slug}`}
            className="card-lift group flex flex-col overflow-hidden rounded-2xl border border-sand-300 bg-white hover:border-emerald/40"
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
                  {Icon && (
                    <Icon size={36} className="text-emerald/30" strokeWidth={1.5} />
                  )}
                </div>
              )}
              {place.is_featured && (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-amber-600 backdrop-blur">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  Рекомендовано
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald">
                  {Icon && <Icon size={16} />}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display font-semibold leading-snug text-ink group-hover:text-emerald">
                    {place.name}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                    {placeCategoryLabel(place.category)}
                    {(place.city?.name || place.country?.name) && (
                      <>
                        <span>·</span>
                        <MapPin size={11} className="shrink-0" />
                        {place.city?.name ?? place.country?.name}
                      </>
                    )}
                  </p>
                </div>
              </div>

              {place.description && (
                <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                  {place.description}
                </p>
              )}

              {place.languages?.includes("uk") && (
                <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald">
                  <Check size={11} /> Українською
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
