import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { PlaceGrid } from "@/components/place/PlaceGrid";
import { getPlacesPage, getLandingIndex } from "@/server/queries/places";
import {
  getPlaceCategory,
  placeCategoryLabel,
  categoryServicePhrase,
  cityLocative,
  COUNTRY_LOCATIVE,
} from "@/lib/places";
import {
  buildMetadata,
  breadcrumbJsonLd,
  faqJsonLd,
  itemListJsonLd,
} from "@/lib/seo";
import { ArrowRight } from "lucide-react";

export const revalidate = 3600;

type Params = Promise<{ category: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getPlaceCategory(category);
  if (!cat) return buildMetadata({ title: "Не знайдено", noIndex: true });

  const { rows } = await getLandingIndex();
  const count = rows.filter((r) => r.category === category).length;

  return buildMetadata({
    title: `${cat.label} для українців за кордоном`,
    description: `${cat.label} з обслуговуванням українською мовою у Європі: Польща, Німеччина, Чехія, Іспанія, Португалія. Перевірені контакти, адреси, графік роботи. Каталог «Українцям поруч».`,
    path: `/places/c/${category}`,
    noIndex: count === 0,
  });
}

export default async function CategoryLandingPage({
  params,
}: {
  params: Params;
}) {
  const { category } = await params;
  const cat = getPlaceCategory(category);
  if (!cat) notFound();

  const [result, index] = await Promise.all([
    getPlacesPage({ category, perPage: 24 }),
    getLandingIndex(),
  ]);

  const label = cat.label;
  const service = categoryServicePhrase(category);

  // Міста та країни, де є ця категорія (для перелінковки)
  const cityCounts = new Map<string, number>();
  const countryCounts = new Map<string, number>();
  for (const r of index.rows) {
    if (r.category !== category) continue;
    if (r.city_id) cityCounts.set(r.city_id, (cityCounts.get(r.city_id) ?? 0) + 1);
    if (r.country_id)
      countryCounts.set(r.country_id, (countryCounts.get(r.country_id) ?? 0) + 1);
  }
  const cityLinks = index.cities
    .filter((c) => cityCounts.has(c.id))
    .map((c) => ({ ...c, count: cityCounts.get(c.id)! }))
    .sort((a, b) => b.count - a.count);
  const countryLinks = index.countries
    .filter((c) => countryCounts.has(c.id))
    .map((c) => ({ ...c, count: countryCounts.get(c.id)! }))
    .sort((a, b) => b.count - a.count);

  const breadcrumbs = [
    { name: "Головна", url: "/" },
    { name: "Українцям поруч", url: "/places" },
    { name: label, url: `/places/c/${category}` },
  ];

  const faqs = [
    {
      question: `Як знайти ${service} українською мовою за кордоном?`,
      answer: `У цьому каталозі зібрані ${label.toLowerCase()}, які обслуговують українською. Оберіть своє місто чи країну — на сторінці кожного закладу є контакти, адреса та графік роботи.`,
    },
    {
      question: `У яких країнах є ${label.toLowerCase()} з каталогу?`,
      answer: countryLinks.length
        ? `Наразі ${label.toLowerCase()} представлені у: ${countryLinks
            .map((c) => c.name)
            .join(", ")}. Каталог постійно поповнюється.`
        : `Каталог постійно поповнюється — скористайтеся пошуком у розділі «Українцям поруч».`,
    },
    {
      question: `Як додати свій бізнес до каталогу?`,
      answer: `Напишіть нам через сторінку контактів — додавання до каталогу «Українцям поруч» безкоштовне для українських бізнесів і спеціалістів.`,
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={faqJsonLd(faqs)} />
      {result.items.length > 0 && (
        <JsonLd
          data={itemListJsonLd(
            result.items.map((p) => ({
              name: p.name,
