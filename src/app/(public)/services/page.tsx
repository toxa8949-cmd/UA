import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ServiceCatalog } from "@/components/service/ServiceCatalog";
import { getServicesWithRelations, getServiceCategories } from "@/server/queries/services";
import { getCountries } from "@/server/queries/countries";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Каталог сервісів для українців за кордоном",
  description: "Банки, eSIM, перекази грошей, страхування, бухгалтерія та інші корисні сервіси для життя за кордоном. Фільтр за країною, категорією та рейтингом.",
  path: "/services",
});

export default async function ServicesPage() {
  const [services, countries, categories] = await Promise.all([
    getServicesWithRelations(),
    getCountries(),
    getServiceCategories(),
  ]);

  return (
    <>
      <Breadcrumbs items={[{ name: "Головна", url: "/" }, { name: "Сервіси", url: "/services" }]} />
      <div className="container pb-16">
        <h1 className="font-display text-3xl font-bold text-ink">Каталог сервісів</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Перевірені сервіси для переказів, звʼязку, страхування та бізнесу за кордоном.
          Оберіть країну, категорію або рейтинг, щоб звузити пошук.
        </p>
        <div className="mt-8">
          <ServiceCatalog services={services} countries={countries} categories={categories} />
        </div>
      </div>
    </>
  );
}
