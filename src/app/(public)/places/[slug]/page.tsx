import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getPlaceBySlug } from "@/server/queries/places";
import { placeCategoryLabel, getPlaceCategory, LANGUAGE_LABELS } from "@/lib/places";
import { buildMetadata } from "@/lib/seo";
import { MapPin, Phone, Globe, Instagram, Send, Mail, Clock, Check } from "lucide-react";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);
  if (!place) return buildMetadata({ title: "Не знайдено", noIndex: true });

  const where = place.city?.name ? ` у місті ${place.city.name}` : "";
  return buildMetadata({
    title: place.seo_title ?? `${place.name} — ${placeCategoryLabel(place.category)}${where}`,
    description: place.seo_description ?? place.description ?? undefined,
    path: `/places/${slug}`,
  });
}

export default async function PlacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);
  if (!place) notFound();

  const cat = getPlaceCategory(place.category);
  const Icon = cat?.icon;

  const contacts: { icon: typeof Phone; label: string; href: string }[] = [];
  if (place.phone) contacts.push({ icon: Phone, label: place.phone, href: `tel:${place.phone}` });
  if (place.website) contacts.push({ icon: Globe, label: "Вебсайт", href: place.website });
  if (place.instagram)
    contacts.push({ icon: Instagram, label: `@${place.instagram}`, href: `https://instagram.com/${place.instagram}` });
  if (place.telegram)
    contacts.push({ icon: Send, label: place.telegram, href: `https://t.me/${place.telegram.replace("@", "")}` });
  if (place.email) contacts.push({ icon: Mail, label: place.email, href: `mailto:${place.email}` });

  return (
    <>
      <Breadcrumbs items={[
        { name: "Головна", url: "/" },
        { name: "Українцям поруч", url: "/places" },
        { name: place.name, url: `/places/${slug}` },
      ]} />

      <div className="container pb-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Основне */}
          <div>
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald">
                {Icon && <Icon size={26} />}
              </span>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-emerald">
                  {placeCategoryLabel(place.category)}
                </p>
                <h1 className="mt-1 font-display text-3xl font-bold text-ink">{place.name}</h1>
                <p className="mt-1 text-sm text-slate-500">
                  {place.city?.name}
                  {place.country?.name && `, ${place.country.name}`}
                </p>
              </div>
            </div>

            {place.languages?.includes("uk") && (
              <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald">
                <Check size={14} /> Обслуговують українською
              </span>
            )}

            {place.description && (
              <div className="prose-content mt-6 max-w-2xl">
                <p className="leading-relaxed text-slate-600">{place.description}</p>
              </div>
            )}

            {place.languages && place.languages.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold text-ink">Мови обслуговування</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {place.languages.map((l) => (
                    <span key={l} className="rounded-lg border border-sand-300 bg-white px-3 py-1 text-sm text-slate-600">
                      {LANGUAGE_LABELS[l] ?? l}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Бічна панель: контакти */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-sand-300 bg-white p-5">
              <h2 className="font-display font-semibold text-ink">Контакти</h2>
              <div className="mt-4 space-y-3">
                {place.address && (
                  <div className="flex items-start gap-2.5 text-sm text-slate-600">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" />
                    <span>{place.address}</span>
                  </div>
                )}
                {place.working_hours && (
                  <div className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Clock size={16} className="mt-0.5 shrink-0 text-slate-400" />
                    <span>{place.working_hours}</span>
                  </div>
                )}
                {contacts.map((c, i) => (
                  <a
                    key={i}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-2.5 text-sm text-slate-600 transition-colors hover:text-emerald"
                  >
                    <c.icon size={16} className="shrink-0 text-slate-400" />
                    <span>{c.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {place.city && (
              <Link
                href="/places"
                className="mt-4 block rounded-2xl border border-sand-300 bg-sand-100/60 p-4 text-center text-sm font-medium text-emerald transition-colors hover:bg-sand-200"
              >
                ← Усі українські послуги
              </Link>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
