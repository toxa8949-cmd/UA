import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  getServiceBySlug,
  getServiceSlugs,
} from "@/server/queries/services";
import { buildMetadata } from "@/lib/seo";
import { Star, Check, X } from "lucide-react";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return buildMetadata({
    title: service.name,
    description: service.description ?? undefined,
    path: `/services/${slug}`,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Головна", url: "/" },
          { name: "Сервіси", url: "/services" },
          { name: service.name, url: `/services/${slug}` },
        ]}
      />
      <div className="container max-w-3xl pb-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ink">{service.name}</h1>
            {service.category && <Badge className="mt-2">{service.category.name}</Badge>}
          </div>
          {service.rating != null && (
            <span className="flex items-center gap-1 text-lg font-semibold text-slate-700">
              <Star size={18} className="fill-accent-500 text-accent-500" /> {service.rating}
            </span>
          )}
        </div>

        {service.description && <p className="mt-4 text-lg text-slate-600">{service.description}</p>}

        <a
          href={`/go/${service.slug}`}
          rel="nofollow sponsored"
          className="mt-6 inline-flex rounded-lg bg-brand-600 px-6 py-3 font-medium text-white hover:bg-brand-700"
        >
          Перейти на сайт →
        </a>
        <p className="mt-2 text-xs text-slate-400">Може містити партнерське посилання.</p>

        {service.pricing_summary && (
          <Card className="mt-6">
            <p className="text-sm text-slate-500">Ціни</p>
            <p className="mt-1 font-medium text-ink">{service.pricing_summary}</p>
          </Card>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {service.pros.length > 0 && (
            <Card>
              <h2 className="font-semibold text-ink">Переваги</h2>
              <ul className="mt-3 space-y-2">
                {service.pros.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check size={16} className="mt-0.5 shrink-0 text-green-600" /> {p}
                  </li>
                ))}
              </ul>
            </Card>
          )}
          {service.cons.length > 0 && (
            <Card>
              <h2 className="font-semibold text-ink">Недоліки</h2>
              <ul className="mt-3 space-y-2">
                {service.cons.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-slate-600">
                    <X size={16} className="mt-0.5 shrink-0 text-red-500" /> {c}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {service.countries.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-2 font-semibold text-ink">Доступно в країнах</h2>
            <div className="flex flex-wrap gap-2">
              {service.countries.map((c) => (
                <Link key={c.id} href={`/countries/${c.slug}`}>
                  <Badge color="emerald">{c.emoji} {c.name}</Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
