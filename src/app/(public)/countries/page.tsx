import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CountryCard } from "@/components/country/CountryCard";
import { getCountries } from "@/server/queries/countries";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Країни для українців",
  description: "Польща, Німеччина, Чехія, Іспанія, Португалія — документи, податки, житло та вартість життя для українців.",
  path: "/countries",
});

export default async function CountriesPage() {
  const countries = await getCountries();
  return (
    <>
      <Breadcrumbs items={[{ name: "Головна", url: "/" }, { name: "Країни", url: "/countries" }]} />
      <div className="container pb-16">
        <h1 className="text-3xl font-bold text-ink">Країни для українців</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Оберіть країну, щоб дізнатися про документи, податки, житло, роботу та вартість життя.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((c) => <CountryCard key={c.id} country={c} />)}
        </div>
      </div>
    </>
  );
}
