import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PlacesCatalog } from "@/components/place/PlacesCatalog";
import { getPlacesWithRelations } from "@/server/queries/places";
import { getCountries } from "@/server/queries/countries";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Українські послуги та бізнеси за кордоном",
  description: "Каталог українських спеціалістів і закладів у Європі: бухгалтери, юристи, психологи, лікарі, садочки, магазини, кафе. Пошук за країною, містом і категорією.",
  path: "/places",
});

export default async function PlacesPage() {
  const [places, countries] = await Promise.all([
    getPlacesWithRelations(),
    getCountries(),
  ]);

  return (
    <>
      <Breadcrumbs items={[{ name: "Головна", url: "/" }, { name: "Українцям поруч", url: "/places" }]} />
      <div className="container pb-16">
        <h1 className="font-display text-3xl font-bold text-ink">Українцям поруч</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Українські спеціалісти та заклади за кордоном — ті, що обслуговують рідною мовою.
          Бухгалтери, юристи, психологи, лікарі, садочки, магазини й кафе у вашому місті.
        </p>

        {places.length === 0 ? (
          <p className="mt-8 text-slate-500">Записи зʼявляться найближчим часом.</p>
        ) : (
          <div className="mt-8">
            <PlacesCatalog places={places} countries={countries} />
          </div>
        )}
      </div>
    </>
  );
}
