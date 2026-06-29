import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CityCatalog } from "@/components/city/CityCatalog";
import { getCitiesWithCountry } from "@/server/queries/cities";
import { getCountries } from "@/server/queries/countries";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Міста Європи для українців: життя, оренда, зарплати",
  description: "Детально про життя, роботу, оренду та зарплати у містах Польщі, Німеччини, Чехії, Іспанії та Португалії. Пошук і фільтр за країною.",
  path: "/cities",
});

export default async function CitiesPage() {
  const [cities, countries] = await Promise.all([
    getCitiesWithCountry(),
    getCountries(),
  ]);

  return (
    <>
      <Breadcrumbs items={[{ name: "Головна", url: "/" }, { name: "Міста", url: "/cities" }]} />
      <div className="container pb-16">
        <h1 className="font-display text-3xl font-bold text-ink">Міста Європи</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Детально про життя, роботу, оренду та зарплати в популярних містах. Оберіть країну
          або знайдіть місто за назвою.
        </p>

        {cities.length === 0 ? (
          <p className="mt-8 text-slate-500">Міста зʼявляться найближчим часом.</p>
        ) : (
          <div className="mt-8">
            <CityCatalog cities={cities} countries={countries} />
          </div>
        )}
      </div>
    </>
  );
}
