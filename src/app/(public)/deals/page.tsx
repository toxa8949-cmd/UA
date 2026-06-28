import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getDeals } from "@/server/queries/services";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Бонуси та реферальні пропозиції",
  description: "Актуальні бонуси банків, сервісів та реферальні пропозиції для українців за кордоном.",
  path: "/deals",
});

export default async function DealsPage() {
  const deals = await getDeals();
  return (
    <>
      <Breadcrumbs items={[{ name: "Головна", url: "/" }, { name: "Бонуси", url: "/deals" }]} />
      <div className="container pb-16">
        <h1 className="text-3xl font-bold text-ink">Бонуси та пропозиції</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Вигідні пропозиції від сервісів. Може містити партнерські посилання.
        </p>
        {deals.length === 0 ? (
          <p className="mt-8 text-slate-500">Наразі немає активних пропозицій. Завітайте пізніше.</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deals.map((d) => (
              <Card key={d.id} className="flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-ink">{d.title}</h3>
                  {d.bonus_amount && <Badge color="emerald">{d.bonus_amount}</Badge>}
                </div>
                {d.description && <p className="mt-2 flex-1 text-sm text-slate-600">{d.description}</p>}
                <a
                  href={`/go/${d.slug}`}
                  rel="nofollow sponsored"
                  className="mt-4 rounded-lg bg-brand-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-brand-700"
                >
                  Отримати бонус
                </a>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
