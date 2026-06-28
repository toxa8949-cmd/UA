import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CompareTable } from "@/components/country/CompareTable";
import { getCountries } from "@/server/queries/countries";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Порівняння країн для українців",
  description: "Порівняйте Польщу, Німеччину, Чехію, Іспанію та Португалію за зарплатами, орендою, податками, медициною та вартістю життя.",
  path: "/compare",
});

export default async function ComparePage() {
  const countries = await getCountries();
  return (
    <>
      <Breadcrumbs items={[{ name: "Головна", url: "/" }, { name: "Порівняння", url: "/compare" }]} />
      <div className="container pb-16">
        <h1 className="text-3xl font-bold text-slate-900">Порівняння країн</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Оберіть країни та порівняйте ключові показники поруч.
        </p>
        <div className="mt-8">
          <CompareTable countries={countries} />
        </div>
      </div>
    </>
  );
}
