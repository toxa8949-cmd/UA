import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RelocationBudgetCalculator } from "@/components/calculators/RelocationBudgetCalculator";
import { getCountries } from "@/server/queries/countries";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Калькулятор бюджету переїзду за кордон",
  description: "Оцініть, скільки коштів потрібно для переїзду: квитки, депозит, оренда, документи, страховка та резерв.",
  path: "/calculators/relocation-budget",
});

export default async function Page() {
  const countries = await getCountries();
  return (
    <>
      <Breadcrumbs items={[
        { name: "Головна", url: "/" },
        { name: "Калькулятори", url: "/calculators" },
        { name: "Бюджет переїзду", url: "/calculators/relocation-budget" },
      ]} />
      <div className="container pb-16">
        <h1 className="text-3xl font-bold text-slate-900">Калькулятор бюджету переїзду</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Порахуйте мінімальний, комфортний та ризиковий бюджет для переїзду.
        </p>
        <div className="mt-8">
          <RelocationBudgetCalculator countries={countries} />
        </div>
      </div>
    </>
  );
}
