import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ServiceCard } from "@/components/service/ServiceCard";
import { getServices } from "@/server/queries/services";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Каталог сервісів для українців за кордоном",
  description: "Банки, eSIM, перекази грошей, страхування, бухгалтерія та інші корисні сервіси для життя за кордоном.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <Breadcrumbs items={[{ name: "Головна", url: "/" }, { name: "Сервіси", url: "/services" }]} />
      <div className="container pb-16">
        <h1 className="text-3xl font-bold text-ink">Каталог сервісів</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Перевірені сервіси для переказів, звʼязку, страхування та бізнесу за кордоном.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => <ServiceCard key={s.id} service={s} />)}
        </div>
      </div>
    </>
  );
}
