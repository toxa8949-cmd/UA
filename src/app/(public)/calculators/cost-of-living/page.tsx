import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CostOfLivingCalculator } from "@/components/calculators/CostOfLivingCalculator";
import { getCountries } from "@/server/queries/countries";
import { getEurRates } from "@/lib/currency";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Калькулятор вартості життя за кордоном",
  description: "Порахуйте місячні витрати на життя у Польщі, Німеччині, Чехії, Іспанії чи Португалії: оренда, їжа, транспорт, медицина.",
  path: "/calculators/cost-of-living",
});

export default async function Page() {
  const [countries, rates] = await Promise.all([getCountries(), getEurRates()]);
  return (
    <>
      <Breadcrumbs items={[
        { name: "Головна", url: "/" },
        { name: "Калькулятори", url: "/calculators" },
        { name: "Вартість життя", url: "/calculators/cost-of-living" },
      ]} />
      <div className="container pb-16">
        <h1 className="text-3xl font-bold text-ink">Калькулятор вартості життя</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Введіть свої витрати, щоб оцінити місячний бюджет та рівень витрат.
        </p>
        <div className="mt-8">
          <CostOfLivingCalculator countries={countries} rates={rates} />
        </div>
      </div>
    </>
  );
}
