import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { TaxIndependentPTCalculator } from "@/components/calculators/TaxIndependentPTCalculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Калькулятор податків самозайнятого (recibos verdes) у Португалії 2026",
  description: "Порахуйте, скільки залишається на руки на recibos verdes у Португалії: regime simplificado, IRS та Segurança Social. З пільгою для першого року. Актуально на 2026.",
  path: "/calculators/tax-independent-portugal",
  ogEyebrow: "Калькулятор",
});

export default function Page() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Головна", url: "/" },
          { name: "Калькулятори", url: "/calculators" },
          { name: "Податки самозайнятого у Португалії", url: "/calculators/tax-independent-portugal" },
        ]}
      />
      <div className="container pb-16">
        <h1 className="text-3xl font-bold text-ink">
          Калькулятор податків самозайнятого у Португалії
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Введіть місячний дохід — і побачите, скільки залишається на руки на recibos verdes
          (regime simplificado). Розрахунок враховує IRS і Segurança Social, з пільгою для
          першого року діяльності. Актуально на 2026 рік.
        </p>
        <div className="mt-8">
          <TaxIndependentPTCalculator />
        </div>
      </div>
    </>
  );
}
