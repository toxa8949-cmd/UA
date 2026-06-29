"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  X,
  MapPin,
  Star,
  SlidersHorizontal,
  ChevronDown,
  Check,
  Loader2,
} from "lucide-react";
import {
  PLACE_GROUPS,
  getPlaceCategory,
  placeCategoryLabel,
} from "@/lib/places";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlaceWithRelations } from "@/types/db";
import type {
  CountryFacet,
  CategoryFacet,
  CityFacet,
  PlacesSort,
} from "@/server/queries/places";

const SORT_OPTIONS: { value: PlacesSort; label: string }[] = [
  { value: "featured", label: "Рекомендовані" },
  { value: "newest", label: "Спочатку нові" },
  { value: "name", label: "За назвою (А-Я)" },
];

export type PlacesExplorerProps = {
  items: PlaceWithRelations[];
  total: number;
  page: number;
  totalPages: number;
  facets: {
    countries: CountryFacet[];
    categories: CategoryFacet[];
    cities: CityFacet[];
    total: number;
  };
  active: {
    country?: string;
    category?: string;
    city?: string;
    uk?: boolean;
    owned?: boolean;
    q?: string;
    sort: PlacesSort;
  };
};

export function PlacesExplorer({
  items,
  total,
  page,
  totalPages,
  facets,
  active,
}: PlacesExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(active.q ?? "");

  // Оптимістичне дзеркало активних фільтрів — підсвітка реагує миттєво,
  // не чекаючи серверного round-trip. Синхронізується з props при відповіді.
  const [optimistic, setOptimistic] = useState(active);
  const lastServer = useRef(active);
  if (lastServer.current !== active) {
    lastServer.current = active;
    if (
      optimistic.country !== active.country ||
      optimistic.category !== active.category ||
      optimistic.city !== active.city ||
      optimistic.uk !== active.uk ||
      optimistic.owned !== active.owned ||
      optimistic.sort !== active.sort ||
      optimistic.q !== active.q
    ) {
      setOptimistic(active);
    }
  }
  const view = optimistic;

  // Оновити один або кілька параметрів URL (скидаючи сторінку, окрім явного page)
  const update = useCallback(
    (patch: Record<string, string | null>) => {
      // миттєво відобразити в підсвітці
      setOptimistic((prev) => {
        const next = { ...prev } as Record<string, unknown>;
        for (const [k, v] of Object.entries(patch)) {
          if (k === "uk" || k === "owned") next[k] = v === "1";
          else next[k] = v ?? undefined;
        }
        return next as typeof prev;
      });

      const sp = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === "") sp.delete(key);
        else sp.set(key, value);
      }
      if (!("page" in patch)) sp.delete("page");
      const qs = sp.toString();
      startTransition(() => {
        router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [params, pathname, router]
  );

  const hasFilters =
    !!view.country ||
    !!view.category ||
    !!view.city ||
    view.uk ||
    view.owned ||
    !!view.q;

  const resetAll = () => {
    setSearchValue("");
    setOptimistic({ sort: view.sort });
    startTransition(() => router.push(pathname, { scroll: false }));
  };

  const submitSearch = () => update({ q: searchValue.trim() || null });

  // Категорії, згруповані по PLACE_GROUPS, лишаючи лише ті, що мають записи
  const categoryByGroup = PLACE_GROUPS.map((group) => {
    const cats = facets.categories
      .map((f) => {
        const meta = getPlaceCategory(f.category);
        return meta && meta.group === group.slug
          ? { ...f, label: meta.label, icon: meta.icon }
          : null;
      })
      .filter(Boolean) as (CategoryFacet & { label: string; icon: LucideIcon })[];
    return { ...group, cats };
  }).filter((g) => g.cats.length > 0);

  const Sidebar = (
    <div className="space-y-7">
      {/* Країни */}
      <div>
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-400">
          Країна
        </p>
        <ul className="space-y-0.5">
          <FacetRow
            label="Усі країни"
            count={facets.total}
            active={!view.country}
            onClick={() => update({ country: null, city: null })}
          />
          {facets.countries.map((c) => (
            <FacetRow
              key={c.slug}
              label={`${c.emoji ? c.emoji + " " : ""}${c.name}`}
              count={c.count}
              active={view.country === c.slug}
              onClick={() =>
                update({ country: view.country === c.slug ? null : c.slug, city: null })
              }
            />
          ))}
        </ul>
      </div>

      {/* Міста (лише коли обрано країну) */}
      {view.country && facets.cities.length > 0 && (
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-400">
            Місто
          </p>
          <ul className="space-y-0.5">
            <FacetRow
              label="Усі міста"
              active={!view.city}
              onClick={() => update({ city: null })}
            />
            {facets.cities.map((c) => (
              <FacetRow
                key={c.slug}
                label={c.name}
                count={c.count}
                active={view.city === c.slug}
                onClick={() =>
                  update({ city: view.city === c.slug ? null : c.slug })
                }
              />
            ))}
          </ul>
        </div>
      )}

      {/* Категорії */}
      {categoryByGroup.length > 0 && (
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-400">
            Категорія
          </p>
          <div className="space-y-3">
            <FacetRow
              label="Усі категорії"
              active={!view.category}
              onClick={() => update({ category: null })}
            />
            {categoryByGroup.map((group) => (
              <div key={group.slug}>
                <p className="mb-1 px-2 text-[11px] font-medium text-slate-400">
                  {group.label}
                </p>
                <ul className="space-y-0.5">
                  {group.cats.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <FacetRow
                        key={cat.category}
                        label={cat.label}
                        count={cat.count}
                        icon={Icon ? <Icon size={15} /> : undefined}
                        active={view.category === cat.category}
                        onClick={() =>
                          update({
                            category:
                              view.category === cat.category ? null : cat.category,
                          })
                        }
                      />
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Особливості */}
      <div>
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-400">
          Особливості
        </p>
        <div className="space-y-2">
          <CheckRow
            label="Обслуговують українською"
            checked={!!view.uk}
            onClick={() => update({ uk: view.uk ? null : "1" })}
          />
          <CheckRow
            label="Український власник"
            checked={!!view.owned}
            onClick={() => update({ owned: view.owned ? null : "1" })}
          />
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={resetAll}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald hover:text-emerald-700"
        >
          <X size={14} /> Скинути все
        </button>
      )}
    </div>
  );

  return (
    <div>
      {/* Топ-панель: пошук + сортування */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitSearch()}
            placeholder="Знайти: бухгалтер, стоматолог, садочок, кафе…"
            className="w-full rounded-xl border border-sand-300 bg-white py-2.5 pl-10 pr-10 text-sm text-ink outline-none transition-colors focus:border-emerald"
          />
          {searchValue && (
            <button
              onClick={() => {
                setSearchValue("");
                update({ q: null });
              }}
              aria-label="Очистити пошук"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ink"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile: кнопка фільтрів */}
          <button
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-sand-300 bg-white px-3.5 py-2.5 text-sm font-medium text-ink lg:hidden"
          >
            <SlidersHorizontal size={15} /> Фільтри
            {hasFilters && <span className="h-1.5 w-1.5 rounded-full bg-emerald" />}
          </button>

          <div className="relative">
            <select
              aria-label="Сортування"
              value={view.sort}
              onChange={(e) => update({ sort: e.target.value })}
              className="appearance-none rounded-xl border border-sand-300 bg-white py-2.5 pl-3.5 pr-9 text-sm font-medium text-ink outline-none focus:border-emerald"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Активні фільтри-чіпи */}
      {hasFilters && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {view.country && (
            <Chip
              label={facets.countries.find((c) => c.slug === view.country)?.name ?? view.country}
              onRemove={() => update({ country: null, city: null })}
            />
          )}
          {view.city && (
            <Chip
              label={facets.cities.find((c) => c.slug === view.city)?.name ?? view.city}
              onRemove={() => update({ city: null })}
            />
          )}
          {view.category && (
            <Chip label={placeCategoryLabel(view.category)} onRemove={() => update({ category: null })} />
          )}
          {view.uk && <Chip label="Українською" onRemove={() => update({ uk: null })} />}
          {view.owned && <Chip label="Укр. власник" onRemove={() => update({ owned: null })} />}
          {view.q && <Chip label={`«${view.q}»`} onRemove={() => { setSearchValue(""); update({ q: null }); }} />}
        </div>
      )}

      <div className="mt-6 flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-24">{Sidebar}</div>
        </aside>

        {/* Основна колонка */}
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {hasFilters ? "Знайдено" : "Усього"}:{" "}
              <span className="font-medium text-ink">{total}</span>
            </p>
            {pending && <Loader2 size={16} className="animate-spin text-slate-400" />}
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-sand-300 bg-white p-12 text-center">
              <p className="text-slate-500">За вашим запитом нічого не знайдено.</p>
              {hasFilters && (
                <button
                  onClick={resetAll}
                  className="mt-3 text-sm font-medium text-emerald hover:text-emerald-700"
                >
                  Скинути фільтри
                </button>
              )}
            </div>
          ) : (
            <>
              <div
                className={cn(
                  "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
                  pending && "opacity-60 transition-opacity"
                )}
              >
                {items.map((p) => (
                  <PlaceCard key={p.id} place={p} />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPage={(p) => update({ page: String(p) })}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile bottom-sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-ink">Фільтри</h3>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Закрити"
                className="text-slate-400 hover:text-ink"
              >
                <X size={20} />
              </button>
            </div>
            {Sidebar}
            <button
              onClick={() => setMobileOpen(false)}
              className="mt-6 w-full rounded-xl bg-ink py-3 text-sm font-medium text-white"
            >
              Показати {total}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FacetRow({
  label,
  count,
  active,
  onClick,
  icon,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
          active
            ? "bg-emerald-50 font-medium text-emerald"
            : "text-slate-600 hover:bg-sand-200/60"
        )}
      >
        {icon && <span className={active ? "text-emerald" : "text-slate-400"}>{icon}</span>}
        <span className="truncate">{label}</span>
        {count != null && (
          <span className={cn("ml-auto text-xs", active ? "text-emerald" : "text-slate-400")}>
            {count}
          </span>
        )}
      </button>
    </li>
  );
}

function CheckRow({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 text-left text-sm text-slate-600 hover:text-ink"
    >
      <span
        className={cn(
          "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border transition-colors",
          checked ? "border-emerald bg-emerald text-white" : "border-sand-300"
        )}
      >
        {checked && <Check size={12} />}
      </span>
      {label}
    </button>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald">
      {label}
      <button onClick={onRemove} aria-label={`Прибрати ${label}`} className="hover:text-emerald-700">
        <X size={13} />
      </button>
    </span>
  );
}

function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  const pages = pageRange(page, totalPages);
  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Пагінація">
      <PageBtn disabled={page <= 1} onClick={() => onPage(page - 1)} label="‹" />
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-sm text-slate-400">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p as number)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "flex h-9 min-w-9 items-center justify-center rounded-lg border px-2.5 text-sm transition-colors",
              p === page
                ? "border-emerald bg-emerald-50 font-medium text-emerald"
                : "border-sand-300 text-slate-600 hover:bg-sand-200/60"
            )}
          >
            {p}
          </button>
        )
      )}
      <PageBtn disabled={page >= totalPages} onClick={() => onPage(page + 1)} label="›" />
    </nav>
  );
}

function PageBtn({
  disabled,
  onClick,
  label,
}: {
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-sand-300 text-slate-600 transition-colors hover:bg-sand-200/60 disabled:opacity-40 disabled:hover:bg-transparent"
    >
      {label}
    </button>
  );
}

function pageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) out.push("…");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push("…");
  out.push(total);
  return out;
}

function PlaceCard({ place }: { place: PlaceWithRelations }) {
  const cat = getPlaceCategory(place.category);
  const Icon = cat?.icon;
  const premium = place.plan === "premium";
  const featured = place.is_featured || place.plan === "featured";

  return (
    <Link
      href={`/places/${place.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl bg-white transition-colors",
        premium
          ? "border-2 border-emerald/40 hover:border-emerald"
          : "border border-sand-300 hover:border-emerald/40"
      )}
    >
      {/* Обкладинка */}
      <div className="relative aspect-[16/9] overflow-hidden bg-sand-200">
        {place.cover_image ? (
          <Image
            src={place.cover_image}
            alt={place.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-sand-200">
            {Icon && <Icon size={40} className="text-emerald/30" strokeWidth={1.5} />}
          </div>
        )}

        {/* Логотип поверх обкладинки */}
        {place.logo && (
          <span className="absolute bottom-0 left-4 translate-y-1/2 overflow-hidden rounded-xl border-2 border-white bg-white shadow-sm">
            <Image
              src={place.logo}
              alt={`${place.name} лого`}
              width={44}
              height={44}
              className="h-11 w-11 object-cover"
            />
          </span>
        )}

        {/* Бейдж featured/premium */}
        {(premium || featured) && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-xs font-medium text-gold-600 shadow-sm backdrop-blur">
            <Star size={11} className="fill-gold-500 text-gold-500" />
            {premium ? "Premium" : "Рекомендовано"}
          </span>
        )}
      </div>

      {/* Контент */}
      <div className={cn("flex flex-1 flex-col p-5", place.logo && "pt-7")}>
        <div className="flex items-start gap-3">
          {!place.logo && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald">
              {Icon && <Icon size={16} />}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-semibold leading-snug text-ink group-hover:text-emerald">
              {place.name}
            </h3>
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
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald">
              Українською
            </span>
          )}
          {place.city && (
            <span className="inline-flex items-center gap-1 rounded-full bg-sand-200/70 px-2 py-0.5 text-xs text-slate-500">
              <MapPin size={11} /> {place.city.name}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
