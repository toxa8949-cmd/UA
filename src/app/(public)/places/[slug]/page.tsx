import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPlaceBySlug, getRelatedPlaces } from "@/server/queries/places";
import {
  placeCategoryLabel,
  getPlaceCategory,
  LANGUAGE_LABELS,
  generatePlaceIntro,
  generatePlaceFaqs,
} from "@/lib/places";
import {
  buildMetadata,
  localBusinessJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo";
import { MapPin, Phone, Globe, Instagram, Send, Mail, Clock, Check, ArrowUpRight } from "lucide-react";

export const revalidate = 3600;

// ISR: сторінка закладу генерується на першому візиті й кешується на 1 год
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);
  if (!place) return buildMetadata({ title: "Не знайдено", noIndex: true });

  const label = placeCategoryLabel(place.category);
  const where = place.city?.name ? ` у ${place.city.name}` : place.country?.name ? ` у ${place.country.name}` : "";
  const title = place.seo_title ?? `${place.name} — ${label}${where} | Українцям поруч`;
  const desc =
    place.seo_description ??
    place.description ??
    `${place.name} — ${label.toLowerCase()}${where}. Обслуговування українською мовою. Контакти, адреса, графік роботи.`;

  return buildMetadata({
    title,
    description: desc,
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

  const related = await getRelatedPlaces(place, 3);

  const cat = getPlaceCategory(place.category);
  const Icon = cat?.icon;
  const label = placeCategoryLabel(place.category);

  // контент: редакційний full_description АБО авто-генерований
  const intro = place.full_description
    ? place.full_description.split(/\n\n+/).filter(Boolean)
    : generatePlaceIntro(place);
  const faqs = generatePlaceFaqs(place);

  const breadcrumbs = [
    { name: "Головна", url: "/" },
    { name: "Українцям поруч", url: "/places" },
    { name: place.name, url: `/places/${slug}` },
  ];

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
      <JsonLd
        data={localBusinessJsonLd({
          name: place.name,
          description: place.description,
          category: place.category,
          address: place.address,
          city: place.city?.name,
          country: place.country?.name,
          phone: place.phone,
          website: place.website,
          url: `/places/${slug}`,
          latitude: place.latitude,
          longitude: place.longitude,
          languages: place.languages,
        })}
      />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={faqJsonLd(faqs)} />

      <Breadcrumbs items={breadcrumbs} />

      {/* Герой-обкладинка */}
      {place.cover_image && (
        <div className="container">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl bg-sand-200 sm:aspect-[3/1]">
            <Image
              src={place.cover_image}
              alt={place.name}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      <div className="container pb-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Основне */}
          <div className="min-w-0">
            <div className={`flex items-start gap-4 ${place.cover_image ? "mt-6" : ""}`}>
              {place.logo ? (
                <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-sand-300 bg-white">
                  <Image
                    src={place.logo}
                    alt={`${place.name} лого`}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </span>
              ) : (
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald">
                  {Icon && <Icon size={26} />}
                </span>
              )}
              <div>
                <Link
                  href={`/places/c/${place.category}`}
                  className="font-mono text-xs uppercase tracking-widest text-emerald hover:underline"
                >
                  {label}
                </Link>
                <h1 className="mt-1 font-display text-3xl font-bold text-ink">{place.name}</h1>
                <p className="mt-1 text-sm text-slate-500">
                  {place.city?.name}
                  {place.city?.name && place.country?.name && ", "}
                  {place.country?.name}
                </p>
              </div>
            </div>

            {place.languages?.includes("uk") && (
              <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald">
                <Check size={14} /> Обслуговують українською
              </span>
            )}

            {/* Контент */}
            <div className="prose-content mt-6 max-w-2xl">
              {intro.map((p, i) => (
                <p key={i} className="mb-4 leading-relaxed text-slate-600">
                  {p}
                </p>
              ))}
            </div>

            {/* Мови */}
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

            {/* FAQ */}
            <div className="mt-10 max-w-2xl">
              <h2 className="mb-4 font-display text-2xl font-bold text-ink">Часті запитання</h2>
              <div className="space-y-3">
                {faqs.map((f, i) => (
                  <details
                    key={i}
                    className="group rounded-xl border border-sand-300 bg-white p-4 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-3 font-medium text-ink">
                      {f.question}
                      <span className="text-slate-400 transition-transform group-open:rotate-180">⌄</span>
                    </summary>
                    <p className="mt-3 leading-relaxed text-slate-600">{f.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Бічна панель */}
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

            {place.city?.slug && (
              <Link
                href={`/places/c/${place.category}/${place.city.slug}`}
                className="mt-4 block rounded-2xl border border-sand-300 bg-white p-4 text-center text-sm font-medium text-emerald transition-colors hover:bg-sand-100"
              >
                Усі {label.toLowerCase()} у {place.city.name} →
              </Link>
            )}

            <Link
              href="/places"
              className="mt-4 block rounded-2xl border border-sand-300 bg-sand-100/60 p-4 text-center text-sm font-medium text-emerald transition-colors hover:bg-sand-200"
            >
              ← Усі українські послуги
            </Link>
          </aside>
        </div>

        {/* Схожі поруч */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-sand-300 pt-12">
            <h2 className="mb-5 font-display text-2xl font-bold text-ink">
              Схожі {label.toLowerCase()}{place.city?.name ? ` у ${place.city.name}` : ""}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => {
                const RIcon = getPlaceCategory(r.category)?.icon;
                return (
                  <Link
                    key={r.id}
                    href={`/places/${r.slug}`}
                    className="group flex flex-col rounded-2xl border border-sand-300 bg-white p-5 transition-colors hover:border-emerald/40"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald">
                        {RIcon && <RIcon size={18} />}
                      </span>
                      <div className="min-w-0">
                        <span className="block font-display font-semibold leading-snug text-ink group-hover:text-emerald">
                          {r.name}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-400">
                          {placeCategoryLabel(r.category)}
                          {r.city?.name && ` · ${r.city.name}`}
                        </span>
                      </div>
                      <ArrowUpRight size={15} className="ml-auto shrink-0 text-slate-300 group-hover:text-emerald" />
                    </div>
                    {r.description && (
                      <p className="mt-3 line-clamp-2 text-sm text-slate-600">{r.description}</p>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
