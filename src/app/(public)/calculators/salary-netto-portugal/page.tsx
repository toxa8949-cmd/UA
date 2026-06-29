import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SalaryNettoBruttoPTCalculator } from "@/components/calculators/SalaryNettoBruttoPTCalculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Калькулятор зарплати netto/bruto у Португалії 2026 (salário líquido)",
  description: "Розрахунок salário líquido з ilíquido у Португалії: Segurança Social, IRS retenção, 12/14 виплат. За таблицями 2026. Актуально.",
  path: "/calculators/salary-netto-portugal",
  ogEyebrow: "Калькулятор",
});

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[
        { name: "Головна", url: "/" },
        { name: "Калькулятори", url: "/calculators" },
        { name: "Зарплата netto/bruto у Португалії", url: "/calculators/salary-netto-portugal" },
      ]} />
      <div className="container pb-16">
        <h1 className="text-3xl font-bold text-ink">
          Калькулятор зарплати netto/bruto у Португалії
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Введіть salário ilíquido (bruto) — і побачите salário líquido (на руки) після
          Segurança Social та IRS. За офіційними таблицями retenção 2026, з вибором 12/14
          виплат. Актуально на 2026 рік.
        </p>
        <div className="mt-8">
          <SalaryNettoBruttoPTCalculator />
        </div>
      </div>
    </>
  );
}
