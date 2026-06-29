import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { TaxAutonomoESCalculator } from "@/components/calculators/TaxAutonomoESCalculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Калькулятор податків autónomo в Іспанії 2026",
  description: "Порахуйте, скільки залишається на руки як autónomo в Іспанії: cuota за траншами, IRPF та tarifa plana для новачків. Актуально на 2026.",
  path: "/calculators/tax-autonomo-spain",
  ogEyebrow: "Калькулятор",
});

export default function Page() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Головна", url: "/" },
          { name: "Калькулятори", url: "/calculators" },
          { name: "Податки autónomo в Іспанії", url: "/calculators/tax-autonomo-spain" },
        ]}
      />
      <div className="container pb-16">
        <h1 className="text-3xl font-bold text-ink">
          Калькулятор податків autónomo в Іспанії
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Введіть місячний дохід — і побачите, скільки залишається на руки як autónomo
          (estimación directa simplificada). Розрахунок враховує cuota за траншами доходу та
          IRPF, з пільгою tarifa plana для новачків. Актуально на 2026 рік.
        </p>
        <div className="mt-8">
          <TaxAutonomoESCalculator />
        </div>
      </div>
    </>
  );
}
