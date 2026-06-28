import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SalaryNettoBruttoCalculator } from "@/components/calculators/SalaryNettoBruttoCalculator";
import { getCountries } from "@/server/queries/countries";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Калькулятор зарплати netto/brutto",
  description: "Приблизний розрахунок чистої зарплати після податків і соцвнесків у Польщі, Німеччині, Чехії, Іспанії та Португалії.",
  path: "/calculators/salary-netto-brutto",
  ogEyebrow: "Калькулятор",
});

export default async function Page() {
  const countries = await getCountries();
  return (
    <>
      <Breadcrumbs items={[
        { name: "Головна", url: "/" },
        { name: "Калькулятори", url: "/calculators" },
        { name: "Зарплата netto/brutto", url: "/calculators/salary-netto-brutto" },
      ]} />
      <div className="container pb-16">
        <h1 className="text-3xl font-bold text-ink">Калькулятор зарплати netto/brutto</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Оцініть приблизну чисту зарплату після утримань.
        </p>
        <div className="mt-8">
          <SalaryNettoBruttoCalculator countries={countries} />
        </div>
      </div>
    </>
  );
}
